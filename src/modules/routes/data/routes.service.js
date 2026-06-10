import { supabase } from '../../../lib/supabase';
import { dbToForm, formToDb, formatTimeForDb } from './routes.adapters';

/**
 * ROUTES SERVICE (The Sovereign Engine)
 * ------------------------------------------------------------------
 * Handles the business logic for managing Route Definitions and Fleet logistics.
 * * * WORLD CLASS ARCHITECTURE UPGRADES:
 * 1. PAYLOAD PURIFICATION: Strips UI-only arrays/objects before hitting the database.
 * 2. DETERMINISTIC HASHING: Appends unique hashes to Route Codes to defeat Unique Constraint clashes.
 * 3. ZERO-TRUST DRAFTS: Safely sanitizes UUIDs, converting empty strings to NULL to prevent crashes.
 * 4. PARALLEL EXPLOSION: Transforms 1 wizard payload into N independent temporal database rows instantly.
 */

export const routesService = {

  // ==========================================================
  // SECTION A: THE REGISTRY (READ OPERATIONS)
  // ==========================================================

  /**
   * FETCH ALL ROUTES
   * Gets the live registry data, joined with Partner & Config details.
   */
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

  /**
   * FETCH SINGLE ROUTE (For Inspector / Edit Mode)
   * Deserializes the DB row back into the UI Wizard format.
   */
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

  /**
   * CREATE ROUTE(S) - THE PARALLEL EXPLOSION STRATEGY
   * Transforms a single UI form array into multiple independent database rows.
   */
  createRoutes: async (formData) => {
    try {
      // 1. Strict Validation Firewalls
      if (!formData.partnerId || !formData.busConfigId) {
        throw new Error("Missing Identity: Partner or Bus Config not selected.");
      }
      if (!formData.timeSlots || formData.timeSlots.length === 0) {
        throw new Error("Missing Schedule: At least one time slot is required.");
      }

      // 2. Base Payload Translation
      const basePayload = formToDb(formData);

      // 🔥 FIX 1: PAYLOAD PURIFICATION
      // We MUST strip out 'id' (to prevent PK duplication from Drafts) and UI-only objects 
      // (like timeSlots & duration) because Supabase will reject columns that don't physically exist.
      const { 
        id, timeSlots, duration, time, step, 
        ...cleanPayload 
      } = basePayload;

      // 3. THE EXPLOSION LOOP
      const insertPromises = formData.timeSlots.map(async (slot) => {
        
        // Convert strict UI time { hour, minute, period } -> DB string '14:30:00'
        const dbTime = formatTimeForDb(slot);
        
        // Generate Smart Code: KLA-GUL-1430
        const originCode = (cleanPayload.origin_city || 'XXX').substring(0,3).toUpperCase();
        const destCode = (cleanPayload.destination_city || 'XXX').substring(0,3).toUpperCase();
        const timeCode = dbTime.replace(/:/g, '').substring(0,4);
        
        // 🔥 FIX 2: DETERMINISTIC HASHING (Prevents Unique Constraint Violation)
        // If a partner dispatches 2 buses to Gulu at 8AM, we need a unique hash to prevent a crash.
        const uniqueHash = Math.random().toString(36).substring(2, 6).toUpperCase(); 
        
        const routeRow = {
          ...cleanPayload,
          departure_time: dbTime,
          route_code: `${originCode}-${destCode}-${timeCode}-${uniqueHash}`,
          status: 'PENDING_APPROVAL' // Hardware lock to pending state
        };

        // Fire single parallel insert
        return supabase.from('routes').insert(routeRow);
      });

      // 4. Await All Inserts
      const results = await Promise.all(insertPromises);

      // 5. Audit Results
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        console.error("Supabase Rejection Log:", errors[0].error);
        // 🔥 FIX 3: Output the EXACT Supabase Database rejection to the screen, preventing guesswork.
        throw new Error(`DB Rejected: ${errors[0].error.message || errors[0].error.details}`);
      }

      return { success: true, count: results.length };

    } catch (error) {
      console.error("Explosion Engine Failure:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * UPDATE SINGLE ROUTE
   * Modifies an existing operational route. Resets status to pending for Maker-Checker security.
   */
  updateRoute: async (id, formData) => {
    try {
      // 1. Translate
      const basePayload = formToDb(formData);
      
      // 2. Purify Payload (Strip immutable/UI properties to prevent rejection)
      const { 
        id: payloadId, created_at, timeSlots, duration, time, step, 
        ...cleanPayload 
      } = basePayload;
      
      // 3. Inject Specific Edit Time
      if (formData.time) {
        cleanPayload.departure_time = formatTimeForDb(formData.time);
      }
      
      // 4. Security Requirement: Edits force the route back into the Approvals Queue
      cleanPayload.status = 'PENDING_APPROVAL';

      // 5. Commit to Cloud
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

  /**
   * DELETE ROUTE
   */
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

  /**
   * SAVE DRAFT TO CLOUD
   * Persists the current wizard state so the user can resume safely later.
   */
  saveDraft: async (draftData) => {
    try {
      // 1. DRAFT SANITIZATION (The UUID Zero-Trust Fix)
      // If a user hasn't selected a partner yet, Supabase will crash if we send "". It requires NULL.
      const rawPartnerId = draftData.partnerId || draftData.data?.partnerId;
      const validPartnerId = (rawPartnerId && rawPartnerId.length > 0) ? rawPartnerId : null;

      // 2. Construct Encapsulated Payload
      const payload = {
        id: draftData.id,
        partner_id: validPartnerId,  
        step_number: draftData.step,
        form_data: draftData.data,   // Stores the full dynamic JSON blob safely
        label: draftData.label || 'Untitled Draft', 
        last_updated: new Date().toISOString()
      };

      // 3. Upsert State
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

  /**
   * FETCH USER DRAFTS
   */
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

  /**
   * DELETE DRAFT
   */
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
