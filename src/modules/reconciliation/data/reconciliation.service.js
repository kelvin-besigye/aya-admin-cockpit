/**
 * 👑 AYABUS DATABASE ENGINE (v3.0 Sovereign)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt Clearinghouse
 * File: reconciliation.service.js
 * * DESCRIPTION:
 * The secure bridge between the frontend and the Supabase database.
 * Handles the fetching of cancellation queues, routing to Approvals, 
 * and executing the Double-Entry Treasury ledger updates.
 */

import { supabase } from '../../../lib/supabase';
import { ReconciliationPhysics } from './reconciliation.physics';

export const reconciliationService = {

    // ========================================================================
    // 1. THE TRIAGE QUEUE (Fetch Tickets Awaiting Action)
    // ========================================================================
    /**
     * Fetches tickets where the customer clicked "Cancel" in the app.
     * Status: 'CANCELLATION_REQUESTED'
     */
    fetchPendingCancellations: async () => {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select(`
                    *,
                    partners (company_name, id),
                    routes (origin_city, destination_city)
                `)
                .eq('status', 'CANCELLATION_REQUESTED')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error("Service Error [fetchPendingCancellations]:", error);
            return { success: false, error: error.message };
        }
    },

    // ========================================================================
    // 2. THE MAKER ACTION (Initiate & Send to Approvals)
    // ========================================================================
    /**
     * Called by L1 Admin. Calculates the math using the Physics Engine, 
     * locks the ticket, and sends it to the Approvals Firewall.
     */
    initiateRefundRequest: async (ticket, systemSettings) => {
        try {
            // 1. Run the math through our absolute physics engine
            const settlementMath = ReconciliationPhysics.calculateSettlement(ticket, systemSettings);

            if (settlementMath.status !== 'VALID') {
                throw new Error("Financial Checksum Failed. Aborting to prevent leakage.");
            }

            // 2. Prepare the payload for the Approvals Module
            const approvalPayload = {
                target_module: 'RECONCILIATION',
                target_record_id: ticket.id,
                action_type: 'REFUND_AUTHORIZATION',
                payload_snapshot: settlementMath.financials, // The L9 Admin will see exactly this math
                status: 'PENDING',
                requested_by: 'L1_ADMIN_SYSTEM' // In real life, pull from auth context
            };

            // 3. Database Transaction (Update Ticket + Create Approval Request)
            // *Using individual calls here. In production, wrap in a Supabase RPC for atomic safety.
            
            const { error: ticketError } = await supabase
                .from('tickets')
                .update({ status: 'PENDING_APPROVAL' })
                .eq('id', ticket.id);
            
            if (ticketError) throw ticketError;

            const { error: approvalError } = await supabase
                .from('approvals')
                .insert([approvalPayload]);

            if (approvalError) {
                // Failsafe: Revert ticket if approval fails to lodge
                await supabase.from('tickets').update({ status: 'CANCELLATION_REQUESTED' }).eq('id', ticket.id);
                throw approvalError;
            }

            return { success: true, data: settlementMath };
        } catch (error) {
            console.error("Service Error [initiateRefundRequest]:", error);
            return { success: false, error: error.message };
        }
    },

    // ========================================================================
    // 3. THE CLAWBACK QUEUE (Fetch Approved, Unsettled Debt)
    // ========================================================================
    /**
     * Fetches tickets that an L9 Admin has approved, but the money 
     * hasn't actually been moved in the Treasury yet.
     */
    fetchApprovedLiabilities: async () => {
        try {
            const { data, error } = await supabase
                .from('tickets')
                .select(`
                    *,
                    partners (company_name, id)
                `)
                .eq('status', 'APPROVED_UNSETTLED') // Status set by the Approvals Module upon L9 click
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error("Service Error [fetchApprovedLiabilities]:", error);
            return { success: false, error: error.message };
        }
    },

    // ========================================================================
    // 4. THE TREASURY EXECUTION (Auto-Settlement & Double Entry)
    // ========================================================================
    /**
     * The final step. Deducts debt from the operator's ledger and 
     * officially closes the ticket.
     */
    executeTreasurySettlement: async (ticket, settlementMath) => {
        try {
            const financials = settlementMath.financials;
            const operatorId = ticket.partner_id || ticket.partners?.id;

            if (!operatorId) throw new Error("Operator ID missing. Cannot process Clawback.");

            // 1. Create the Double-Entry Receipts for the Treasury Module
            const ledgerEntries = [
                // ENTRY A: The Reversal (Debit)
                {
                    txn_id: `REV-${ticket.ticket_hash}-${Date.now()}`,
                    ticket_ref: ticket.ticket_hash,
                    partner_id: operatorId,
                    operator: ticket.partners?.company_name || 'Unknown Operator',
                    type: 'CANCELLATION_CLAWBACK',
                    total_gross: -Math.abs(financials.original_base_fare), 
                    payout_operator: -Math.abs(financials.original_base_fare),
                    payout_platform: 0,
                    status: 'SETTLED'
                },
                // ENTRY B: The Empty Seat Compensation (Credit)
                {
                    txn_id: `CMP-${ticket.ticket_hash}-${Date.now()}`,
                    ticket_ref: ticket.ticket_hash,
                    partner_id: operatorId,
                    operator: ticket.partners?.company_name || 'Unknown Operator',
                    type: 'PENALTY_COMPENSATION',
                    total_gross: financials.yield_operator_compensation,
                    payout_operator: financials.yield_operator_compensation,
                    payout_platform: financials.yield_platform_penalty_cut, // Platform logs its new profit here
                    status: 'SETTLED'
                }
            ];

            // 2. Push to Transactions Ledger
            const { error: txnError } = await supabase
                .from('transactions')
                .insert(ledgerEntries);

            if (txnError) throw txnError;

            // 3. Mark Ticket as Fully Settled
            const { error: finalizeError } = await supabase
                .from('tickets')
                .update({ 
                    status: 'REFUND_SETTLED',
                    refund_amount_paid: financials.payout_customer_refund
                })
                .eq('id', ticket.id);

            if (finalizeError) throw finalizeError;

            return { success: true };
        } catch (error) {
            console.error("Service Error [executeTreasurySettlement]:", error);
            return { success: false, error: error.message };
        }
    }
};

export default reconciliationService;