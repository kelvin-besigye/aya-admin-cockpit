/**
 * 👑 AYABUS PARTNER CENTRE (Level 1: The DNA - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: partner.constants.js
 * * DESCRIPTION:
 * The foundational physics and compliance rules engine for the Partner Ecosystem.
 * Defines the strict algorithmic thresholds for Health Scores, Tier logic, 
 * and real-world Ugandan regulatory compliance (MoWT / TLB requirements).
 * * * UPGRADE V2 (MAKER-CHECKER INTEGRATION):
 * Synchronized with the Partner Portal Support Hub. The Admin Cockpit now 
 * natively understands ROUTE_ADD, FLEET_ADD, and CRITICAL BREAKDOWN telemetry.
 */

// ========================================================================
// 1. THE ALGORITHMIC HEALTH ENGINE (0-100 Score)
// Defines exactly how a partner's performance is mathematically weighted.
// ========================================================================
export const HEALTH_METRIC_WEIGHTS = {
    ON_TIME_DEPARTURE: 0.35,   // 35% impact (Punctuality is paramount)
    CANCELLATION_RATE: 0.30,   // 30% impact (Inverse: lower is better)
    PASSENGER_RATING: 0.20,    // 20% impact (Aggregated from post-trip reviews)
    DISPUTE_RATIO: 0.15        // 15% impact (Chargebacks & Treasury anomalies)
};

// ========================================================================
// 2. PARTNER ECOSYSTEM TIERS & FINANCIAL PERKS
// Maps a partner's Health Score to their operational and financial privileges.
// ========================================================================
export const PARTNER_TIERS = {
    PLATINUM: {
        id: 'PLATINUM',
        threshold: 90,
        label: 'Platinum Partner',
        color: 'var(--brand-primary)', // Gold
        commissionRate: 0.05,          // 5% (Lowest fee)
        payoutSpeed: 'INSTANT',        // T+0 Settlements
        perks: ['Algorithmic Route Priority', 'Dedicated L9 Dispatcher', 'Zero-Hold Payouts']
    },
    GOLD: {
        id: 'GOLD',
        threshold: 75,
        label: 'Gold Partner',
        color: '#94A3B8',              // Silver/Slate
        commissionRate: 0.08,          // 8% fee
        payoutSpeed: 'T+1',            // 24hr Settlements
        perks: ['Standard Placement', 'Priority Support']
    },
    STANDARD: {
        id: 'STANDARD',
        threshold: 0,
        label: 'Standard Operator',
        color: 'var(--text-muted)',
        commissionRate: 0.12,          // 12% fee
        payoutSpeed: 'T+3',            // 72hr Settlements
        perks: ['Standard Support']
    }
};

// ========================================================================
// 3. COMPLIANCE VAULT (Regulatory Anchor)
// The immutable list of required documents for legal operation in Uganda.
// ========================================================================
export const COMPLIANCE_DOCUMENTS = {
    PSV_LICENCE: { label: 'MoWT PSV Operator License', validityMonths: 12, isHardBlock: true },
    TLB_PERMIT: { label: 'TLB Route Permit', validityMonths: 12, isHardBlock: true },
    THIRD_PARTY_INSURANCE: { label: 'Commercial Third-Party Insurance', validityMonths: 12, isHardBlock: true },
    SPEED_GOVERNOR: { label: 'Police IOV Speed Governor Cert', validityMonths: 6, isHardBlock: true }
};

// ========================================================================
// 4. THE RESOLUTION MATRIX (Maker-Checker Taxonomy)
// Synchronized with Partner Portal `support.dictionary.js`. Routes tickets 
// to specific Admin sub-teams based on operational weight.
// ========================================================================
export const RESOLUTION_CATEGORIES = {
    
    // --- NEW: MAKER-CHECKER OPERATIONAL WORKFLOWS ---
    BREAKDOWN: {
        id: 'BREAKDOWN',
        label: 'SOS / Fleet Breakdown',
        priority: 'CRITICAL',
        color: 'var(--status-danger)',
        autoRouteTo: 'L9_DISPATCH_ADMIN' // Intercepted by DispatchCommLink for instant flashing
    },
    ROUTE_ADD: {
        id: 'ROUTE_ADD',
        label: 'Route / Vector Addition',
        priority: 'MEDIUM',
        color: 'var(--brand-primary)',
        autoRouteTo: 'L9_LOGISTICS_ADMIN'
    },
    FLEET_ADD: {
        id: 'FLEET_ADD',
        label: 'Fleet Asset Registration',
        priority: 'MEDIUM',
        color: 'var(--status-success)',
        autoRouteTo: 'L9_LOGISTICS_ADMIN'
    },
    SCHEDULE_CHANGE: {
        id: 'SCHEDULE_CHANGE',
        label: 'Schedule Alteration',
        priority: 'HIGH',
        color: 'var(--status-warning)',
        autoRouteTo: 'L9_DISPATCH_ADMIN'
    },
    GENERAL: {
        id: 'GENERAL',
        label: 'General Support Inquiry',
        priority: 'LOW',
        color: 'var(--text-main)',
        autoRouteTo: 'L7_SUPPORT_ADMIN'
    },

    // --- LEGACY / SYSTEM-GENERATED WORKFLOWS ---
    FINANCIAL_DISPUTE: {
        id: 'FINANCIAL_DISPUTE',
        label: 'Ledger / Payout Dispute',
        priority: 'HIGH',
        color: '#8B5CF6', // Synchronized with Enterprise Purple
        autoRouteTo: 'L9_TREASURY_ADMIN'
    },
    COMPLIANCE_WARNING: {
        id: 'COMPLIANCE_WARNING',
        label: 'Document Expiry Warning',
        priority: 'MEDIUM',
        color: 'var(--status-warning)',
        autoRouteTo: 'AUTOMATED_SYSTEM'
    },
    PASSENGER_COMPLAINT: {
        id: 'PASSENGER_COMPLAINT',
        label: 'Post-Trip Passenger Incident',
        priority: 'HIGH',
        color: 'var(--brand-accent)',
        autoRouteTo: 'L7_SUPPORT_ADMIN'
    }
};

// ========================================================================
// 5. MAKER-CHECKER STATUS TAXONOMY
// Defines the exact states a ticket can exist in.
// ========================================================================
export const TICKET_STATUSES = {
    PENDING: { id: 'PENDING', label: 'Awaiting Admin', color: 'var(--text-muted)', bg: 'var(--bg-input)' },
    PROCESSING: { id: 'PROCESSING', label: 'In Review', color: 'var(--brand-primary)', bg: 'rgba(206, 172, 92, 0.1)' },
    RESOLVED: { id: 'RESOLVED', label: 'Approved & Executed', color: 'var(--status-success)', bg: 'rgba(34, 197, 94, 0.1)' },
    REJECTED: { id: 'REJECTED', label: 'Declined', color: 'var(--status-danger)', bg: 'rgba(239, 68, 68, 0.1)' }
};

// ========================================================================
// 6. THE YIELD LOSS ENGINE
// Financial penalty metrics for calculating "Money Left on the Table".
// ========================================================================
export const YIELD_PENALTIES = {
    AVERAGE_TICKET_PRICE_UGX: 35000, // Used to estimate lost revenue from cancellations
    CHARGEBACK_FEE_UGX: 15000,       // Admin fee per disputed transaction
    LATE_DEPARTURE_PENALTY_PCT: 0.02 // 2% algorithmic penalty per late trip
};