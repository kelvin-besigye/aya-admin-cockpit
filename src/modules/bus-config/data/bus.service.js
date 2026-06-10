import { supabase } from '../../../lib/supabase';
import { formToDb } from './bus.adapters'; 

/**
 * BUS CONFIG SERVICE LAYER (The Blueprint Engine)
 * ------------------------------------------------------------------
 * The Live Connector for the Bus Detailing Centre.
 * * * WORLD CLASS STANDARDS:
 * 1. STRICT TYPE CHECKING: Physically verifies binary data before upload.
 * 2. AUTO-UNWRAP: Handles UI library file wrappers (AntD, Dropzone, etc).
 * 3. TRANSPARENCY: Fetches ACTIVE and PENDING items.
 * 4. ATOMICITY: Fails safely if assets cannot be secured.
 */

// === PRIVATE HELPER: UPLOAD INTERCEPTOR (Future Proof) ===
const uploadFile = async (input, folder) => {
  // 1. NULL CHECK: If empty, skip.
  if (!input) return null;

  // 2. EXISTING URL CHECK: If it's already a string, it's safe. Return it.
  if (typeof input === 'string') return input;

  // 3. THE SMART UNWRAPPER
  // UI libraries often wrap files in objects like { file: ... } or { originFileObj: ... }
  // We extract the real binary payload.
  let fileToUpload = input;

  if (input.file && (input.file instanceof File || input.file instanceof Blob)) {
    fileToUpload = input.file;
  } else if (input.originFileObj && (input.originFileObj instanceof File || input.originFileObj instanceof Blob)) {
    fileToUpload = input.originFileObj;
  }

  // 4. THE BINARY GATEKEEPER (The Fix for "application/json" errors)
  // If the final item is NOT a File or Blob, we CANNOT upload it.
  // We return the existing preview if available, or null to avoid crashing.
  if (!(fileToUpload instanceof Blob) && !(fileToUpload instanceof File)) {
    console.warn("Citadel Upload: Item is not binary data. Skipping.", input);
    return input.preview || null; 
  }

  try {
    // 5. SANITIZATION (Prevents Storage Errors)
    // Remove spaces and special chars from filename
    const originalName = fileToUpload.name || `image_${Date.now()}.jpg`;
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${Date.now()}_${cleanName}`;
    const filePath = `${folder}/${fileName}`;

    // 6. UPLOAD TO CLOUD
    const { error: uploadError } = await supabase.storage
      .from('aya-bus-media') 
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 7. GET PERMANENT URL
    const { data } = supabase.storage
      .from('aya-bus-media')
      .getPublicUrl(filePath);

    return data.publicUrl;

  } catch (error) {
    console.error("Asset Upload Failed:", error);
    throw error; // Stop the process. Do not save broken data to DB.
  }
};

export const busService = {

  // ==========================================================
  // SECTION A: THE LIVE REGISTRY
  // ==========================================================

  /**
   * 1. GET REGISTRY (Active & Pending)
   */
  fetchBusConfigs: async () => {
    try {
      const { data, error } = await supabase
        .from('bus_configs')
        .select(`
          *,
          partners ( id, company_name, partner_id )
        `)
        // Filter: Show Live Fleet AND Items in Review
        .in('status', ['ACTIVE', 'PENDING_APPROVAL']) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Bus Config Fetch Error:", error);
      throw error;
    }
  },

  /**
   * 2. CREATE CONFIGURATION (With Parallel Uploads)
   */
  createBusConfig: async (formData) => {
    try {
      // 1. Validation
      if (!formData.partnerId || !formData.busClass) {
        return { success: false, error: "Missing required identification details." };
      }

      // 2. Prepare Payload (Adapter)
      const payload = formToDb(formData);

      // 3. UPLOAD ASSETS (The Magic)
      // We process all uploads before touching the database.
      
      // A. Profile Image
      if (payload.gallery.profile) {
        payload.gallery.profile = await uploadFile(payload.gallery.profile, 'buses');
      }
      
      // B. Gallery Images (Parallel execution for speed)
      if (payload.gallery.views && payload.gallery.views.length > 0) {
        const uploadPromises = payload.gallery.views.map(img => uploadFile(img, 'buses'));
        payload.gallery.views = await Promise.all(uploadPromises);
      }

      // 4. Finalize & Insert
      payload.status = 'PENDING_APPROVAL'; 
      payload.created_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('bus_configs')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      console.log("Citadel: Configuration Created & Assets Uploaded", data);
      return { success: true, data };

    } catch (error) {
      console.error("Create Bus Error:", error);
      return { success: false, error: error.message || "Asset Upload Failed" };
    }
  },

  /**
   * 3. UPDATE CONFIGURATION (With Asset Management)
   */
  updateBusConfig: async (id, formData) => {
    try {
      if (!id) return { success: false, error: "No Configuration ID provided." };

      const payload = formToDb(formData);

      // 1. UPLOAD NEW ASSETS
      // The uploadFile helper intelligently skips existing URLs (Strings)
      if (payload.gallery.profile) {
        payload.gallery.profile = await uploadFile(payload.gallery.profile, 'buses');
      }

      if (payload.gallery.views && payload.gallery.views.length > 0) {
        const uploadPromises = payload.gallery.views.map(img => uploadFile(img, 'buses'));
        payload.gallery.views = await Promise.all(uploadPromises);
      }

      // 2. Force Approval Workflow
      payload.status = 'PENDING_APPROVAL';
      
      // 3. Update Database
      const { data, error } = await supabase
        .from('bus_configs')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log("Citadel: Configuration Updated", data);
      return { success: true, data };

    } catch (error) {
       console.error("Update Bus Error:", error);
       return { success: false, error: error.message || "Update Failed" };
    }
  },

  /**
   * 4. APPROVE CONFIGURATION
   */
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

  /**
   * 5. ARCHIVE / DELETE
   */
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