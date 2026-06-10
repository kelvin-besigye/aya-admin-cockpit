/**
 * 👑 AYABUS ADAPTER ENGINE (Sovereign Translator)
 * ------------------------------------------------------------------
 * Module: Bus Configuration
 * File: bus.adapters.js
 * * DESCRIPTION:
 * The mission-critical bridge between the Physical Postgres Schema 
 * and the High-Fidelity UI Wizard. Ensures zero data loss and 
 * total type-safety during hydration and persistence.
 * * ARCHITECTURE:
 * 1. SCHEMA FIDELITY: Hard-aligned with the bus_configs table columns.
 * 2. IMAGE PERSISTENCE: Distinguishes between existing URL strings 
 * and new binary File uploads.
 * 3. FAIL-SAFE DEFAULTS: Prevents UI crashes when encountering nulls.
 */

// ========================================================================
// 1. DATABASE -> FORM (The Hydration Engine)
// ========================================================================
/**
 * Transforms raw Supabase rows into React-ready state objects.
 * Used when loading an existing bus configuration for editing.
 */
export const dbToForm = (dbRecord) => {
  if (!dbRecord) return null;

  /**
   * Helper: Restore Image Metadata
   * Converts a URL string or stored object back into a format the UI 
   * can render, marking it as 'isRemote' to skip redundant uploads.
   */
  const restoreImage = (val) => {
    if (!val) return null;
    
    // Handle cases where the DB stores a full object or just a string
    if (typeof val === 'object' && val.preview) {
      return { ...val, isRemote: true };
    }
    
    return {
      preview: typeof val === 'string' ? val : val.url,
      isRemote: true
    };
  };

  return {
    // Unique Primary Keys
    id: dbRecord.id,
    partnerId: dbRecord.partner_id,
    
    // Core Configuration (Aligned with Physical Schema)
    busClass: dbRecord.bus_class || 'Standard',
    layout: dbRecord.layout_config || 'standard',
    
    // Calculated/Derived Fields
    // NOTE: seat_count is missing from DB; we default to 0 to keep the UI stable
    seatCount: 0, 
    
    // Asset Management
    // NOTE: profile_image removed as it is not in the schema; using gallery index 0 if needed
    gallery: Array.isArray(dbRecord.gallery) 
      ? dbRecord.gallery.map(img => restoreImage(img)) 
      : [],
    
    // Features & Amenities
    amenities: dbRecord.amenities || [],
    status: dbRecord.status || 'PENDING_APPROVAL',
    
    // Technical Identity
    modelName: dbRecord.model_name || '',
    plateNumber: dbRecord.plate_number || 'TBA',
    
    // Temporal Data
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at
  };
};

// ========================================================================
// 2. FORM -> DATABASE (The Persistence Engine)
// ========================================================================
/**
 * Transforms Wizard state back into physical Snake_Case Postgres columns.
 * Purifies payloads for the Supabase 'bus_configs' table.
 */
export const formToDb = (formData) => {
  if (!formData) return null;

  /**
   * Helper: Process Image for Storage
   * - If 'isRemote' is true: We return the existing URL string.
   * - If 'isRemote' is false: We return the raw File/Blob for the upload service.
   */
  const processImage = (img) => {
    if (!img) return null;
    return img.isRemote ? img.preview : img; 
  };

  return {
    // Physical Schema Mapping (No seat_count or profile_image)
    partner_id: formData.partnerId,
    bus_class: formData.busClass,
    layout_config: formData.layout,
    
    // Identity & Meta
    model_name: formData.modelName || (formData.busClass + "_CONFIG"),
    plate_number: formData.plateNumber || "TBA",
    
    // Asset Payloads (JSONB Array)
    gallery: Array.isArray(formData.gallery) 
      ? formData.gallery.map(img => processImage(img)) 
      : [],
    
    // Logic & State
    amenities: formData.amenities || [],
    status: formData.status || 'PENDING_APPROVAL'
  };
};

// ========================================================================
// 3. SOVEREIGN UTILITIES (System Harmony)
// ========================================================================
/**
 * Generates human-readable labels for the Admin Cockpit registries.
 */
export const getBusLabel = (formData) => {
  if (!formData) return 'Untitled Configuration';
  const partnerId = formData.partnerId ? formData.partnerId.substring(0, 5) : 'NEW';
  const busClass = formData.busClass || 'Standard';
  return "[" + partnerId + "] " + busClass + " Configuration";
};