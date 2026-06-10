/**
 * TREASURY SERVICE (The Database Engine)
 * ------------------------------------------------------------------
 * The high-performance data layer for the Treasury Module.
 * * * WORLD-CLASS FEATURES:
 * 1. DYNAMIC FILTER BUILDER: Instantly adapts to the Omni-Filter (Dates, Partners, Routes).
 * 2. RPC AGGREGATIONS: Uses database-level math for massive speed on KPI metrics.
 * 3. PAGINATION: Efficiently loads the Ledger without crashing the browser.
 */

import { supabase } from '../../../lib/supabase';
import { TIME_EPOCHS, LEDGER_STATUS } from './treasury.constants';

// ==========================================================
// 1. THE FILTER BUILDER (Dry & Secure)
// Applies the Omni-Filter parameters consistently to EVERY query.
// ==========================================================
/**
 * Attaches standard filters (Date Range, Partner, Route) to a Supabase query builder.
 * @param {Object} query - The active Supabase query object.
 * @param {Object} filters - The state from the Omni-Filter UI.
 * @returns {Object} The mutated query object.
 */
const applyOmniFilters = (query, filters = {}) => {
  let q = query;

  // A. TIME HORIZON (Epoch Filtering)
  if (filters.startDate && filters.endDate) {
    q = q.gte('created_at', filters.startDate).lte('created_at', filters.endDate);
  }

  // B. ENTITY ROUTING (Granular Drill-downs)
  if (filters.partnerId && filters.partnerId !== 'ALL') {
    q = q.eq('partner_id', filters.partnerId);
  }
  if (filters.routeId && filters.routeId !== 'ALL') {
    q = q.eq('route_id', filters.routeId);
  }
  if (filters.gateway && filters.gateway !== 'ALL') {
    q = q.eq('payment_gateway', filters.gateway);
  }

  return q;
};

