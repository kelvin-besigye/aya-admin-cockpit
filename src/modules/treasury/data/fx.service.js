/**
 * FX SERVICE (The Global Exchange Engine)
 * ------------------------------------------------------------------
 * Handles real-time currency conversions.
 * Implements a strict caching mechanism to prevent API rate-limiting 
 * and ensure zero-latency UI updates when switching currencies.
 */

import { DEFAULT_BASE_CURRENCY, SUPPORTED_CURRENCIES } from './treasury.constants';

// --- CONFIGURATION ---
// We use a reliable open exchange rate endpoint. In production, 
// you can swap this with your paid ExchangeRate-API or Fixer.io URL.
const FX_API_ENDPOINT = 'https://open.er-api.com/v6/latest/';
const CACHE_KEY = 'citadel_fx_rates_cache';
const TIMESTAMP_KEY = 'citadel_fx_last_updated';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour Cache

// --- TIER 3: EMERGENCY FALLBACK MATRIX ---
// If the API dies and cache is empty, the system survives on these rough estimates.
// Based on USD as the anchor.
const FALLBACK_RATES = {
  USD: 1,
  UGX: 3850,
  KES: 135,
  TZS: 2550,
  RWF: 1280,
  EUR: 0.92,
  GBP: 0.79
};

export const fxService = {

  // ==========================================================
  // 1. THE FETCH ENGINE (Live Sync)
  // ==========================================================
  /**
   * Fetches live exchange rates relative to a base currency.
   * @param {string} baseCurrency - Usually 'USD' or 'UGX'
   * @param {boolean} forceRefresh - If true, bypasses the 1-hour cache
   * @returns {Object} { rates: {...}, timestamp: 170845... }
   */
  getRates: async (baseCurrency = 'USD', forceRefresh = false) => {
    try {
      // 1. Check Local Cache (Unless forced)
      if (!forceRefresh) {
        const cachedRates = localStorage.getItem(`${CACHE_KEY}_${baseCurrency}`);
        const cachedTime = localStorage.getItem(`${TIMESTAMP_KEY}_${baseCurrency}`);
        
        if (cachedRates && cachedTime) {
          const age = Date.now() - parseInt(cachedTime, 10);
          if (age < CACHE_TTL_MS) {
            return {
              rates: JSON.parse(cachedRates),
              timestamp: parseInt(cachedTime, 10),
              source: 'CACHE'
            };
          }
        }
      }

      // 2. Fetch Live from API
      const response = await fetch(`${FX_API_ENDPOINT}${baseCurrency}`);
      if (!response.ok) throw new Error(`FX API Error: ${response.status}`);
      
      const data = await response.json();
      const liveRates = data.rates;
      const now = Date.now();

      // 3. Save to Cache
      localStorage.setItem(`${CACHE_KEY}_${baseCurrency}`, JSON.stringify(liveRates));
      localStorage.setItem(`${TIMESTAMP_KEY}_${baseCurrency}`, now.toString());

      return {
        rates: liveRates,
        timestamp: now,
        source: 'LIVE'
      };

    } catch (error) {
      console.warn("FX Engine: Live fetch failed, engaging fallbacks.", error);
      
      // 4. Fallback Execution
      const cachedRates = localStorage.getItem(`${CACHE_KEY}_${baseCurrency}`);
      if (cachedRates) {
        return {
          rates: JSON.parse(cachedRates),
          timestamp: parseInt(localStorage.getItem(`${TIMESTAMP_KEY}_${baseCurrency}`) || Date.now(), 10),
          source: 'STALE_CACHE'
        };
      }

      // 5. Hard Fallback (Math against USD anchor)
      console.error("FX Engine: Cache empty. Using emergency hardcoded matrix.");
      const baseAnchor = FALLBACK_RATES[baseCurrency] || 1;
      const derivedRates = {};
      Object.keys(FALLBACK_RATES).forEach(curr => {
        derivedRates[curr] = FALLBACK_RATES[curr] / baseAnchor;
      });

      return {
        rates: derivedRates,
        timestamp: Date.now(),
        source: 'EMERGENCY_FALLBACK'
      };
    }
  },

  // ==========================================================
  // 2. THE CONVERSION UTILITY
  // ==========================================================
  /**
   * Instantly converts an amount from one currency to another using a provided rate map.
   * @param {number} amount - The value to convert
   * @param {string} fromCurrency - e.g., 'UGX'
   * @param {string} toCurrency - e.g., 'USD'
   * @param {Object} ratesMap - The rate object fetched from getRates()
   * @returns {number} The converted float
   */
  convertAmount: (amount, fromCurrency, toCurrency, ratesMap) => {
    if (!amount || isNaN(amount)) return 0;
    if (fromCurrency === toCurrency) return amount;
    
    // If our rates map is based on USD, but we want UGX -> KES:
    // We convert UGX to USD, then USD to KES.
    const fromRate = ratesMap[fromCurrency] || 1;
    const toRate = ratesMap[toCurrency] || 1;

    // Convert to Base (amount / fromRate) then multiply by Target ( * toRate )
    const baseAmount = amount / fromRate;
    const finalAmount = baseAmount * toRate;

    return Number(finalAmount.toFixed(2));
  },

  // ==========================================================
  // 3. SYSTEM VALIDATION
  // ==========================================================
  /**
   * Returns a list of currency codes that the API actually returned,
   * filtered against our supported business currencies.
   */
  getAvailableCurrencies: (ratesMap) => {
    if (!ratesMap) return [];
    return Object.keys(SUPPORTED_CURRENCIES).filter(code => ratesMap[code] !== undefined);
  }

};