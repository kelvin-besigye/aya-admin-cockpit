/**
 * 👑 AYABUS ADMIN COCKPIT (Level 1: The Brains - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner Management
 * File: partner.service.js
 * * DESCRIPTION:
 * The apex data fetching engine for the Admin Partner Ecosystem.
 * Intercepts raw database payloads, augments them with algorithmic health 
 * scores, and manages the live Maker-Checker Support workflows.
 * * UPGRADE V2 (MAKER-CHECKER INTEGRATION):
 * - Removed simulated arrays for Support Tickets.
 * - Connected directly to Supabase `partner_requests` for live telemetry.
 * - Added `resolveSupportTicket` to finalize the Maker-Checker feedback loop.
 */

import { supabase } from '../../../services/api.config';
import { calculateAlgorithmicHealth, resolvePartnerTier, calculateYieldLeakage } from './partner.utils';

// ========================================================================
// 0. NETWORK SIMULATOR (Legacy Systems)
// Retained for modules not yet migrated to the live database (e.g., Fleet)
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
    // 🚀 NEW MAKER-CHECKER INTEGRATIONS (LIVE WIRES)
    // ========================================================================

    /**
     * FETCH RESOLUTION TICKETS (Live Dashboard Stream)
     * Reaches into the `partner_requests` vault and extracts actionable tickets.
     * @param {string} partnerId - Optional: If null, fetches global network queue.
     */
    getResolutionTickets: async (partnerId = null) => {
        try {
            // Only pull actionable tickets. Resolved tickets stay in history.
            let query = supabase
                .from('partner_requests')
                .select('*')
                .in('status', ['PENDING', 'PROCESSING'])
                .order('created_at', { ascending: false });

            // If an Admin is viewing a specific Partner's profile, filter the queue
            if (partnerId) {
                query = query.eq('partner_id', partnerId);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Map the pure database row into the schema expected by the Admin UI
            return (data || []).map(ticket => ({
                ticketId: ticket.id,
                partnerId: ticket.partner_id,
                category: ticket.request_type,   // Matches ROUTE_ADD, FLEET_ADD, etc.
                priority: ticket.priority,       // CRITICAL, URGENT, NORMAL
                status: ticket.status,           // PENDING, PROCESSING
                description: ticket.description,
                documentUrl: ticket.document_url, // For visual verification (Permits/Logbooks)
                date: ticket.created_at
            }));

        } catch (error) {
            console.error(`🚨 [Admin Cockpit] Resolution Ticket Sync Failed:`, error.message);
            return []; // Fail gracefully, don't crash the UI
        }
    },

    /**
     * RESOLVE SUPPORT TICKET (The L9 Admin Mutation)
     * Flips the Maker-Checker switch. Authorizes or Rejects the partner's request
     * and injects the feedback securely into the database.
     * @param {string} ticketId - The UUID of the request
     * @param {string} resolutionStatus - 'RESOLVED' or 'REJECTED'
     * @param {string} adminResponse - The typed feedback from the Admin
     */
    resolveSupportTicket: async (ticketId, resolutionStatus, adminResponse) => {
        try {
            if (!ticketId || !resolutionStatus || !adminResponse) {
                throw new Error('VALIDATION_FAULT: Incomplete resolution payload.');
            }

            // 1. Mark as Processing (Optional Optimistic Lock)
            await supabase
                .from('partner_requests')
                .update({ status: 'PROCESSING' })
                .eq('id', ticketId);

            // 2. Commit the Final Resolution
            const { data, error } = await supabase
                .from('partner_requests')
                .update({
                    status: resolutionStatus,        // Pushes to 'RESOLVED' or 'REJECTED'
                    admin_response: adminResponse,   // The feedback the partner will read
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