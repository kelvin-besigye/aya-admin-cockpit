/**
 * 👑 AYABUS FINANCIAL PHYSICS ENGINE (v3.0 Sovereign)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt Clearinghouse
 * File: reconciliation.physics.js
 * * DESCRIPTION:
 * This is the pure mathematical core of the cancellation system. 
 * It calculates time-depreciation penalties, zero-leakage yield splits, 
 * and generates the exact Double-Entry Ledger data required for Operator Clawbacks.
 */

// ============================================================================
// 1. FAILSAFE DEFAULTS (In case Control Centre is unreachable)
// ============================================================================
const DEFAULT_RULES = {
    REFUND_TIER_HIGH: 90,           // 90% refund if > 24 hours
    REFUND_TIER_MID: 50,            // 50% refund if 4-24 hours
    REFUND_TIER_DEADLINE: 4,        // 0% refund if < 4 hours
    PLATFORM_PENALTY_SHARE: 50,     // Platform keeps 50% of the cancellation penalty
    NON_REFUNDABLE_TAX: true        // Service tax is NEVER refunded
};

export const ReconciliationPhysics = {

    // ========================================================================
    // 2. TEMPORAL ENGINE (Calculates Time Until Departure)
    // ========================================================================
    /**
     * Parses a departure string (e.g., "09:00 PM") and travel date into a precise Date object.
     * Calculates the exact hours remaining until departure.
     */
    getHoursUntilDeparture: (travelDate, departureTimeStr, requestTime = new Date()) => {
        try {
            if (!travelDate || !departureTimeStr) return 0;

            const departureDate = new Date(travelDate);
            
            // Parse "09:00 PM"
            const [time, modifier] = departureTimeStr.split(' ');
            let [hours, minutes] = time.split(':');
            
            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);

            if (hours === 12) hours = 0;
            if (modifier === 'PM') hours += 12;

            departureDate.setHours(hours, minutes, 0, 0);

            // Calculate Difference
            const diffMs = departureDate - requestTime;
            const diffHours = diffMs / (1000 * 60 * 60);

            return diffHours > 0 ? diffHours : 0; // If already departed, returns 0
        } catch (error) {
            console.error("Physics Engine Temporal Error:", error);
            return 0; // Default to 0 hours (triggers maximum penalty) on failure
        }
    },

    // ========================================================================
    // 3. THE YIELD GENERATOR (Calculates the Exact Financial Split)
    // ========================================================================
    /**
     * The Master Equation. Takes a canceled ticket and system settings, 
     * and generates the exact Double-Entry Ledger mapping.
     * * @param {Object} ticket - The ticket object from the database
     * @param {Array} systemSettings - The live settings array from Control Centre
     * @param {Date} requestTime - The exact moment the refund was initiated
     */
    calculateSettlement: (ticket, systemSettings = [], requestTime = new Date()) => {
        
        // --- A. EXTRACT LIVE RULES FROM CONTROL CENTRE ---
        const getSetting = (key, fallback) => {
            const setting = systemSettings.find(s => s.config_key === key);
            return setting ? Number(setting.config_value) : fallback;
        };

        const ruleHigh = getSetting('REFUND_TIER_HIGH', DEFAULT_RULES.REFUND_TIER_HIGH);
        const ruleMid = getSetting('REFUND_TIER_MID', DEFAULT_RULES.REFUND_TIER_MID);
        const ruleDeadline = getSetting('REFUND_TIER_DEADLINE', DEFAULT_RULES.REFUND_TIER_DEADLINE);
        const platformPenaltyShare = getSetting('PLATFORM_PENALTY_SHARE', DEFAULT_RULES.PLATFORM_PENALTY_SHARE);

        // --- B. PARSE TICKET FINANCIALS ---
        // Ensure safe mathematical floats
        const baseFare = Number(ticket.base_fare || ticket.price_ticket || 0); 
        const platformTax = Number(ticket.platform_tax || ticket.service_tax || 0);
        const totalPaid = baseFare + platformTax;

        // --- C. CALCULATE TIME DEPRECIATION (The Penalty) ---
        const hoursLeft = ReconciliationPhysics.getHoursUntilDeparture(ticket.travel_date, ticket.departure_time, requestTime);
        
        let refundPercentage = 0;
        if (hoursLeft >= 24) {
            refundPercentage = ruleHigh; // e.g., 90%
        } else if (hoursLeft >= ruleDeadline) {
            refundPercentage = ruleMid;  // e.g., 50%
        } else {
            refundPercentage = 0;        // e.g., 0% (Too late)
        }

        const penaltyPercentage = 100 - refundPercentage;

        // --- D. THE SPLIT MATHEMATICS ---
        
        // 1. What does the customer get back? (Base fare minus penalty)
        const totalPenaltyAmount = Math.round(baseFare * (penaltyPercentage / 100));
        const customerRefund = baseFare - totalPenaltyAmount;

        // 2. How do we divide the penalty profit?
        const platformPenaltyYield = Math.round(totalPenaltyAmount * (platformPenaltyShare / 100));
        const operatorPenaltyYield = totalPenaltyAmount - platformPenaltyYield;

        // 3. What is the Operator's actual Debt? (The Clawback)
        // The operator originally received the full Base Fare. 
        // We let them keep their share of the penalty, and claw back the rest.
        const operatorClawback = baseFare - operatorPenaltyYield;

        // --- E. LEDGER AUDIT (The Checksum) ---
        // In world-class fintech, we must mathematically prove no money was lost in rounding.
        // Customer Refund + Platform Tax + Platform Yield + Operator Yield MUST equal Total Paid.
        const mathCheck = customerRefund + platformTax + platformPenaltyYield + operatorPenaltyYield;
        const isLedgerBalanced = Math.abs(mathCheck - totalPaid) < 1; // Tolerance for 1 UGX floating point variance

        if (!isLedgerBalanced) {
            console.error("🚨 CRITICAL: SETTLEMENT CHECKSUM FAILED!", { totalPaid, mathCheck });
        }

        // --- F. RETURN THE DOUBLE-ENTRY PAYLOAD ---
        return {
            status: isLedgerBalanced ? 'VALID' : 'CHECKSUM_ERROR',
            metrics: {
                hours_until_departure: Math.round(hoursLeft * 10) / 10,
                penalty_applied_pct: penaltyPercentage,
            },
            financials: {
                original_total_paid: totalPaid,
                original_base_fare: baseFare,
                original_platform_tax: platformTax,
                
                // LIABILITY: What we owe the customer
                payout_customer_refund: customerRefund,
                
                // REVENUE: What the platform makes
                yield_platform_tax_retained: platformTax,
                yield_platform_penalty_cut: platformPenaltyYield,
                yield_platform_total: platformTax + platformPenaltyYield,
                
                // DEBT: What the Operator keeps vs what they owe us
                yield_operator_compensation: operatorPenaltyYield,
                debt_operator_clawback: operatorClawback 
            }
        };
    }
};

export default ReconciliationPhysics;