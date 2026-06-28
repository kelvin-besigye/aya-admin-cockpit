// FIX: Import path changed from '../../../lib/supabase' to '../../../services/api.config'
import { supabase } from '../../../services/api.config';

/**
 * SCHEDULER SERVICE (Admin Cockpit)
 * ------------------------------------------------------------------
 * The Brain behind the Automated Scheduler.
 *
 * FIXES APPLIED:
 * 1. Import path corrected to '../../../services/api.config'
 */

export const schedulerService = {

  // ==========================================================
  // 1. WIZARD DROPDOWN DATA (Cascading)
  // ==========================================================

  fetchPartners: async () => {
    const { data, error } = await supabase
      .from('partners')
      .select('id, company_name, partner_id')
      .eq('status', 'ACTIVE')
      .order('company_name');
    if (error) throw error;
    return data || [];
  },

  fetchClassesByPartner: async (partnerId) => {
    if (!partnerId) return [];
    const { data, error } = await supabase
      .from('bus_configs')
      .select('*')
      .eq('partner_id', partnerId);
    if (error) throw error;
    return data || [];
  },

  fetchRoutesByClass: async (configId) => {
    if (!configId) return [];
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('bus_config_id', configId)
      .order('departure_time');
    if (error) throw error;
    return data || [];
  },

  // ==========================================================
  // 2. THE REGISTRY (READ)
  // ==========================================================

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

  createSchedule: async (payload) => {
    try {
      if (!payload.route_id || !payload.frequency_type) {
        throw new Error("Missing critical automation data.");
      }

      const row = {
        route_id: payload.route_id,
        frequency_type: payload.frequency_type,
        frequency_data: payload.frequency_data || {},
        status: 'PENDING_APPROVAL',
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

  updateSchedule: async (id, payload) => {
    try {
      const updates = { 
        ...payload, 
        status: 'PENDING_APPROVAL', 
        updated_at: new Date().toISOString() 
      };

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
      const sanitizeId = (id) => (id && id.length > 0) ? id : null;

      const payload = {
        id: draft.id,
        step_number: draft.step,
        label: draft.label || 'Untitled Schedule',
        partner_id: sanitizeId(draft.data?.partnerId),
        class_id: sanitizeId(draft.data?.classId),
        route_id: sanitizeId(draft.data?.routeId),
        frequency_type: draft.data?.frequencyType || null,
        form_data: draft.data,
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
    const { error } = await supabase
      .from('schedule_drafts')
      .delete()
      .eq('id', id);
    return { success: !error, error };
  }
};
