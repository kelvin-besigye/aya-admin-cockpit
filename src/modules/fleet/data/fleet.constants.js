/**
 * FLEET MODULE CONSTANTS
 * The single source of truth for all static lists and configuration.
 * ------------------------------------------------------------------
 * "Twice as Good" Rule: No hard-coded strings in UI components.
 */

// 1. WIZARD STEPS
// Defines the flow of the onboarding engine.
export const ONBOARDING_STEPS = [
  { id: 1, label: 'CREDENTIALS', description: 'Partner Identity & Access' },
  { id: 2, label: 'OPERATIONS', description: 'Bus Parks & Locations' },
  { id: 3, label: 'FINANCIALS', description: 'Banking Vaults & payouts' },
  { id: 4, label: 'CONTACTS', description: 'Emergency & Admin Chain' },
];

// 2. PARTNER STATUS
// The lifecycle states of a bus operator in the system.
export const PARTNER_STATUS = {
  PENDING: 'PENDING_APPROVAL', // Freshly registered, waiting for Super Admin
  ACTIVE: 'ACTIVE',           // Fully operational
  SUSPENDED: 'SUSPENDED',     // Temporarily blocked (e.g. non-payment)
  BANNED: 'BANNED'            // Permanently removed (e.g. safety violations)
};

// 3. FINANCIAL INSTITUTIONS (Uganda & East Africa Context)
// Includes both Traditional Banks and Mobile Money Bulk Payers.
export const BANK_LIST = [
  { code: 'MTN', name: 'MTN Mobile Money (Merchant)', category: 'MOBILE_MONEY' },
  { code: 'AIRTEL', name: 'Airtel Money (Merchant)', category: 'MOBILE_MONEY' },
  { code: 'STANBIC', name: 'Stanbic Bank', category: 'BANK' },
  { code: 'CENTENARY', name: 'Centenary Bank', category: 'BANK' },
  { code: 'EQUITY', name: 'Equity Bank', category: 'BANK' },
  { code: 'ABSA', name: 'ABSA Bank', category: 'BANK' },
  { code: 'DFCU', name: 'DFCU Bank', category: 'BANK' },
  { code: 'KCB', name: 'KCB Bank', category: 'BANK' },
  { code: 'DTB', name: 'Diamond Trust Bank (DTB)', category: 'BANK' },
  { code: 'SCB', name: 'Standard Chartered Bank', category: 'BANK' },
  { code: 'BOA', name: 'Bank of Africa', category: 'BANK' },
  { code: 'UBA', name: 'United Bank for Africa (UBA)', category: 'BANK' },
  { code: 'HOUSING', name: 'Housing Finance Bank', category: 'BANK' },
  { code: 'POST', name: 'PostBank Uganda', category: 'BANK' },
];

// 4. COUNTRY CODES (For Phone Numbers)
// Prioritizing the core operational markets.
export const COUNTRY_CODES = [
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+211', country: 'South Sudan', flag: '🇸🇸' },
  { code: '+243', country: 'DRC', flag: '🇨🇩' },
];

// 5. CONTACT ROLES
// Who are we calling?
export const CONTACT_ROLES = [
  { value: 'OWNER', label: 'Business Owner / Director' },
  { value: 'OPS_MANAGER', label: 'Operations Manager' },
  { value: 'FINANCE', label: 'Finance Lead (Payments)' },
  { value: 'IT_ADMIN', label: 'System Admin / IT' },
  { value: 'EMERGENCY', label: 'Emergency Hotline (24/7)' },
];

// 6. DEFAULTS
export const DEFAULT_CURRENCY = 'UGX';