import { 
    HEALTH_METRIC_WEIGHTS, 
    PARTNER_TIERS, 
    COMPLIANCE_DOCUMENTS, 
    YIELD_PENALTIES 
} from './partner.constants';

/**
 * 👑 AYABUS PARTNER CENTRE (Level 1: The Brains - Sovereign Edition V2)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: partner.utils.js
 * * DESCRIPTION:
 * The apex mathematical and logical engine for the Partner Ecosystem.
 * Features non-linear performance algorithms, EAT-anchored chronology, 
 * zero-crash data sanitization, and high-fidelity financial formatters.
 */

// ========================================================================
// 1. DATA SANITIZATION GATES
// Protects the OS from corrupted database payloads.
// ========================================================================
const sanitizeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
};

const sanitizePercentage = (value, isInverse = false) => {
    const num = sanitizeNumber(value);
    // If it's an inverse metric (like cancellations), missing data assumes 0% (perfect).
    // If it's a positive metric (like on-time), missing data assumes 50% (neutral penalty).
    if (isNaN(num)) return isInverse ? 0 : 50; 
    return Math.max(0, Math.min(100, num));
};

// ========================================================================
// 2. THE ALGORITHMIC HEALTH CALCULATOR (Non-Linear Engine)
// Converts raw operational metrics into a normalized 0-100 Sovereign Score.
// ========================================================================
/**
 * Calculates the overall health score of an operator using exponential decay for failures.
 * @param {Object} metrics - Raw performance data from the dispatch telemetry
 * @returns {number} Integer between 0 and 100
 */
export const calculateAlgorithmicHealth = (metrics = {}) => {
    // 1. Sanitize incoming telemetry
    const onTimePct = sanitizePercentage(metrics.onTimePct, false);
    const cancellationPct = sanitizePercentage(metrics.cancellationPct, true);
    const disputePct = sanitizePercentage(metrics.disputePct, true);
    const passengerRating = sanitizeNumber(metrics.passengerRating, 5); // Fallback to 5 stars if no reviews

    // 2. On-Time Score (Linear positive correlation)
    const onTimeScore = onTimePct * HEALTH_METRIC_WEIGHTS.ON_TIME_DEPARTURE;

    // 3. Cancellation Score (Non-Linear Exponential Penalty)
    // A 2% cancel rate might drop the score by 2 points, but a 10% rate drops it by 25 points.
    const cancelPenaltyFactor = Math.pow(cancellationPct, 1.4); 
    const cancelBase = Math.max(0, 100 - (cancelPenaltyFactor * 3));
    const cancelScore = cancelBase * HEALTH_METRIC_WEIGHTS.CANCELLATION_RATE;

    // 4. Passenger Rating (Mapped from 0-5 to 0-100 scale)
    const ratingNormalized = Math.max(0, Math.min(100, (passengerRating / 5) * 100));
    const ratingScore = ratingNormalized * HEALTH_METRIC_WEIGHTS.PASSENGER_RATING;

    // 5. Dispute Ratio (Fierce Linear Penalty - Chargebacks are intolerable)
    const disputeBase = Math.max(0, 100 - (disputePct * 15));
    const disputeScore = disputeBase * HEALTH_METRIC_WEIGHTS.DISPUTE_RATIO;

    // Aggregate, round, and enforce absolute 0-100 boundaries
    const rawScore = onTimeScore + cancelScore + ratingScore + disputeScore;
    return Math.round(Math.max(0, Math.min(100, rawScore)));
};

// ========================================================================
// 3. TIER RESOLUTION ENGINE
// Evaluates score AND hard operational limits to determine Sovereign Tier.
// ========================================================================
/**
 * Determines the Partner Tier based on Health Score and strict Cancellation limits.
 * @param {number} healthScore - Calculated 0-100 score
 * @param {number} rawCancellationPct - Raw cancellation percentage
 * @returns {Object} The complete PARTNER_TIERS configuration object
 */
