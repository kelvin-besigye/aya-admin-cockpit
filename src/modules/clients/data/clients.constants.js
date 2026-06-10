/**
 * 👑 AYABUS CLIENT CENTRE (Level 1: The Brains - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: clients.constants.js
 * * DESCRIPTION:
 * The absolute source of truth for Passenger CRM logic. 
 * Defines Lifetime Value (LTV) thresholds, SLA countdown timers, 
 * VIP routing protocols, and AI Sentiment mapping.
 */

// ========================================================================
// 1. LIFETIME VALUE (LTV) TIERS
// ========================================================================
// Defines how the OmniInbox routes and prioritizes incoming messages.
// High LTV passengers bypass the queue and get routed to the VIP Concierge.
export const PASSENGER_LTV_TIERS = {
    SOVEREIGN: {
        id: 'SOVEREIGN',
        label: 'Sovereign VIP',
        minSpendUGX: 5000000, // 5M+ UGX Lifetime Spend
        slaTargetMinutes: 2,  // Must answer within 2 minutes
        perks: ['Queue Bypass', 'Dedicated L9 Concierge', 'No-Questions Refund'],
        color: 'var(--brand-accent)', // Usually a premium gold/purple in the CSS
        bgPulse: 'rgba(139, 92, 246, 0.15)'
    },
    PLATINUM: {
        id: 'PLATINUM',
        label: 'Platinum Voyager',
        minSpendUGX: 2000000, // 2M+ UGX Lifetime Spend
        slaTargetMinutes: 10,
        perks: ['Priority Queue', 'Late-Boarding Grace Period'],
        color: 'var(--brand-primary)',
        bgPulse: 'rgba(37, 99, 235, 0.1)'
    },
    GOLD: {
        id: 'GOLD',
        label: 'Gold Traveler',
        minSpendUGX: 500000, // 500k+ UGX Lifetime Spend
        slaTargetMinutes: 30,
        perks: ['Standard Routing'],
        color: '#F59E0B',
        bgPulse: 'rgba(245, 158, 11, 0.1)'
    },
    STANDARD: {
        id: 'STANDARD',
        label: 'Standard',
        minSpendUGX: 0,
        slaTargetMinutes: 120, // 2 Hours
        perks: [],
        color: 'var(--text-muted)',
        bgPulse: 'transparent'
    }
};

// ========================================================================
// 2. SUPPORT TICKET CATEGORIES & URGENCY
// ========================================================================
// Categorizes incoming chats/tickets and dictates the severity of the UI alerts.
export const TICKET_CATEGORIES = {
    EMERGENCY_SAFETY: {
        id: 'EMERGENCY_SAFETY',
        label: 'Safety Emergency',
        shortLabel: 'SAFETY', // For mobile views
        priority: 'CRITICAL',
        slaTargetMinutes: 1, // 1 Minute response. Flashes red on all screens.
        requiresL9: true,
        color: 'var(--status-danger)'
    },
    ACTIVE_TRANSIT: {
        id: 'ACTIVE_TRANSIT',
        label: 'Active Transit Issue',
        shortLabel: 'ON-BUS',
        priority: 'HIGH',
        slaTargetMinutes: 5, // The passenger is currently moving on a bus.
        requiresL9: false,
        color: 'var(--status-warning)'
    },
    FINANCIAL_DISPUTE: {
        id: 'FINANCIAL_DISPUTE',
        label: 'Refund / Payment Dispute',
        shortLabel: 'FINANCE',
        priority: 'MEDIUM',
        slaTargetMinutes: 60,
        requiresL9: true, // Requires Treasury access
        color: 'var(--brand-primary)'
    },
    LOST_AND_FOUND: {
        id: 'LOST_AND_FOUND',
        label: 'Lost Item Recovery',
        shortLabel: 'LOST ITEM',
        priority: 'LOW',
        slaTargetMinutes: 120,
        requiresL9: false,
        color: 'var(--text-main)'
    },
    GENERAL_INQUIRY: {
        id: 'GENERAL_INQUIRY',
        label: 'General Inquiry',
        shortLabel: 'INQUIRY',
        priority: 'LOW',
        slaTargetMinutes: 240,
        requiresL9: false,
        color: 'var(--text-muted)'
    }
};

