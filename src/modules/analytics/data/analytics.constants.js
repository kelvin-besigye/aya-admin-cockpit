/**
 * 👑 AYABUS ANALYTICS DICTIONARY (v3.0 Sovereign)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: analytics.constants.js
 * * DESCRIPTION:
 * The immutable configuration file for the Operational Telemetry Engine.
 * Defines Time Windows, SLA Thresholds, and UI Color Mappings.
 */

// ============================================================================
// 1. THE TIME ENGINE (Temporal Relativity Windows)
// ============================================================================
export const TIME_WINDOWS = Object.freeze({
    TODAY: 'TODAY',             // From 00:00:00 today to now
    SEVEN_DAYS: '7D',           // Rolling 7 days backwards
    THIS_MONTH: 'MTD',          // Month-to-Date (1st of current month to now)
    THIS_QUARTER: 'QTD',        // Quarter-to-Date
    THIS_YEAR: 'YTD'            // Year-to-Date
});

// ============================================================================
// 2. THE MAKER-CHECKER SLA (Service Level Agreement)
// Defines the operational physics of how fast Admins must work.
// ============================================================================
export const SLA_THRESHOLDS = Object.freeze({
    TARGET_MINUTES: 15,         // The gold standard: Approvals cleared in 15 mins
    WARNING_MINUTES: 45,        // Bottleneck forming: UI turns Yellow
    CRITICAL_MINUTES: 120       // System blocked: UI turns Red, alerts triggered
});

// ============================================================================
// 3. TELEMETRY METRIC DEFINITIONS (For the Zone 1 HUD)
// ============================================================================
export const TELEMETRY_METRICS = Object.freeze({
    CAPTURE_RATE: 'PLATFORM_CAPTURE_RATE',
    SOULS_IN_TRANSIT: 'ACTIVE_SOULS',
    NO_SHOW_INDEX: 'NO_SHOW_RATE',
    PROCESSING_VELOCITY: 'TICKET_VELOCITY_PH', // Per Hour
    APPROVAL_SLA: 'AVG_APPROVAL_TIME'
});

// ============================================================================
// 4. THE APEX MATRIX CONFIGURATION (For Zone 2 Sorting)
// ============================================================================
export const LEADERBOARD_TYPES = Object.freeze({
    OPERATOR_CAPTURE: 'OPERATOR_CAPTURE_RATE',
    ROUTE_CONGESTION: 'ROUTE_CONGESTION_VOL',
    TERMINAL_SCANS: 'GATEKEEPER_SUPREMACY'
});

// ============================================================================
// 5. SEMANTIC CHART PHYSICS (Light/Dark Mode Aware)
// We map data states directly to your global CSS variables so charts 
// perfectly match the rest of the application without hardcoded hex codes.
// ============================================================================
export const CHART_COLORS = Object.freeze({
    // Standard Trends
    TREND_UP: 'var(--status-success)',     // Green
    TREND_DOWN: 'var(--status-danger)',    // Red
    TREND_FLAT: 'var(--text-muted)',       // Grey
    
    // Capacities & Densities
    CAPACITY_FULL: 'var(--brand-primary)', // Brand Blue
    CAPACITY_EMPTY: 'var(--bg-input)',     // Deep background
    
    // Status Breakdowns (Donut Charts)
    PIE_ISSUED: 'var(--brand-primary)',    // Unscanned, valid tickets
    PIE_BOARDED: 'var(--status-success)',  // Scanned, on the bus
    PIE_CANCELLED: 'var(--status-danger)', // Requested refund
    PIE_NO_SHOW: 'var(--status-warning)'   // Expired, unscanned
});

// ============================================================================
// 6. SEAT HEATMAP GRAVITY (For Zone 5)
// Values used to scale the color intensity of the chassis layout
// ============================================================================
export const GRAVITY_THRESHOLDS = Object.freeze({
    MAX_HEAT: 0.8, // If a seat is booked > 80% of the time, it glows red/hot
    MID_HEAT: 0.4, // Between 40-80% it glows yellow/warm
    LOW_HEAT: 0.1  // Below 10% it remains cold/blue
});