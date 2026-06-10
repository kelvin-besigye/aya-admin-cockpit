/**
 * TREASURY CONSTANTS (The Immutable DNA)
 * ------------------------------------------------------------------
 * The central nervous system for the Treasury Module.
 * Defines the strict, real-world enums for cross-border currencies, 
 * time epochs, payment gateways, and the Zero-Touch split models.
 * * NOTE: Colors are mapped to Citadel CSS variables to ensure seamless
 * Light/Dark mode transitions on all charts and badges.
 */

// ==========================================================
// 1. REVENUE TRANCHES (The "Zero-Touch" Split Logic)
// Enforces the 3-way distinction of all processed funds.
// ==========================================================
export const REVENUE_TRANCHES = Object.freeze({
  GROSS_VOLUME: {
    id: 'GROSS_VOLUME',
    label: 'Total Processed',
    description: 'Total amount charged to the customer.',
    color: 'var(--text-main)' // Neutral high-contrast
  },
  PARTNER_PAYOUT: {
    id: 'PARTNER_PAYOUT',
    label: 'Operator Revenue',
    description: 'Funds automatically routed to the bus operator.',
    color: '#10B981' // Hardcoded emerald green for universally recognizable "Incoming Cash"
  },
  PLATFORM_YIELD: {
    id: 'PLATFORM_YIELD',
    label: 'AyaBus Yield',
    description: 'Platform service fees and retained revenue.',
    color: 'var(--brand-primary)' // Royal Blue/Gold depending on theme
  },
  GATEWAY_FEES: {
    id: 'GATEWAY_FEES',
    label: 'Processing Fees',
    description: 'Fees deducted by MTN, Airtel, Stripe, or Visa.',
    color: 'var(--status-error)' // Red for friction/deductions
  },
  TAX_LIABILITY: {
    id: 'TAX_LIABILITY',
    label: 'Statutory Tax',
    description: 'VAT or government levies withheld.',
    color: 'var(--text-muted)'
  }
});

// ==========================================================
// 2. GLOBAL CURRENCIES (Cross-Border Engine)
// Real-world configuration for East Africa and global cards.
// ==========================================================
export const DEFAULT_BASE_CURRENCY = 'UGX';

export const SUPPORTED_CURRENCIES = Object.freeze({
  UGX: { 
    code: 'UGX', 
    symbol: 'USh', 
    label: 'Ugandan Shilling', 
    locale: 'en-UG', 
    isNative: true 
  },
  KES: { 
    code: 'KES', 
    symbol: 'KSh', 
    label: 'Kenyan Shilling', 
    locale: 'en-KE', 
    isNative: true 
  },
  TZS: { 
    code: 'TZS', 
    symbol: 'TSh', 
    label: 'Tanzanian Shilling', 
    locale: 'en-TZ', 
    isNative: true 
  },
  RWF: { 
    code: 'RWF', 
    symbol: 'FRw', 
    label: 'Rwandan Franc', 
    locale: 'en-RW', 
    isNative: true 
  },
  USD: { 
    code: 'USD', 
    symbol: '$', 
    label: 'US Dollar', 
    locale: 'en-US', 
    isNative: false 
  },
  GBP: { 
    code: 'GBP', 
    symbol: '£', 
    label: 'British Pound', 
    locale: 'en-GB', 
    isNative: false 
  },
  EUR: { 
    code: 'EUR', 
    symbol: '€', 
    label: 'Euro', 
    locale: 'en-IE', 
    isNative: false 
  }
});

