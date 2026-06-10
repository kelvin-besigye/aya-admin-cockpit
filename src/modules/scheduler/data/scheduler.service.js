import { supabase } from '../../../lib/supabase';

/**
 * SCHEDULER SERVICE
 * ------------------------------------------------------------------
 * The Brain behind the Automated Scheduler.
 * * * FEATURES:
 * 1. CASCADING SELECTS: Fetch Classes by Partner, Routes by Class.
 * 2. REGISTRY AGGREGATOR: Joins 4 tables deep for the Registry View.
 * 3. DRAFT SAFETY: Sanitizes UUIDs to prevent crashes.
 */

export const schedulerService = {

  // ==========================================================
  // 1. WIZARD DROPDOWN DATA (Cascading)
  // ==========================================================

  /**
   * Fetch All Partners (Step 1.a)
   */
  fetchPartners: async () => {
    const { data, error } = await supabase
      .from('partners')
      .select('id, company_name, partner_id')
      .order('company_name');
    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch Classes for a Specific Partner (Step 1.b)
   */
  fetchClassesByPartner: async (partnerId) => {
    if (!partnerId) return [];
    const { data, error } = await supabase
      .from('bus_configs')
      .select('*')
      .eq('partner_id', partnerId);
    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch Routes for a Specific Class (Step 1.c)
   */
  fetchRoutesByClass: async (configId) => {
    if (!configId) return [];
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('bus_config_id', configId)
      // Only fetch routes that are approved/active base definitions
      // .eq('status', 'ACTIVE') // Uncomment if you want strict rules
      .order('departure_time');
    if (error) throw error;
    return data || [];
  },

  // ==========================================================
  // 2. THE REGISTRY (READ)
  // ==========================================================

  /**
   * Fetch All Scheduled Routes
   * Joins: Schedule -> Route -> Partner & Config
   */
  fetchSchedules: async () => {
    try {
      const { data, error } = await supabase
        .from('route_schedules')
        .select(`
          *,
          route:routes (
            *,
            partners ( company_name ),
            bus_configs ( bus_class )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Scheduler Registry Error:", err);
      throw err;
    }
  },

  // ==========================================================
  // 3. THE AUTOMATION ENGINE (WRITE)
  // ==========================================================

  /**
   * Create New Schedule (Automate Route)
   */
  createSchedule: async (payload) => {
    try {
      // Validation
      if (!payload.route_id || !payload.frequency_type) {
        throw new Error("Missing critical automation data.");
      }

      const row = {
        route_id: payload.route_id,
        frequency_type: payload.frequency_type,
        frequency_data: payload.frequency_data || {},
        status: 'PENDING_APPROVAL', // Default to pending
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('route_schedules')
        .insert(row);

      if (error) throw error;
      return { success: true };

    } catch (err) {
      console.error("Create Schedule Error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Update Existing Schedule
   */
  updateSchedule: async (id, payload) => {
    try {
      // Force status reset on edit for safety
      const updates = { ...payload, status: 'PENDING_APPROVAL', updated_at: new Date() };

      const { error } = await supabase
        .from('route_schedules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return { success: true };

    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Delete Schedule
   */
  deleteSchedule: async (id) => {
    try {
      const { error } = await supabase
        .from('route_schedules')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================================
  // 4. DRAFTS ENGINE
  // ==========================================================

  saveDraft: async (draft) => {
    try {
      // SANITIZATION BOUNCER (The Fix)
      const sanitizeId = (id) => (id && id.length > 0) ? id : null;

      const payload = {
        id: draft.id,
        step_number: draft.step,
        label: draft.label || 'Untitled Schedule',
        
        // Nullable Foreign Keys
        partner_id: sanitizeId(draft.data?.partnerId),
        class_id: sanitizeId(draft.data?.classId),
        route_id: sanitizeId(draft.data?.routeId),
        
        frequency_type: draft.data?.frequencyType || null,
        form_data: draft.data, // Full blob
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('schedule_drafts')
        .upsert(payload);

      if (error) throw error;
      return { success: true };

    } catch (err) {
      console.error("Schedule Draft Error:", err);
      return { success: false, error: err.message };
    }
  },

  fetchDrafts: async () => {
    const { data, error } = await supabase
      .from('schedule_drafts')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) return [];
    return data;
  },

  deleteDraft: async (id) => {
    const { error } = await supabase.from('schedule_drafts').delete().eq('id', id);
    return { success: !error, error };
  }
};