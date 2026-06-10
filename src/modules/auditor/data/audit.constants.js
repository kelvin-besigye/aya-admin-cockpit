/**
 * 👑 AUDITOR TAXONOMY & CONSTANTS (Level 1: Data Engine - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Auditor
 * File: audit.constants.js
 * * DESCRIPTION:
 * The immutable dictionary for the global audit ledger. Defines the 
 * visual and hierarchical rules for Actors, Severities, and every System Domain.
 * * UPGRADES:
 * - Omniscient Ecosystem Mapping: Now covers all 14 physical and digital modules.
 * - Granular Action Verbs: Over 50 specific forensic events categorized by domain.
 * - Future-Proofed: Includes the upcoming Control Centre and Reconciliation engines.
 */

// ========================================================================
// 1. THE ACTORS (Who triggered the event?)
// ========================================================================
export const AUDIT_ACTORS = {
    ADMIN: {
        id: 'ADMIN',
        label: 'System Admin (L9)',
        shortLabel: 'Admin',
        color: 'var(--brand-accent)',
        bgPulse: 'color-mix(in srgb, var(--brand-accent) 10%, transparent)',
        icon: 'ShieldCheck', // Maps to Lucide ShieldCheck
        clearanceLevel: 9,
        description: 'Global system administrators with master override and treasury access.'
    },
    PARTNER: {
        id: 'PARTNER',
        label: 'Fleet Partner',
        shortLabel: 'Partner',
        color: 'var(--status-warning)',
        bgPulse: 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
        icon: 'Briefcase',
        clearanceLevel: 5,
        description: 'B2B Bus Operators managing their specific fleet and route pricing.'
    },
    PASSENGER: {
        id: 'PASSENGER',
        label: 'AyaBus Passenger',
        shortLabel: 'Client',
        color: 'var(--brand-primary)',
        bgPulse: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
        icon: 'User',
        clearanceLevel: 1,
        description: 'B2C end-users interacting via the mobile app or consumer web portal.'
    },
    FIELD_AGENT: {
        id: 'FIELD_AGENT',
        label: 'Terminal Scanner',
        shortLabel: 'Field Agent',
        color: 'var(--status-success)',
        bgPulse: 'color-mix(in srgb, var(--status-success) 10%, transparent)',
        icon: 'ScanLine',
        clearanceLevel: 3,
        description: 'On-ground personnel scanning QR tickets and updating boarding manifests.'
    },
    SYSTEM: {
        id: 'SYSTEM',
        label: 'Autonomous Core',
        shortLabel: 'System',
        color: 'var(--text-muted)',
        bgPulse: 'var(--bg-input)',
        icon: 'Cpu',
        clearanceLevel: 99, // Untouchable logic
        description: 'Automated AI processes, CRON jobs, and SLA breach triggers.'
    }
};

// ========================================================================
// 2. THE SEVERITY MATRIX (How dangerous/critical is the event?)
// ========================================================================
export const AUDIT_SEVERITY = {
    INFO: {
        id: 'INFO',
        label: 'Standard Action',
        color: 'var(--text-main)',
        bg: 'var(--bg-input)',
        icon: 'Info',
        requiresAudit: false
    },
    SUCCESS: {
        id: 'SUCCESS',
        label: 'System Success',
        color: 'var(--status-success)',
        bg: 'color-mix(in srgb, var(--status-success) 10%, transparent)',
        icon: 'CheckCircle2',
        requiresAudit: false
    },
    WARNING: {
        id: 'WARNING',
        label: 'Elevated Action',
        color: 'var(--status-warning)',
        bg: 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
        icon: 'AlertTriangle',
        requiresAudit: true // e.g., A partner changing a route price by more than 20%
    },
    CRITICAL: {
        id: 'CRITICAL',
        label: 'Critical Override',
        color: 'var(--status-danger)',
        bg: 'color-mix(in srgb, var(--status-danger) 10%, transparent)',
        icon: 'AlertOctagon',
        requiresAudit: true // e.g., L9 Admin refunding 500,000 UGX or shutting down a route
    },
    FATAL: {
        id: 'FATAL',
        label: 'System Failure',
        color: '#EF4444', // Hardcoded fallback for catastrophic UI failures
        bg: 'rgba(239, 68, 68, 0.15)',
        icon: 'Zap',
        requiresAudit: true // API failures, payment gateway timeouts, DB sync drops
    }
};

