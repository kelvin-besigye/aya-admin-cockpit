/**
 * BUS CONFIGURATION UTILITIES (The beautifier)
 * ------------------------------------------------------------------
 * Centralizes the presentation logic for Bus Blueprints.
 * * * WORLD CLASS STANDARD:
 * 1. CLEAN TITLES: Converts "GATEWAY_VIP_BLUEPRINT" -> "Gateway VIP".
 * 2. HIDDEN TECHNICALS: Hides "TBA_TEMPLATE" plates entirely.
 * 3. CENTRALIZED STYLES: Manages Class Colors (VIP vs Ordinary) in one place.
 */

// ==========================================
// 1. SMART TEXT FORMATTERS
// ==========================================

/**
 * Generates a professional display title for a bus configuration.
 * Automatically strips "BLUEPRINT" suffixes and formats "Partner + Class".
 * * @param {Object} config - The full bus configuration object
 * @returns {String} - e.g. "Gateway VIP" or "Scania Touring"
 */
export const formatBusTitle = (config) => {
  if (!config) return 'Untitled Configuration';

  const rawModel = config.model_name || '';
  const partnerName = config.partners?.company_name || 'Unknown Operator';
  const className = config.bus_class || 'Service';

  // DETECT SYSTEM GENERATED NAMES
  // If the model name was auto-generated (e.g., "VIP_BLUEPRINT"),
  // we ignore it and construct a human-readable title.
  if (rawModel.includes('BLUEPRINT') || rawModel.includes('_CONFIG')) {
    return `${partnerName} ${className}`;
  }

  // Otherwise, return the custom model name (e.g. "Scania Marcopolo")
  return rawModel;
};

/**
 * Formats the plate number for display.
 * Returns NULL if the plate is a system placeholder (TBA/TEMPLATE).
 * * @param {String} plate - The raw plate string from DB
 * @returns {String|null} - The clean plate or null if it should be hidden
 */
export const formatPlateNumber = (plate) => {
  if (!plate) return null;
  
  const cleanPlate = plate.toUpperCase();
  
  // FILTER SYSTEM CONSTANTS
  if (cleanPlate.includes('TBA') || cleanPlate.includes('TEMPLATE') || cleanPlate.includes('BLUEPRINT')) {
    return null; // Return null so the UI knows to render NOTHING
  }

  return cleanPlate;
};

// ==========================================
// 2. VISUAL STYLE HELPERS
// ==========================================

/**
 * Returns the brand color associated with a specific Bus Service Class.
 * Used for badges, borders, and tags.
 * * @param {String} busClass - e.g. "VIP", "EXECUTIVE", "ORDINARY"
 * @returns {String} - CSS Variable string
 */
export const getBusClassColor = (busClass) => {
  if (!busClass) return 'var(--text-muted)';
  
  const normalized = busClass.toUpperCase();

  switch (normalized) {
    case 'VIP':
    case 'LUXURY':
      return 'var(--brand-secondary)'; // Gold/Purple (Premium)
      
    case 'EXECUTIVE':
    case 'BUSINESS':
      return 'var(--brand-primary)'; // Blue (Corporate)
      
    case 'ORDINARY':
    case 'STANDARD':
      return 'var(--text-muted)'; // Grey (Standard)
      
    default:
      return 'var(--brand-primary)'; // Default fallback
  }
};

/**
 * Returns the display label and color for the configuration status.
 * Handles the "Approval" workflow visualization.
 * * @param {String} status - e.g. "ACTIVE", "DRAFT", "PENDING_APPROVAL"
 */
export const getStatusConfig = (status) => {
  switch (status) {
    case 'ACTIVE': 
      return { 
        label: 'LIVE', 
        color: 'var(--status-success)', 
        bg: 'rgba(22, 163, 74, 0.1)',
        icon: 'check'
      };
      
    case 'PENDING_APPROVAL':
      return { 
        label: 'PENDING APPROVAL', 
        color: 'var(--status-warning)', 
        bg: 'rgba(234, 179, 8, 0.1)',
        icon: 'clock'
      };
      
    case 'DRAFT': 
      return { 
        label: 'DRAFT', 
        color: 'var(--text-muted)', 
        bg: 'var(--bg-muted)',
        icon: 'edit'
      };
      
    case 'ARCHIVED': 
      return { 
        label: 'ARCHIVED', 
        color: 'var(--status-danger)', 
        bg: 'rgba(220, 38, 38, 0.1)',
        icon: 'archive'
      };
      
    default: 
      return { 
        label: status, 
        color: 'var(--text-muted)', 
        bg: 'var(--bg-muted)',
        icon: 'help-circle'
      };
  }
};