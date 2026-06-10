/**
 * TREASURY UTILITIES (The Math & Logic Engine)
 * ------------------------------------------------------------------
 * Contains pure, side-effect-free functions for financial calculations.
 * Handles exact zero-touch splits, variance deltas, and cross-border 
 * currency formatting. 
 */

import { SUPPORTED_CURRENCIES, DEFAULT_BASE_CURRENCY } from './treasury.constants';

// ==========================================================
// 1. CROSS-BORDER CURRENCY FORMATTER
// Converts raw database integers into localized, FX-adjusted strings.
// ==========================================================
/**
 * Formats a monetary value into the requested currency.
 * @param {number} amount - The raw amount in the base currency.
 * @param {string} targetCurrency - e.g., 'UGX', 'USD', 'KES'.
 * @param {number} exchangeRate - The live FX multiplier (default is 1).
 * @returns {string} Formatted string (e.g., "USh 45,000" or "$ 12.50")
 */
export const formatCurrency = (amount, targetCurrency = DEFAULT_BASE_CURRENCY, exchangeRate = 1) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '--';

  const currencyDef = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES[DEFAULT_BASE_CURRENCY];
  const convertedAmount = amount * exchangeRate;

  // We use Intl.NumberFormat for native, perfect localization (commas, decimals)
  return new Intl.NumberFormat(currencyDef.locale, {
    style: 'currency',
    currency: currencyDef.code,
    // Typically, East African currencies don't show decimals, but USD/EUR do.
    minimumFractionDigits: currencyDef.isNative ? 0 : 2,
    maximumFractionDigits: currencyDef.isNative ? 0 : 2,
  }).format(convertedAmount);
};

/**
 * Compact formatter for large chart numbers (e.g., 1,500,000 -> 1.5M)
 */
export const formatCompactCurrency = (amount, targetCurrency = DEFAULT_BASE_CURRENCY, exchangeRate = 1) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '--';
  
  const currencyDef = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES[DEFAULT_BASE_CURRENCY];
  const convertedAmount = amount * exchangeRate;

  return new Intl.NumberFormat(currencyDef.locale, {
    style: 'currency',
    currency: currencyDef.code,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(convertedAmount);
};


// ==========================================================
// 2. ZERO-TOUCH SPLIT ENGINE (Unit Economics)
// The strict mathematical breakdown of every single transaction.
// ==========================================================
/**
 * Calculates the exact routing of funds based on dynamic contracts.
 * @param {number} grossVolume - Total paid by the customer.
 * @param {number} gatewayFeePct - The % charged by MTN/Visa (e.g., 2.5).
 * @param {number} platformTakePct - AyaBus's agreed revenue share % (e.g., 5.0).
 * @param {number} taxRatePct - Statutory Tax % applied to the platform fee.
 * @returns {Object} The exact monetary split.
 */
export const computeZeroTouchSplit = (
  grossVolume = 0, 
  gatewayFeePct = 0, 
  platformTakePct = 0, 
  taxRatePct = 0
) => {
  // 1. Calculate Deductions
  const gatewayFee = grossVolume * (gatewayFeePct / 100);
  
  // 2. Calculate Platform Yield (AyaBus Revenue)
  const platformYieldRaw = grossVolume * (platformTakePct / 100);
  
  // 3. Tax is typically applied to the service fee (platform yield), not the gross ticket.
  const taxLiability = platformYieldRaw * (taxRatePct / 100);
  const netPlatformYield = platformYieldRaw - taxLiability;

  // 4. Operator receives the remainder
  const partnerPayout = grossVolume - gatewayFee - platformYieldRaw;

  // Ensure floating-point anomalies don't break the ledger sum
  return {
    gross_volume: Number(grossVolume.toFixed(2)),
    gateway_fee: Number(gatewayFee.toFixed(2)),
    tax_liability: Number(taxLiability.toFixed(2)),
    platform_yield: Number(netPlatformYield.toFixed(2)), // What AyaBus keeps
    partner_payout: Number(partnerPayout.toFixed(2)),    // What Bus Operator gets
  };
};


// ==========================================================
// 3. VARIANCE & VELOCITY CALCULATOR
// Compares current performance vs historical performance.
// ==========================================================
/**
 * Calculates the percentage change between two epochs.
 * @param {number} current - Value for the current period (e.g., This Week)
 * @param {number} previous - Value for the prior period (e.g., Last Week)
 * @param {boolean} inverseLogic - If true, an UP trend is bad (e.g., for Gateway Fees/Refunds)
 * @returns {Object} Formatted data ready for the DeltaIndicator UI component.
 */
export const calculateVariance = (current = 0, previous = 0, inverseLogic = false) => {
  // Edge Case: No previous data exists
  if (!previous || previous === 0) {
    if (current > 0) return { raw: 100, trend: 'UP', isFavorable: !inverseLogic, formatted: '+100.0%' };
    return { raw: 0, trend: 'NEUTRAL', isFavorable: true, formatted: '0.0%' };
  }

  const delta = current - previous;
  const percentChange = (delta / previous) * 100;
  
  // Determine Trend Direction
  let trend = 'NEUTRAL';
  if (percentChange > 0) trend = 'UP';
  if (percentChange < 0) trend = 'DOWN';

  // Determine if this is a "Good" or "Bad" thing
  // Example: High Revenue is Good (isFavorable = true). High Refunds is Bad (isFavorable = false).
  let isFavorable = true;
  if (trend === 'UP') isFavorable = !inverseLogic;
  if (trend === 'DOWN') isFavorable = inverseLogic;

  // Formatting for the UI (e.g., "+14.2%" or "-3.5%")
  const sign = percentChange > 0 ? '+' : '';
  const formatted = `${sign}${percentChange.toFixed(1)}%`;

  return {
    raw: percentChange,
    trend,       // 'UP' | 'DOWN' | 'NEUTRAL'
    isFavorable, // true (Green) | false (Red)
    formatted    // String for direct UI injection
  };
};