export const treasuryService = {

  // ==========================================================
  // 2. THE KPI ENGINE (High-Speed Aggregations)
  // Powers the 4 massive cards at the top of the dashboard.
  // ==========================================================
  /**
   * Fetches total Gross, Platform Yield, and Partner Payout.
   * NOTE: In a true production environment, we use a Postgres RPC function 
   * 'get_treasury_kpis' for speed. If it doesn't exist, we fallback to client aggregation.
   */
  getKpiMetrics: async (filters) => {
    try {
      // IDEAL: Call Database-level Aggregation (Lightning Fast)
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_treasury_kpis', {
        p_start_date: filters.startDate || null,
        p_end_date: filters.endDate || null,
        p_partner_id: filters.partnerId !== 'ALL' ? filters.partnerId : null
      });

      if (!rpcError && rpcData) {
        return rpcData; // Expects: { gross_volume, platform_yield, partner_payout, ticket_count }
      }

      // FALLBACK: If RPC isn't deployed yet, calculate securely on client.
      console.warn("Treasury Service: RPC not found. Using fallback aggregation.");
      let query = supabase
        .from('transactions')
        .select('gross_amount, platform_fee, partner_payout, status')
        .in('status', ['SETTLED', 'CLEARING']);

      query = applyOmniFilters(query, filters);
      const { data, error } = await query;
      
      if (error) throw error;

      // Mathematical Aggregation
      return data.reduce((acc, row) => {
        acc.gross_volume += Number(row.gross_amount || 0);
        acc.platform_yield += Number(row.platform_fee || 0);
        acc.partner_payout += Number(row.partner_payout || 0);
        acc.ticket_count += 1;
        return acc;
      }, { gross_volume: 0, platform_yield: 0, partner_payout: 0, ticket_count: 0 });

    } catch (error) {
      console.error("Treasury KPI Error:", error);
      throw error;
    }
  },

  // ==========================================================
  // 3. THE TIME-SERIES ENGINE (Chart Data)
  // Formats data perfectly for Recharts / D3.js
  // ==========================================================
  /**
   * Fetches chronological data to draw the Revenue Line/Bar Charts.
   * @param {Object} filters - Omni-filter state.
   * @param {string} groupBy - 'DAY', 'WEEK', or 'MONTH' (Auto-scales based on Time Horizon).
   */
  getRevenueChartData: async (filters, groupBy = 'DAY') => {
    try {
      // Again, best practice is an RPC for time-series grouping.
      let query = supabase
        .from('transactions')
        .select('created_at, gross_amount, platform_fee, partner_payout')
        .eq('status', 'SETTLED')
        .order('created_at', { ascending: true });

      query = applyOmniFilters(query, filters);
      const { data, error } = await query;

      if (error) throw error;

      // Grouping Logic (Transforms raw rows into Chart Nodes)
      const chartNodes = {};
      data.forEach(row => {
        // Truncate timestamp based on interval (e.g., '2026-02-20')
        const dateKey = row.created_at.substring(0, groupBy === 'MONTH' ? 7 : 10);
        
        if (!chartNodes[dateKey]) {
          chartNodes[dateKey] = { date: dateKey, gross: 0, yield: 0, payout: 0 };
        }
        chartNodes[dateKey].gross += Number(row.gross_amount || 0);
        chartNodes[dateKey].yield += Number(row.platform_fee || 0);
        chartNodes[dateKey].payout += Number(row.partner_payout || 0);
      });

      return Object.values(chartNodes);

    } catch (error) {
      console.error("Treasury Chart Error:", error);
      throw error;
    }
  },

  // ==========================================================
  // 4. THE LEDGER ENGINE (Raw Truth)
  // Powers the infinite-scroll transaction tables.
  // ==========================================================
  /**
   * Fetches standard, successful transactions with pagination.
   */
  getLedgerTransactions: async (filters, page = 1, limit = 50) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('transactions')
        .select(`
          id, created_at, gateway_ref, gross_amount, platform_fee, partner_payout, payment_gateway, status,
          partners (company_name),
          routes (origin_city, destination_city)
        `, { count: 'exact' })
        .in('status', ['SETTLED', 'CLEARING'])
        .order('created_at', { ascending: false })
        .range(from, to);

      query = applyOmniFilters(query, filters);
      const { data, count, error } = await query;

      if (error) throw error;
      return { data, total: count, page, totalPages: Math.ceil(count / limit) };

    } catch (error) {
      console.error("Treasury Ledger Error:", error);
      throw error;
    }
  },

  /**
   * Fetches Anomalies (Refunds, Voids, Chargebacks).
   * Separate stream for deep financial forensics.
   */
  getAnomalyLedger: async (filters, page = 1, limit = 50) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('transactions')
        .select(`
          id, created_at, gross_amount, payment_gateway, status, anomaly_reason,
          partners (company_name)
        `, { count: 'exact' })
        .in('status', ['REFUNDED', 'CHARGEBACK', 'FAILED'])
        .order('created_at', { ascending: false })
        .range(from, to);

      query = applyOmniFilters(query, filters);
      const { data, count, error } = await query;

      if (error) throw error;
      return { data, total: count, page };

    } catch (error) {
      console.error("Treasury Anomaly Error:", error);
      throw error;
    }
  },

  // ==========================================================
  // 5. THE LEADERBOARD ENGINE
  // Ranks the top earning entities dynamically.
  // ==========================================================
  getLeaderboard: async (filters, entity = 'PARTNER') => {
    try {
      // Fetching top Partners or Top Routes
      const foreignCol = entity === 'PARTNER' ? 'partner_id' : 'route_id';
      
      let query = supabase
        .from('transactions')
        .select(`gross_amount, ${foreignCol}`)
        .eq('status', 'SETTLED');

      query = applyOmniFilters(query, filters);
      const { data, error } = await query;

      if (error) throw error;

      // Group and sort to find leaders
      const rankings = {};
      data.forEach(row => {
        const id = row[foreignCol];
        if (!id) return;
        if (!rankings[id]) rankings[id] = 0;
        rankings[id] += Number(row.gross_amount);
      });

      // Convert to array, sort descending, grab Top 5
      return Object.entries(rankings)
        .map(([id, total]) => ({ id, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    } catch (error) {
      console.error("Treasury Leaderboard Error:", error);
      throw error;
    }
  }
};