// ========================================================================
// 3. THE ECOSYSTEM DOMAINS (Where did the event happen?)
// ========================================================================
export const AUDIT_DOMAINS = {
    // Master Controls
    CONTROL_CENTRE: { id: 'CONTROL_CENTRE', label: 'Global Command', icon: 'Settings' },
    ANALYTICS: { id: 'ANALYTICS', label: 'Intelligence Centre', icon: 'Activity' },
    
    // Core Modules
    CLIENTS: { id: 'CLIENTS', label: 'Client CRM', icon: 'Users' },
    PARTNER: { id: 'PARTNER', label: 'Partner Hub', icon: 'Briefcase' },
    FLEET: { id: 'FLEET', label: 'Fleet Registry', icon: 'Truck' },
    BUS_CONFIG: { id: 'BUS_CONFIG', label: 'Bus Configuration', icon: 'Bus' },
    ROUTES: { id: 'ROUTES', label: 'Route Logistics', icon: 'Map' },
    SCHEDULER: { id: 'SCHEDULER', label: 'Dispatch Scheduler', icon: 'CalendarClock' },
    
    // Financial & Security
    TREASURY: { id: 'TREASURY', label: 'Treasury & Liquidity', icon: 'Banknote' },
    RECONCILIATION: { id: 'RECONCILIATION', label: 'Reconciliation', icon: 'Scale' },
    APPROVALS: { id: 'APPROVALS', label: 'Maker-Checker', icon: 'CheckCircle2' },
    AUTH: { id: 'AUTH', label: 'Security & Auth', icon: 'ShieldCheck' },
    
    // Edge / Field Systems
    CLIENT_APP: { id: 'CLIENT_APP', label: 'Consumer App', icon: 'Smartphone' },
    TERMINAL: { id: 'TERMINAL', label: 'Physical Scanner', icon: 'MapPin' }
};

// ========================================================================
// 4. THE ACTION DICTIONARY (Standardized Forensic Event Naming)
// ========================================================================
export const AUDIT_ACTIONS = {
    // Auth & Security
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    PASSWORD_RESET: 'PASSWORD_RESET',
    L9_OVERRIDE_USED: 'L9_OVERRIDE_USED',

    // Treasury & Reconciliation
    FUNDS_DEPOSITED: 'FUNDS_DEPOSITED',
    REFUND_ISSUED: 'REFUND_ISSUED',
    PENALTY_APPLIED: 'PENALTY_APPLIED',
    LEDGER_SETTLED: 'LEDGER_SETTLED',
    CLAWBACK_INITIATED: 'CLAWBACK_INITIATED',

    // Fleet & Configuration
    BUS_ASSET_ADDED: 'BUS_ASSET_ADDED',
    BUS_CONFIG_UPDATED: 'BUS_CONFIG_UPDATED',
    MAINTENANCE_LOGGED: 'MAINTENANCE_LOGGED',
    PARTNER_ONBOARDED: 'PARTNER_ONBOARDED',

    // Routes & Logistics
    ROUTE_CREATED: 'ROUTE_CREATED',
    PRICE_CHANGED: 'PRICE_CHANGED',
    STOP_ADDED: 'STOP_ADDED',

    // Scheduler & Operations
    TRIP_SCHEDULED: 'TRIP_SCHEDULED',
    BUS_DISPATCHED: 'BUS_DISPATCHED',
    BUS_DELAYED: 'BUS_DELAYED',
    MANIFEST_LOCKED: 'MANIFEST_LOCKED',
    TICKET_SCANNED: 'TICKET_SCANNED',

    // Client CRM & Outreach
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    TICKET_RESOLVED: 'TICKET_RESOLVED',
    MASS_BLAST_SENT: 'MASS_BLAST_SENT',
    COURTESY_CREDIT_ISSUED: 'COURTESY_CREDIT_ISSUED',

    // Approvals (Maker-Checker)
    REQUEST_SUBMITTED: 'REQUEST_SUBMITTED',
    REQUEST_APPROVED: 'REQUEST_APPROVED',
    REQUEST_REJECTED: 'REQUEST_REJECTED',

    // Control Centre (God Mode)
    GLOBAL_FEE_CHANGED: 'GLOBAL_FEE_CHANGED',
    SYSTEM_HALTED: 'SYSTEM_HALTED',
    MODULE_TOGGLED: 'MODULE_TOGGLED'
};