// ==========================================================
// 3. PAYMENT GATEWAYS (Liquidity & Friction)
// Real-world gateways mapped to average base fees.
// 'supports_auto_split' indicates gateways capable of zero-touch routing.
// ==========================================================
export const PAYMENT_GATEWAYS = Object.freeze({
  MTN_MOMO: { 
    id: 'MTN_MOMO', 
    label: 'MTN Mobile Money', 
    color: '#FBBF24', // MTN Yellow
    supports_auto_split: true
  },
  AIRTEL_MONEY: { 
    id: 'AIRTEL_MONEY', 
    label: 'Airtel Money', 
    color: '#DC2626', // Airtel Red
    supports_auto_split: true
  },
  SAFARICOM_MPESA: { 
    id: 'SAFARICOM_MPESA', 
    label: 'M-Pesa', 
    color: '#16A34A', // Safaricom Green
    supports_auto_split: true
  },
  CARD_STRIPE: { 
    id: 'CARD_STRIPE', 
    label: 'Visa / Mastercard', 
    color: '#6366F1', // Stripe Indigo
    supports_auto_split: true
  },
  CASH_AGENT: { 
    id: 'CASH_AGENT', 
    label: 'Box Office Cash', 
    color: 'var(--text-muted)', 
    supports_auto_split: false // Cash requires manual reconciliation
  }
});

// ==========================================================
// 4. TIME EPOCHS (The Macro/Micro Filter Engine)
// Used by the TimeHorizonEngine for rapid DB aggregations.
// ==========================================================
export const TIME_EPOCHS = Object.freeze({
  // Micro Horizons (Immediate Liquidity)
  TODAY: { id: 'TODAY', label: 'Today', type: 'MICRO', days: 1 },
  YESTERDAY: { id: 'YESTERDAY', label: 'Yesterday', type: 'MICRO', days: 1 },
  LAST_7D: { id: 'LAST_7D', label: 'Last 7 Days', type: 'MICRO', days: 7 },
  LAST_30D: { id: 'LAST_30D', label: 'Last 30 Days', type: 'MICRO', days: 30 },
  
  // Macro Horizons (Historical Performance)
  YTD: { id: 'YTD', label: 'Year to Date', type: 'MACRO', days: null },
  Q1: { id: 'Q1', label: 'Q1 (Jan-Mar)', type: 'MACRO', days: 90 },
  Q2: { id: 'Q2', label: 'Q2 (Apr-Jun)', type: 'MACRO', days: 91 },
  Q3: { id: 'Q3', label: 'Q3 (Jul-Sep)', type: 'MACRO', days: 92 },
  Q4: { id: 'Q4', label: 'Q4 (Oct-Dec)', type: 'MACRO', days: 92 },
  LAST_YEAR: { id: 'LAST_YEAR', label: 'Last Calendar Year', type: 'MACRO', days: 365 },
  ALL_TIME: { id: 'ALL_TIME', label: 'All-Time / Lifetime', type: 'MACRO', days: null }
});

// ==========================================================
// 5. LEDGER STATUSES (Transaction Health)
// Tracks the exact state of money movement and anomalies.
// ==========================================================
export const LEDGER_STATUS = Object.freeze({
  SETTLED: { 
    id: 'SETTLED', 
    label: 'Settled & Split', 
    color: 'var(--status-success)', 
    is_anomaly: false,
    description: 'Funds successfully processed and routed.'
  },
  CLEARING: { 
    id: 'CLEARING', 
    label: 'Pending Clearing', 
    color: 'var(--brand-accent)', 
    is_anomaly: false,
    description: 'Payment authorized, awaiting bank settlement.'
  },
  REFUNDED: { 
    id: 'REFUNDED', 
    label: 'Refunded to Customer', 
    color: 'var(--status-error)', 
    is_anomaly: true,
    description: 'Funds returned. Impact deducted from Gross.'
  },
  CHARGEBACK: { 
    id: 'CHARGEBACK', 
    label: 'Disputed', 
    color: '#991B1B', // Deep Crimson
    is_anomaly: true,
    description: 'Customer disputed charge with bank/telco.'
  },
  FAILED: { 
    id: 'FAILED', 
    label: 'Failed Processing', 
    color: 'var(--text-muted)', 
    is_anomaly: true,
    description: 'Gateway declined or timeout occurred.'
  }
});