// ========================================================================
// 3. AI SENTIMENT & COMPLIANCE TAGGING
// ========================================================================
// These constants map text patterns to Partner compliance penalties. 
// If a user types "speeding", it instantly links to the Partner's Yield Leakage.
export const SENTIMENT_DICTIONARY = {
    CRITICAL_VIOLATIONS: {
        tags: ['speeding', 'reckless', 'drunk', 'accident', 'unsafe', 'smoke', 'bribe'],
        severityScore: 100,
        action: 'TRIGGER_PARTNER_SUSPENSION_REVIEW',
        color: 'var(--status-danger)'
    },
    OPERATIONAL_FAILURES: {
        tags: ['breakdown', 'late', 'delayed', 'no show', 'left without me', 'wrong bus'],
        severityScore: 50,
        action: 'LOG_YIELD_LEAKAGE',
        color: 'var(--status-warning)'
    },
    COMFORT_ISSUES: {
        tags: ['hot', 'ac broken', 'dirty', 'rude', 'loud', 'smell', 'cramped'],
        severityScore: 20,
        action: 'DECREASE_PARTNER_HEALTH_SCORE',
        color: 'var(--brand-accent)'
    },
    PRAISE: {
        tags: ['smooth', 'clean', 'on time', 'professional', 'comfortable', 'safe', 'fast'],
        severityScore: -20, // Negative severity = Bonus points
        action: 'INCREASE_PARTNER_HEALTH_SCORE',
        color: 'var(--status-success)'
    }
};

// ========================================================================
// 4. TREASURY RESOLUTION LIMITS (1-Click Refunds)
// ========================================================================
// Defines how much an agent can instantly refund inside the chat UI 
// without requiring maker-checker approval.
export const AGENT_REFUND_LIMITS = {
    L7_SUPPORT: {
        maxRefundUGX: 20000, // Can refund minor inconveniences (e.g. broken AC credit)
        allowedMethods: ['WALLET_CREDIT']
    },
    L8_SUPERVISOR: {
        maxRefundUGX: 100000, // Can refund full standard tickets
        allowedMethods: ['WALLET_CREDIT', 'MOMO_REVERSAL']
    },
    L9_ADMIN: {
        maxRefundUGX: 5000000, // Unlimited Sovereign Authority
        allowedMethods: ['WALLET_CREDIT', 'MOMO_REVERSAL', 'BANK_WIRE']
    }
};

// ========================================================================
// 5. PRE-EMPTIVE BLAST TEMPLATES (The God-Move)
// ========================================================================
// Mass communication templates sent to entire manifests when anomalies occur.
export const BLAST_TEMPLATES = [
    {
        id: 'DELAY_APOLOGY_CREDIT',
        title: 'Delay + 10% Wallet Credit',
        trigger: 'Bus delayed > 60 mins',
        message: "AyaBus Update: We apologize for the delay on your current route. As a courtesy, a 10% credit has been instantly applied to your AyaBus Digital Wallet. Thank you for your patience.",
        type: 'WALLET_CREDIT'
    },
    {
        id: 'ASSET_SWAP_NOTICE',
        title: 'Breakdown / Asset Swap',
        trigger: 'Bus flagged as GARAGE in transit',
        message: "AyaBus Alert: Your current bus has reported a mechanical issue. A replacement Sovereign-Class bus has been dispatched and will arrive shortly to complete your journey. We apologize for the inconvenience.",
        type: 'INFO'
    },
    {
        id: 'WEATHER_WARNING',
        title: 'Severe Weather Routing',
        trigger: 'Admin manual trigger',
        message: "AyaBus Safety Notice: Due to heavy rains on your route, our dispatchers have authorized a speed reduction for your safety. Your arrival time may be slightly delayed.",
        type: 'WARNING'
    }
];