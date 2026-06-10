/**
 * 👑 AYABUS APPROVALS SERVICE (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Approvals Firewall
 * File: approvals.service.js
 * * DESCRIPTION:
 * The data layer for the Maker-Checker system.
 * Now upgraded with "Smart Routing" to handle both standard entities 
 * (Partners, Vehicles, Routes) and complex Financial payloads (Refunds).
 */

import { supabase } from '../../../lib/supabase';

export const approvalsService = {

  // ========================================================================
  // 1. FETCH PARTNERS
  // ========================================================================
  fetchPendingPartners: async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select(`*, partner_parks (*), partner_financials (*), partner_contacts (*)`)
        .eq('status', 'PENDING_APPROVAL')
        .order('created_at', { ascending: true });
      if (error) throw error;
      
      return data.map(p => ({
        type: 'PARTNER', id: p.id, label: p.company_name, subLabel: p.partner_id, submittedAt: p.created_at, data: p
      }));
    } catch (error) { 
      console.error("Partner Fetch Failed", error); 
      throw error; 
    }
  },

  // ========================================================================
  // 2. FETCH VEHICLES
  // ========================================================================
  fetchPendingBuses: async () => {
    try {
      const { data, error } = await supabase
        .from('bus_configs')
        .select(`*, partners (id, company_name)`)
        .eq('status', 'PENDING_APPROVAL')
        .order('created_at', { ascending: true });
      if (error) throw error;
      
      return data.map(b => ({
        type: 'VEHICLE', id: b.id, label: `${b.partners?.company_name} • ${b.bus_class}`, subLabel: 'Service Blueprint', submittedAt: b.created_at, data: b
      }));
    } catch (error) { 
      console.error("Bus Fetch Failed", error); 
      throw error; 
    }
  },

  // ========================================================================
  // 3. FETCH ROUTES
  // ========================================================================
  fetchPendingRoutes: async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select(`*, partners (id, company_name), bus_configs (id, bus_class)`)
        .eq('status', 'PENDING_APPROVAL')
        .order('created_at', { ascending: true });
      if (error) throw error;
      
      return data.map(r => ({
        type: 'ROUTE', id: r.id, label: `${r.origin_city} → ${r.destination_city}`, subLabel: 'Scheduled Route', submittedAt: r.created_at, data: r
      }));
    } catch (error) { 
      console.error("Route Fetch Failed", error); 
      throw error; 
    }
  },

  // ========================================================================
  // 4. FETCH SCHEDULES
  // ========================================================================
  fetchPendingSchedules: async () => {
    try {
      const { data, error } = await supabase
        .from('route_schedules') 
        .select(`
          *,
          route:routes (
            id, origin_city, destination_city, departure_time,
            partners (id, company_name),
            bus_configs (id, bus_class)
          )
        `)
        .eq('status', 'PENDING_APPROVAL')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(s => {
        const routeInfo = s.route || {};
        const origin = routeInfo.origin_city || 'Unknown';
        const dest = routeInfo.destination_city || 'Unknown';

        return {
          type: 'SCHEDULE', 
          id: s.id,
          label: `${origin} → ${dest}`,
          subLabel: `${s.frequency_type} Automation`,
          submittedAt: s.created_at,
          data: s
        };
      });
    } catch (error) {
      console.error("Schedule Fetch Failed", error);
      throw error;
    }
  },

  // ========================================================================
  // 5. FETCH REFUNDS & RECONCILIATION DEBT (NEW!)
  // ========================================================================
  /**
   * Targets the 'approvals' table specifically for RECONCILIATION payloads.
   * Joins the 'tickets' and 'partners' tables so the L9 Admin sees exact passenger data.
   */
  fetchPendingRefunds: async () => {
    try {
      const { data, error } = await supabase
        .from('approvals')
        .select(`
          *,
          ticket:tickets (
            ticket_hash, passenger_name, price_paid, travel_date, departure_time,
            partners (company_name)
          )
        `)
        .eq('target_module', 'RECONCILIATION')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(a => {
        const tkt = a.ticket || {};
        const opName = tkt.partners?.company_name || 'Unknown Operator';
        
        return {
          type: 'REFUND', 
          id: a.id,
          label: `Refund: ${tkt.passenger_name || 'Customer'}`,
          subLabel: `${opName} • ${tkt.ticket_hash || 'TKT-UNKNOWN'}`,
          submittedAt: a.created_at,
          data: a // This contains the 'payload_snapshot' (the actual mathematical physics)
        };
      });
    } catch (error) {
      console.error("Refund Fetch Failed", error);
      throw error;
    }
  },

  // ========================================================================
  // 6. ACTION: APPROVE ENTITY (Upgraded Smart Router)
  // ========================================================================
  approveEntity: async (table, id) => {
    try {
      // --- SMART ROUTE A: FINANCIAL REFUNDS ---
      // If we are approving a Refund, we must update TWO tables simultaneously.
      if (table === 'approvals') {
        const { data: approval } = await supabase.from('approvals').select('*').eq('id', id).single();
        
        if (approval && approval.target_module === 'RECONCILIATION') {
          // 1. Move the Ticket to the Treasury Vault
          const { error: ticketErr } = await supabase
            .from('tickets')
            .update({ status: 'APPROVED_UNSETTLED' })
            .eq('id', approval.target_record_id);
          if (ticketErr) throw ticketErr;
          
          // 2. Mark the Approval Request as Authorized
          const { error: appErr } = await supabase
            .from('approvals')
            .update({ status: 'AUTHORIZED', resolved_at: new Date().toISOString() })
            .eq('id', id);
          if (appErr) throw appErr;
          
          return { success: true };
        }
      }

      // --- SMART ROUTE B: STANDARD ENTITIES (Partners, Buses, etc.) ---
      const { error } = await supabase.from(table).update({ status: 'ACTIVE' }).eq('id', id);
      if (error) throw error;
      
      return { success: true };

    } catch (error) {
      console.error("Approval System Failed:", error);
      return { success: false, error: error.message };
    }
  },

  // ========================================================================
  // 7. ACTION: REJECT ENTITY (Upgraded Smart Router)
  // ========================================================================
  rejectEntity: async (table, id, reason = '') => {
    try {
      // --- SMART ROUTE A: FINANCIAL REFUNDS ---
      if (table === 'approvals') {
        const { data: approval } = await supabase.from('approvals').select('*').eq('id', id).single();
        
        if (approval && approval.target_module === 'RECONCILIATION') {
          // 1. Kill the refund on the Ticket level
          const { error: ticketErr } = await supabase
            .from('tickets')
            .update({ status: 'REFUND_REJECTED' })
            .eq('id', approval.target_record_id);
          if (ticketErr) throw ticketErr;
          
          // 2. Log the Rejection Reason in the Approvals table
          const { error: appErr } = await supabase
            .from('approvals')
            .update({ status: 'REJECTED', rejection_reason: reason, resolved_at: new Date().toISOString() })
            .eq('id', id);
          if (appErr) throw appErr;
          
          return { success: true };
        }
      }

      // --- SMART ROUTE B: STANDARD ENTITIES ---
      const { error } = await supabase.from(table).update({ status: 'REJECTED', rejection_reason: reason }).eq('id', id);
      if (error) throw error;
      
      return { success: true };

    } catch (error) {
      console.error("Rejection System Failed:", error);
      return { success: false, error: error.message };
    }
  }
};