/**
 * 👑 AYABUS ADMIN COCKPIT (Level 1: The Brains - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner Management
 * File: partner.service.js
 *
 * FIXES APPLIED:
 * 1. getResolutionTickets: Now returns partner_note, target_asset_type,
 *    and requested_changes so the Admin UI can show full context of what
 *    the partner is actually requesting.
 * 2. getResolutionTickets: The 'description' field now correctly pulls from
 *    BOTH ticket.description (UniversalRequestDock submissions) AND
 *    ticket.partner_note (ChangeRequestEngine submissions) with a fallback,
 *    so the Admin never sees an empty description regardless of which form
 *    the partner used to submit their request.
 */

import { supabase } from '../../../services/api.config';
import { calculateAlgorithmicHealth, resolvePartnerTier, calculateYieldLeakage } from './partner.utils';

// ========================================================================
// 0. NETWORK SIMULATOR (Legacy Systems)
// Retained for modules not yet migrated to the live database
// ========================================================================
const simulateNetworkDelay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_OPERATORS = [
    { 
        id: '10042', 
        name: 'Kampala Modern Executive Transport Co.', 
        code: 'KME',
        rawMetrics: { onTimePct: 96, cancellationPct: 1.2, passengerRating: 4.8, disputePct: 0.5, cancelledTickets: 12, chargebacks: 2 }
    },
    { 
        id: '10087', 
        name: 'Gulu Swift Safaris', 
        code: 'GSS',
        rawMetrics: { onTimePct: 82, cancellationPct: 4.5, passengerRating: 3.9, disputePct: 2.1, cancelledTickets: 45, chargebacks: 8 }
    }
];

export const partnerService = {

    // ... [KEEP YOUR EXISTING getPartners, getPartnerProfile, getFleetRegistry, getComplianceVault MOCK FUNCTIONS HERE] ...

    getComplianceVault: async (partnerId) => {
        try {
            await simulateNetworkDelay(300);
            return [
                { docType: 'PSV_LICENCE', expiryDate: '2026-12-01', verifier: 'MoWT' },
                { docType: 'THIRD_PARTY_INSURANCE', expiryDate: '2026-03-15', verifier: 'Sanlam' }, 
                { docType: 'SPEED_GOVERNOR', expiryDate: '2025-10-01', verifier: 'Police IOV' } 
            ];
        } catch (error) {
            console.error(`PartnerService -> getComplianceVault: Failed for ID ${partnerId}`, error);
            throw error;
        }
    },

    // ========================================================================
    // 🚀 MAKER-CHECKER INTEGRATIONS (LIVE WIRES)
    // ========================================================================

    /**
     * FETCH RESOLUTION TICKETS (Live Dashboard Stream)
     * Reaches into the `partner_requests` vault and extracts actionable tickets.
     *
     * FIX 1: Now selects all relevant columns including partner_note,
     *         target_asset_type, and requested_changes so the Admin UI
     *         has full context of what the partner wants changed.
     *
     * FIX 2: The mapped 'description' field now falls back to partner_note
     *         if description is empty. This handles requests submitted via
     *         ChangeRequestEngine (which uses partner_note) vs
     *         UniversalRequestDock (which uses description).
     *
     * @param {string} partnerId - Optional: If null, fetches global network queue.
     */
    getResolutionTickets: async (partnerId = null) => {
        try {
            let query = supabase
                .from('partner_requests')
                .select(`
                    id,
                    partner_id,
                    request_type,
                    priority,
                    status,
                    description,
                    partner_note,
                    target_asset_type,
                    target_asset_id,
                    requested_changes,
                    document_url,
                    admin_response,
                    urgency,
                    created_at,
                    updated_at
                `)
                .in('status', ['PENDING', 'PROCESSING'])
                .order('created_at', { ascending: false });

            if (partnerId) {
                query = query.eq('partner_id', partnerId);
            }

            const { data, error } = await query;

            if (error) throw error;

            return (data || []).map(ticket => ({
                ticketId: ticket.id,
                partnerId: ticket.partner_id,
                category: ticket.request_type,
                priority: ticket.priority,
                urgency: ticket.urgency,
                status: ticket.status,

                // FIX: description falls back to partner_note so Admin always
                // sees something meaningful regardless of which form was used
                description: ticket.description || ticket.partner_note || 'No description provided.',

                // Full context fields for the Admin resolution UI
                partnerNote: ticket.partner_note,
                targetAssetType: ticket.target_asset_type,
                targetAssetId: ticket.target_asset_id,
                requestedChanges: ticket.requested_changes,

                documentUrl: ticket.document_url,
                adminResponse: ticket.admin_response,
                date: ticket.created_at,
                updatedAt: ticket.updated_at
            }));

        } catch (error) {
            console.error(`🚨 [Admin Cockpit] Resolution Ticket Sync Failed:`, error.message);
            return [];
        }
    },

    /**
     * RESOLVE SUPPORT TICKET (The L9 Admin Mutation)
     * Authorizes or Rejects the partner's request and writes Admin feedback.
     *
     * @param {string} ticketId - The UUID of the request
     * @param {string} resolutionStatus - 'RESOLVED' or 'REJECTED'
     * @param {string} adminResponse - The typed feedback from the Admin
     */
    resolveSupportTicket: async (ticketId, resolutionStatus, adminResponse) => {
        try {
            if (!ticketId || !resolutionStatus || !adminResponse) {
                throw new Error('VALIDATION_FAULT: Incomplete resolution payload.');
            }

            // Step 1: Optimistic lock — mark as processing immediately
            await supabase
                .from('partner_requests')
                .update({ status: 'PROCESSING' })
                .eq('id', ticketId);

            // Step 2: Commit the final resolution
            const { data, error } = await supabase
                .from('partner_requests')
                .update({
                    status: resolutionStatus,
                    admin_response: adminResponse,
                    updated_at: new Date().toISOString()
                })
                .eq('id', ticketId)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };

        } catch (error) {
            console.error(`🚨 [Admin Cockpit] Maker-Checker Resolution Failed:`, error.message);
            return { success: false, error: error.message };
        }
    }
};