export const resolvePartnerTier = (healthScore, rawCancellationPct) => {
    const score = sanitizeNumber(healthScore, 0);
    const cancelPct = sanitizeNumber(rawCancellationPct, 100);

    // Cascading logical gates. SLA failure instantly demotes regardless of health score.
    if (score >= PARTNER_TIERS.PLATINUM.minHealthScore && cancelPct <= PARTNER_TIERS.PLATINUM.maxCancellationRate) {
        return PARTNER_TIERS.PLATINUM;
    }
    if (score >= PARTNER_TIERS.GOLD.minHealthScore && cancelPct <= PARTNER_TIERS.GOLD.maxCancellationRate) {
        return PARTNER_TIERS.GOLD;
    }
    if (score >= PARTNER_TIERS.STANDARD.minHealthScore && cancelPct <= PARTNER_TIERS.STANDARD.maxCancellationRate) {
        return PARTNER_TIERS.STANDARD;
    }
    if (score >= PARTNER_TIERS.AT_RISK.minHealthScore && cancelPct <= PARTNER_TIERS.AT_RISK.maxCancellationRate) {
        return PARTNER_TIERS.AT_RISK;
    }
    
    // Fallback: Operationally Suspended
    return PARTNER_TIERS.SUSPENDED;
};

// ========================================================================
// 4. CHRONOLOGY & COMPLIANCE SHIELD (EAT Anchored)
// Date arithmetic for MoWT, TLB, and Police IOV document verification.
// ========================================================================
/**
 * Analyzes a legal document's expiry date against OS Constants to return its live status.
 * @param {string} expiryDateStr - ISO date string (e.g., '2026-11-15')
 * @param {string} docId - Key mapping to COMPLIANCE_DOCUMENTS
 * @returns {Object} Status object with exact UI parameters
 */
export const analyzeComplianceStatus = (expiryDateStr, docId) => {
    const config = COMPLIANCE_DOCUMENTS[docId];
    if (!config) return { status: 'UNKNOWN', daysRemaining: 0, color: 'var(--border-subtle)', label: 'Unregistered Document', isHardBlock: false };
    if (!expiryDateStr) return { status: 'MISSING', daysRemaining: 0, color: 'var(--status-danger)', label: 'Document Missing', isHardBlock: config.isHardBlock };

    try {
        // Anchor to current timestamp, removing arbitrary time-of-day offsets
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const expiryDate = new Date(expiryDateStr);
        if (isNaN(expiryDate.getTime())) throw new Error("Invalid Date Format");
        expiryDate.setHours(0, 0, 0, 0);

        const msPerDay = 1000 * 60 * 60 * 24;
        const diffTime = expiryDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / msPerDay);

        // State Machine
        if (daysRemaining <= 0) {
            return { 
                status: 'EXPIRED', 
                daysRemaining: 0, 
                color: 'var(--status-danger)', 
                label: `Expired ${Math.abs(daysRemaining)}d ago`,
                isHardBlock: config.isHardBlock
            };
        }
        if (daysRemaining <= config.criticalDays) {
            return { status: 'CRITICAL', daysRemaining, color: 'var(--brand-accent)', label: `Critical (${daysRemaining}d left)`, isHardBlock: false };
        }
        if (daysRemaining <= config.warnDays) {
            return { status: 'WARNING', daysRemaining, color: 'var(--status-warning)', label: `Warning (${daysRemaining}d left)`, isHardBlock: false };
        }

        return { status: 'VALID', daysRemaining, color: 'var(--status-success)', label: 'Valid & Active', isHardBlock: false };
    } catch (error) {
        console.error(`Chronology Engine Failure on ${docId}:`, error);
        return { status: 'ERROR', daysRemaining: 0, color: 'var(--status-danger)', label: 'Date Parse Error', isHardBlock: true };
    }
};

// ========================================================================
// 5. FORENSIC FINANCIAL CALCULATORS (Yield Leakage)
// ========================================================================
/**
 * Calculates the exact UGX amount a partner left on the table due to operational failures.
 * @param {Object} metrics - Volume metrics
 * @returns {Object} Total lost revenue, exact breakdown, and a UI-ready insight string
 */
