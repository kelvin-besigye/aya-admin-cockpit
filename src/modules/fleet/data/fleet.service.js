// FIX: Import path changed from '../../../lib/supabase' to '../../../services/api.config'
import { supabase } from '../../../services/api.config';
import { formToDb } from './fleet.adapters';

/**
 * FLEET SERVICE LAYER (Admin Cockpit)
 * ------------------------------------------------------------------
 * FIXES APPLIED:
 * 1. Import path corrected to '../../../services/api.config'
 */

// --- HELPER: MAP CHILDREN TO DB COLUMNS ---
const mapChildrenForInsert = (partnerId, formData) => {
  return {
    parks: (formData.parks || []).map(p => ({
      partner_id: partnerId,
      name: (p.name || '').toUpperCase(),
      address: p.address,
      gps_lat: p.gps?.lat || null,
      gps_lng: p.gps?.lng || null,
      contact_name: p.contactName,
      contact_phone: p.contactPhone
    })),

    financials: (formData.financials || []).map(f => ({
      partner_id: partnerId,
      institution_code: f.institutionCode,
      account_name: f.accountName,
      account_number: f.accountNumber,
      is_primary: f.isPrimary || false,
      currency: f.currency || 'UGX'
    })),

    contacts: (formData.contacts || []).map(c => ({
      partner_id: partnerId,
      full_name: (c.fullName || '').toUpperCase(),
      role: c.role,
      phone_primary: c.phonePrimary,
      phone_alt: c.phoneAlt
    }))
  };
};

export const fleetService = {

  // ==========================================================
  // SECTION A: THE OFFICIAL REGISTRY (PARTNERS)
  // ==========================================================

  fetchPartners: async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select(`
          *,
          partner_parks (*),
          partner_financials (*),
          partner_contacts (*)
        `)
        .in('status', ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(p => ({
        ...p,
        // Keep real arrays for dbToForm (edit hydration)
        partner_parks: p.partner_parks || [],
        partner_financials: p.partner_financials || [],
        partner_contacts: p.partner_contacts || [],
        // Count badges for RegistryList/RegistryCard
        _parkCount: p.partner_parks?.length || 0,
        _financialCount: p.partner_financials?.length || 0,
        details: {
          parks: p.partner_parks || [],
          financials: p.partner_financials || [],
          contacts: p.partner_contacts || []
        }
      }));

    } catch (error) {
      console.error("Supabase Fetch Error:", error);
      throw error;
    }
  },

  getActivePartners: async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select(`
          *,
          partner_parks (*),
          partner_financials (*),
          partner_contacts (*)
        `)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(p => ({
        ...p,
        // Keep real arrays for dbToForm (edit hydration)
        partner_parks: p.partner_parks || [],
        partner_financials: p.partner_financials || [],
        partner_contacts: p.partner_contacts || [],
        // Count badges for RegistryList/RegistryCard
        _parkCount: p.partner_parks?.length || 0,
        _financialCount: p.partner_financials?.length || 0,
        details: {
          parks: p.partner_parks || [],
          financials: p.partner_financials || [],
          contacts: p.partner_contacts || []
        }
      }));

    } catch (error) {
      console.error("Supabase Fetch Error (Customer Wire):", error);
      throw error;
    }
  },

  createPartner: async (rawFormData) => {
    try {
      const { details, ...parentPayload } = formToDb(rawFormData);
      parentPayload.status = 'PENDING_APPROVAL';

      const { data: newPartner, error: parentError } = await supabase
        .from('partners')
        .insert(parentPayload)
        .select()
        .single();

      if (parentError) throw parentError;

      const partnerId = newPartner.id;
      const childData = mapChildrenForInsert(partnerId, rawFormData);

      const promises = [];
      if (childData.parks.length > 0) promises.push(supabase.from('partner_parks').insert(childData.parks));
      if (childData.financials.length > 0) promises.push(supabase.from('partner_financials').insert(childData.financials));
      if (childData.contacts.length > 0) promises.push(supabase.from('partner_contacts').insert(childData.contacts));

      await Promise.all(promises);

      return { success: true, data: newPartner };

    } catch (error) {
      console.error("Create Error:", error);
      return { success: false, error: error.message || "Database Write Failed" };
    }
  },

  updatePartner: async (rawFormData) => {
    try {
      const partnerId = rawFormData.id;
      if (!partnerId) throw new Error("Missing Partner ID for update.");

      const { details, ...parentPayload } = formToDb(rawFormData);
      parentPayload.status = 'PENDING_APPROVAL';

      const { error: parentError } = await supabase
        .from('partners')
        .update(parentPayload)
        .eq('id', partnerId);

      if (parentError) throw parentError;

      await Promise.all([
        supabase.from('partner_parks').delete().eq('partner_id', partnerId),
        supabase.from('partner_financials').delete().eq('partner_id', partnerId),
        supabase.from('partner_contacts').delete().eq('partner_id', partnerId)
      ]);

      const childData = mapChildrenForInsert(partnerId, rawFormData);

      const promises = [];
      if (childData.parks.length > 0) promises.push(supabase.from('partner_parks').insert(childData.parks));
      if (childData.financials.length > 0) promises.push(supabase.from('partner_financials').insert(childData.financials));
      if (childData.contacts.length > 0) promises.push(supabase.from('partner_contacts').insert(childData.contacts));

      await Promise.all(promises);

      return { success: true };

    } catch (error) {
      console.error("Update Error:", error);
      return { success: false, error: error.message };
    }
  },

  approvePartner: async (id) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ status: 'ACTIVE' })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updatePartnerStatus: async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deletePartner: async (id) => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ==========================================================
  // SECTION B: THE CLOUD DRAFTS ENGINE
  // ==========================================================

  fetchDrafts: async () => {
    try {
      const { data, error } = await supabase
        .from('fleet_drafts')
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
      return [];
    }
  },

  saveDraft: async (draftPayload) => {
    try {
      const { error } = await supabase
        .from('fleet_drafts')
        .upsert({
          id: draftPayload.id,
          label: draftPayload.label,
          current_step: draftPayload.currentStep,
          form_data: draftPayload.data,
          last_updated: new Date().toISOString()
        });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteDraft: async (draftId) => {
    try {
      const { error } = await supabase
        .from('fleet_drafts')
        .delete()
        .eq('id', draftId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
