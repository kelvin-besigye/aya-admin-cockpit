// FIX: Import path changed from '../../../lib/supabase' to '../../../services/api.config'
import { supabase } from '../../../services/api.config';
import { formToDb } from './bus.adapters';

/**
 * BUS CONFIG SERVICE LAYER (Admin Cockpit)
 * ------------------------------------------------------------------
 * FIXES APPLIED:
 * 1. Import path corrected to '../../../services/api.config'
 * 2. Gallery handling fixed — bus.adapters.formToDb returns gallery as a flat
 *    array, not { profile, views }. Removed the broken payload.gallery.profile
 *    and payload.gallery.views references. Gallery images are now uploaded
 *    as a flat array matching what the DB column expects.
 */

// === PRIVATE HELPER: UPLOAD INTERCEPTOR ===
const uploadFile = async (input, folder) => {
  if (!input) return null;
  if (typeof input === 'string') return input;

  let fileToUpload = input;

  if (input.file && (input.file instanceof File || input.file instanceof Blob)) {
    fileToUpload = input.file;
  } else if (input.originFileObj && (input.originFileObj instanceof File || input.originFileObj instanceof Blob)) {
    fileToUpload = input.originFileObj;
  }

  if (!(fileToUpload instanceof Blob) && !(fileToUpload instanceof File)) {
    console.warn("Citadel Upload: Item is not binary data. Skipping.", input);
    return input.preview || null;
  }

  try {
    const originalName = fileToUpload.name || `image_${Date.now()}.jpg`;
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${Date.now()}_${cleanName}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('aya-bus-media')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('aya-bus-media')
      .getPublicUrl(filePath);

    return data.publicUrl;

  } catch (error) {
    console.error("Asset Upload Failed:", error);
    throw error;
  }
};

export const busService = {

  // ==========================================================
  // SECTION A: THE LIVE REGISTRY
  // ==========================================================

  fetchBusConfigs: async () => {
    try {
      const { data, error } = await supabase
        .from('bus_configs')
        .select(`
          *,
          partners ( id, company_name, partner_id )
        `)
        .in('status', ['ACTIVE', 'PENDING_APPROVAL'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Bus Config Fetch Error:", error);
      throw error;
    }
  },

  createBusConfig: async (formData) => {
    try {
      if (!formData.partnerId || !formData.busClass) {
        return { success: false, error: "Missing required identification details." };
      }

      const payload = formToDb(formData);

      // FIX: gallery is a flat array from the adapter, not { profile, views }
      // Upload each image in the gallery array individually
      if (Array.isArray(payload.gallery) && payload.gallery.length > 0) {
        const uploadPromises = payload.gallery.map(img => uploadFile(img, 'buses'));
        payload.gallery = await Promise.all(uploadPromises);
        // Remove nulls from failed uploads
        payload.gallery = payload.gallery.filter(Boolean);
      }

      payload.status = 'PENDING_APPROVAL';
      payload.created_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('bus_configs')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };

    } catch (error) {
      console.error("Create Bus Error:", error);
      return { success: false, error: error.message || "Asset Upload Failed" };
    }
  },

  updateBusConfig: async (id, formData) => {
    try {
      if (!id) return { success: false, error: "No Configuration ID provided." };

      const payload = formToDb(formData);

      // FIX: Same flat array handling for updates
      if (Array.isArray(payload.gallery) && payload.gallery.length > 0) {
        const uploadPromises = payload.gallery.map(img => uploadFile(img, 'buses'));
        payload.gallery = await Promise.all(uploadPromises);
        payload.gallery = payload.gallery.filter(Boolean);
      }

      payload.status = 'PENDING_APPROVAL';

      const { data, error } = await supabase
        .from('bus_configs')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };

    } catch (error) {
      console.error("Update Bus Error:", error);
      return { success: false, error: error.message || "Update Failed" };
    }
  },

  approveBusConfig: async (id) => {
    try {
      const { error } = await supabase
        .from('bus_configs')
        .update({ status: 'ACTIVE' })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteBusConfig: async (id) => {
    try {
      const { error } = await supabase
        .from('bus_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==========================================================
  // SECTION B: THE DRAFTS ENGINE
  // ==========================================================

  fetchDrafts: async () => {
    try {
      const { data, error } = await supabase
        .from('bus_drafts')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;

      return data.map(d => ({
        id: d.id,
        label: d.label,
        currentStep: d.current_step,
        timestamp: d.last_updated,
        data: d.form_data
      }));

    } catch (error) {
      console.error("Bus Draft Fetch Error:", error);
      return [];
    }
  },

  saveDraft: async (draftPayload) => {
    try {
      const { error } = await supabase
        .from('bus_drafts')
        .upsert({
          id: draftPayload.id,
          label: draftPayload.label || "Untitled Bus Config",
          current_step: draftPayload.currentStep,
          form_data: draftPayload.data,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Bus Draft Save Error:", error);
      return { success: false, error: error.message };
    }
  },

  deleteDraft: async (draftId) => {
    try {
      const { error } = await supabase
        .from('bus_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