export const calculateYieldLeakage = ({ cancelledTickets = 0, noShowChargebacks = 0 } = {}) => {
    const safeCancels = sanitizeNumber(cancelledTickets);
    const safeChargebacks = sanitizeNumber(noShowChargebacks);

    const lossFromCancellations = safeCancels * YIELD_PENALTIES.AVERAGE_TICKET_PRICE_UGX;
    const lossFromPenalties = safeChargebacks * YIELD_PENALTIES.NO_SHOW_CHARGEBACK_FEE_UGX;
    
    const totalLeakage = lossFromCancellations + lossFromPenalties;

    // Advanced Insight Generation
    let insightMessage = "Perfect operational yield. Zero leakage detected.";
    if (totalLeakage > 0) {
        if (lossFromCancellations > lossFromPenalties * 2) {
            insightMessage = `Fleet reliability is critical. Cancellations cost you ${formatCompactCurrency(lossFromCancellations)} this period.`;
        } else if (lossFromPenalties > 0) {
            insightMessage = `Chargeback penalties are draining capital. You lost ${formatCompactCurrency(lossFromPenalties)} in gateway fines.`;
        } else {
            insightMessage = `You left ${formatCompactCurrency(totalLeakage)} on the table due to combined SLA failures.`;
        }
    }

    return {
        totalLeakage,
        breakdown: { cancellations: lossFromCancellations, penalties: lossFromPenalties },
        insightMessage
    };
};

// ========================================================================
// 6. SOVEREIGN UI FORMATTERS (High-Fidelity String Manipulation)
// ========================================================================

/**
 * Standardizes Operator IDs for strict UI rendering.
 */
export const formatPartnerId = (id) => {
    if (!id) return 'OP-00000';
    const cleanId = String(id).replace(/[^0-9a-zA-Z]/g, ''); // Strip bad chars
    return `OP-${cleanId.padStart(5, '0').toUpperCase()}`;
};

/**
 * World-Class Standard Currency Formatter (Cross-Border Ready)
 * @param {number} amount - Raw integer/float
 * @param {string} currency - Standard 3-letter ISO code
 * @param {number} exchangeRate - Live FX multiplier
 */
export const formatCurrency = (amount, currency = 'UGX', exchangeRate = 1) => {
    const safeAmount = sanitizeNumber(amount) * sanitizeNumber(exchangeRate, 1);
    
    // East African Locales Map for precise symbol placement
    const localeMap = { 'UGX': 'en-UG', 'KES': 'en-KE', 'TZS': 'en-TZ', 'RWF': 'en-RW', 'USD': 'en-US' };
    const locale = localeMap[currency] || 'en-US';

    return new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: currency === 'USD' ? 2 : 0 // No cents for UGX/TZS
    }).format(safeAmount);
};

/**
 * World-Class Compact Currency Formatter (For Dashboards/KPIs)
 * Converts 1,500,000 to "1.5M UGX"
 */
export const formatCompactCurrency = (amount, currency = 'UGX', exchangeRate = 1) => {
    const safeAmount = sanitizeNumber(amount) * sanitizeNumber(exchangeRate, 1);
    const localeMap = { 'UGX': 'en-UG', 'KES': 'en-KE', 'TZS': 'en-TZ', 'RWF': 'en-RW', 'USD': 'en-US' };
    const locale = localeMap[currency] || 'en-US';

    return new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: currency, 
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(safeAmount);
};

/**
 * Accounting Currency Formatter
 * Displays negative numbers in red parentheses: e.g., (UGX 5,000)
 */
export const formatAccountingCurrency = (amount, currency = 'UGX') => {
    const safeAmount = sanitizeNumber(amount);
    const formatted = formatCurrency(Math.abs(safeAmount), currency);
    return safeAmount < 0 ? `(${formatted})` : formatted;
};

/**
 * Sovereign Text Truncation
 * Safely truncates strings without splitting words in half.
 */
export const truncateText = (str, maxLength = 30) => {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    const trimmed = str.substr(0, maxLength);
    // Re-trim if we are in the middle of a word
    return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) + '...';
};