// FIX: Import path changed from '../../../lib/supabase' to '../../../services/api.config'
import { supabase } from '../../../services/api.config';
import { dbToForm, formToDb, formatTimeForDb } from './routes.adapters';

/**
 * ROUTES SERVICE (Admin Cockpit)
 * ------------------------------------------------------------------
 * FIXES APPLIED:
 * 1. Import path corrected to '../../../services/api.config'
 */

export const routesService = {

  // ==========================================================
  // SECTION A: THE REGISTRY (READ OPERATIONS)
  // ==========================================================

  fetchRoutes: async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          partners ( id, company_name, partner_id ),
          bus_configs ( * )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Routes Registry Link Severed:", error);
      throw error;
    }
  },

  fetchRouteById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          partners ( id, company_name ),
          bus_configs ( * )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return dbToForm(data);
    } catch (error) {
      console.error("Fetch Route Integrity Error:", error);
      throw error;
    }
  },

  // ==========================================================
  // SECTION B: THE WIZARD (MUTATION / EXPLOSION ENGINE)
  // ==========================================================

  createRoutes: async (formData) => {
    try {
      if (!formData.partnerId || !formData.busConfigId) {
        throw new Error("Missing Identity: Partner or Bus Config not selected.");
      }
      if (!formData.timeSlots || formData.timeSlots.length === 0) {
        throw new Error("Missing Schedule: At least one time slot is required.");
      }

      const basePayload = formToDb(formData);

      const { 
        id, timeSlots, duration, time, step, 
        ...cleanPayload 
      } = basePayload;

      const insertPromises = formData.timeSlots.map(async (slot) => {
        const dbTime = formatTimeForDb(slot);
        const originCode = (cleanPayload.origin_city || 'XXX').substring(0, 3).toUpperCase();
        const destCode = (cleanPayload.destination_city || 'XXX').substring(0, 3).toUpperCase();
        const timeCode = dbTime.replace(/:/g, '').substring(0, 4);
        const uniqueHash = Math.random().toString(36).substring(2, 6).toUpperCase();

        const routeRow = {
          ...cleanPayload,
          departure_time: dbTime,
          route_code: `${originCode}-${destCode}-${timeCode}-${uniqueHash}`,
          status: 'PENDING_APPROVAL'
        };

        return supabase.from('routes').insert(routeRow);
      });

      const results = await Promise.all(insertPromises);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) {
        throw new Error(`DB Rejected: ${errors[0].error.message || errors[0].error.details}`);
      }

      return { success: true, count: results.length };

    } catch (error) {
      console.error("Explosion Engine Failure:", error);
      return { success: false, error: error.message };
    }
  },

  updateRoute: async (id, formData) => {
    try {
      const basePayload = formToDb(formData);

      const { 
        id: payloadId, created_at, timeSlots, duration, time, step, 
        ...cleanPayload 
      } = basePayload;

      if (formData.time) {
        cleanPayload.departure_time = formatTimeForDb(formData.time);
      }

      cleanPayload.status = 'PENDING_APPROVAL';

      const { error } = await supabase
        .from('routes')
        .update(cleanPayload)
        .eq('id', id);

      if (error) throw new Error(error.message);
      return { success: true };

    } catch (error) {
      console.error("Mutation Rejected:", error);
      return { success: false, error: error.message };
    }
  },

  deleteRoute: async (id) => {
    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==========================================================
  // SECTION C: DRAFTS ENGINE
  // ==========================================================

  saveDraft: async (draftData) => {
    try {
      const rawPartnerId = draftData.partnerId || draftData.data?.partnerId;
      const validPartnerId = (rawPartnerId && rawPartnerId.length > 0) ? rawPartnerId : null;

      const payload = {
        id: draftData.id,
        partner_id: validPartnerId,
        step_number: draftData.step,
        form_data: draftData.data,
        label: draftData.label || 'Untitled Draft',
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('route_drafts')
        .upsert(payload);

      if (error) throw error;
      return { success: true };

    } catch (error) {
      console.error("Draft Persistence Error:", error);
      return { success: false, error: error.message };
    }
  },

  fetchDrafts: async () => {
    try {
      const { data, error } = await supabase
        .from('route_drafts')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn("Drafts Fetch Warning:", error.message);
      return [];
    }
  },

  deleteDraft: async (id) => {
    try {
      const { error } = await supabase
        .from('route_drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
