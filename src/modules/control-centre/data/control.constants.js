/**
 * 👑 AYA BUS MASTER OS BLUEPRINT (Level 1: Zero-Trust Configuration Dictionary)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: control.constants.js
 * * DESCRIPTION:
 * The absolute source of truth for global ecosystem parameters. Defines the 
 * shape of the Master JSON document, strict validation limits, immutable units, 
 * and cognitive UI routing for the 8 Sovereign Sectors.
 * * UPGRADES (Zero-Trust Edition):
 * - Deep Immutability: Object.freeze() recursively applied to prevent runtime mutations.
 * - Risk Vectors: Every parameter declares `riskLevel` and `blastRadius` for UI safety locks.
 * - Search Ontology: Injected `tags` array for instantaneous Command-K global search routing.
 */

// ========================================================================
// 0. ZERO-TRUST UTILITIES
// ========================================================================
/**
 * Recursively freezes an object to ensure cryptographic immutability in the JS runtime.
 * Prevents rogue UI components from accidentally modifying the OS laws.
 */
const deepFreeze = (obj) => {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && obj[prop] !== null && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    });
    return Object.freeze(obj);
};

// ========================================================================
// 1. IMMUTABLE SYSTEM DICTIONARIES
// ========================================================================
export const CONTROL_UNITS = deepFreeze({
    CURRENCY: 'UGX',
    PERCENTAGE: '%',
    METERS: 'Meters',
    KILOMETERS: 'KM',
    SECONDS: 'Secs',
    MINUTES: 'Mins',
    HOURS: 'Hours',
    DAYS: 'Days',
    SCANS: 'Scans',
    ATTEMPTS: 'Attempts',
    VERSION: 'SemVer',
    TOGGLE: 'State',
    TEXT: 'String',
    REQ_PER_MIN: 'Req/Min'
});

export const INPUT_TYPES = deepFreeze({
    STEPPER: 'STEPPER',       // High-precision numeric boundary input
    TOGGLE: 'TOGGLE',         // Boolean Kill Switch
    TEXT: 'TEXT',             // Plain string input
    SELECT: 'SELECT',         // Dropdown choice
    TEXTAREA: 'TEXTAREA'      // Multi-line policy/disclaimer input
});

export const RISK_LEVELS = deepFreeze({
    LOW: 'LOW',               // Cosmetic or non-disruptive changes
    MEDIUM: 'MEDIUM',         // Operational SLA shifts (e.g., geofences, timeouts)
    HIGH: 'HIGH',             // Treasury changes, payout logic, partner governance
    CRITICAL: 'CRITICAL'      // Ecosystem kill switches, security locks, mass outages
});

// ========================================================================
// 2. THE 8 SOVEREIGN SECTORS (Navigation & Metadata)
// ========================================================================
export const CONTROL_SECTORS = deepFreeze({
    CONSUMER: { id: 'CONSUMER', label: 'Consumer App & Web', icon: 'Smartphone', desc: 'Public storefront logistics and app-wide kill switches.' },
    TICKET_CONFIG: { id: 'TICKET_CONFIG', label: 'Ticket & Boarding Pass', icon: 'FileText', desc: 'Dynamic control over passenger ticket fields and policies.' },
    TREASURY: { id: 'TREASURY', label: 'Treasury & Physics', icon: 'Banknote', desc: 'Platform fees, penalties, and L9 approval limits.' },
    OPERATIONS: { id: 'OPERATIONS', label: 'Operational SLAs & Hardware', icon: 'Activity', desc: 'Boarding lockouts, scanner geofences, and fleet thresholds.' },
    PARTNERS: { id: 'PARTNERS', label: 'Partner Governance', icon: 'Briefcase', desc: 'Revenue splits, settlement windows, and strike rules.' },
    TELEMETRY: { id: 'TELEMETRY', label: 'Comms & Telemetry', icon: 'Zap', desc: 'SMS routing, apology blasts, and GPS ping rates.' },
    DATABASE: { id: 'DATABASE', label: 'Database & NoSQL', icon: 'Server', desc: 'WORM archiving, cache TTLs, and API protection.' },
    SECURITY: { id: 'SECURITY', label: 'Security & Crypto', icon: 'ShieldCheck', desc: 'Admin sessions, 2FA, and brute-force lockouts.' }
});

// ========================================================================
// 3. MASTER NOSQL STATE SCHEMA (The Core Engine)
// ========================================================================
export const MASTER_SCHEMA = deepFreeze({
    
    // --- SECTOR 1: CONSUMER APP & WEB (Storefront Logic) ---
    [CONTROL_SECTORS.CONSUMER.id]: {
        supportPhone: { id: 'supportPhone', label: 'Global Support Line', desc: 'The primary help number displayed in-app.', type: INPUT_TYPES.TEXT, unit: CONTROL_UNITS.TEXT, defaultValue: '+256 800 123 456', riskLevel: RISK_LEVELS.LOW, tags: ['contact', 'help', 'phone', 'support'] },
        whatsappLine: { id: 'whatsappLine', label: 'WhatsApp Concierge', desc: 'Official WhatsApp Business API number.', type: INPUT_TYPES.TEXT, unit: CONTROL_UNITS.TEXT, defaultValue: '+256 700 123 456', riskLevel: RISK_LEVELS.LOW, tags: ['contact', 'chat', 'whatsapp'] },
        minAppVersion: { id: 'minAppVersion', label: 'Minimum App Version', desc: 'Forces users below this version to update.', type: INPUT_TYPES.TEXT, unit: CONTROL_UNITS.VERSION, defaultValue: 'v2.4.1', riskLevel: RISK_LEVELS.MEDIUM, blastRadius: 'Instantly locks out users on older app builds, forcing an App Store update.', tags: ['version', 'update', 'ios', 'android'] },
        maintenanceMode: { id: 'maintenanceMode', label: 'Global Maintenance Lock', desc: 'Halts all consumer ticketing immediately.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: false, riskLevel: RISK_LEVELS.CRITICAL, blastRadius: 'Kicks all consumers off the platform and stops all incoming B2C revenue.', tags: ['kill switch', 'offline', 'emergency', 'maintenance'] }
    },

    // --- SECTOR 2: TICKET & BOARDING PASS (Dynamic Ticket Layout) ---
    [CONTROL_SECTORS.TICKET_CONFIG.id]: {
        printPassengerName: { id: 'printPassengerName', label: 'Show Passenger Name', desc: 'Include full name on ticket.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'name', 'privacy'] },
        printSeatNumber: { id: 'printSeatNumber', label: 'Show Seat Allocation', desc: 'Include assigned seat ID.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'seat', 'booking'] },
        printPlateNumber: { id: 'printPlateNumber', label: 'Show Vehicle Plate', desc: 'Include Bus Registration number.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'bus', 'plate'] },
        printOriginDest: { id: 'printOriginDest', label: 'Show Journey Route', desc: 'Display Boarding and Drop-off points.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'route', 'destination'] },
        printTicketId: { id: 'printTicketId', label: 'Show PNR Reference', desc: 'Include Unique Transaction/Ticket ID.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'pnr', 'id'] },
        printQrCode: { id: 'printQrCode', label: 'Enable Validation QR', desc: 'Print the scannable security code.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.MEDIUM, blastRadius: 'Turning this off prevents field agents from scanning digital boarding passes.', tags: ['ticket', 'qr', 'scan', 'barcode'] },
        requireIdOnBoarding: { id: 'requireIdOnBoarding', label: 'Print ID Requirement', desc: 'Embed "Valid ID Required" warning.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'policy', 'id'] },
        luggagePolicyText: { id: 'luggagePolicyText', label: 'Luggage Policy Disclaimer', desc: 'The short-form luggage rules on ticket.', type: INPUT_TYPES.TEXTAREA, unit: CONTROL_UNITS.TEXT, defaultValue: 'Max 15kg per passenger.', riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'policy', 'luggage', 'weight'] },
        cancellationPolicyText: { id: 'cancellationPolicyText', label: 'Refund Policy Disclaimer', desc: 'Printed cancellation terms.', type: INPUT_TYPES.TEXTAREA, unit: CONTROL_UNITS.TEXT, defaultValue: 'Non-refundable after departure.', riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'policy', 'refund', 'cancellation'] },
        supportContactPrint: { id: 'supportContactPrint', label: 'Show Emergency Support', desc: 'Prints the Support Line on the pass.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'contact', 'help'] },
        ticketFooterMessage: { id: 'ticketFooterMessage', label: 'Custom Footer Message', desc: 'Seasonal or brand-wide footer text.', type: INPUT_TYPES.TEXT, unit: CONTROL_UNITS.TEXT, defaultValue: 'Travel safely with AyaBus.', riskLevel: RISK_LEVELS.LOW, tags: ['ticket', 'footer', 'branding', 'message'] }
    },

    // --- SECTOR 3: TREASURY & PHYSICS (Economic Rules) ---
    [CONTROL_SECTORS.TREASURY.id]: {
        basePlatformFee: { id: 'basePlatformFee', label: 'Base Transaction Fee', desc: 'Fixed internal fee per ticket.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.CURRENCY, defaultValue: 500, min: 0, max: 5000, step: 100, riskLevel: RISK_LEVELS.HIGH, blastRadius: 'Directly changes company margin and passenger checkout totals across all routes.', tags: ['treasury', 'fee', 'revenue', 'money'] },
        variablePlatformFee: { id: 'variablePlatformFee', label: 'Variable Transaction Fee', desc: 'Percentage fee per ticket.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.PERCENTAGE, defaultValue: 2.5, min: 0, max: 15, step: 0.1, riskLevel: RISK_LEVELS.HIGH, blastRadius: 'Directly changes company margin mathematics globally.', tags: ['treasury', 'fee', 'percentage', 'margin'] },
        refundPenalty: { id: 'refundPenalty', label: 'Refund Penalty Rate', desc: 'Deduction for user-initiated refunds.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.PERCENTAGE, defaultValue: 20, min: 0, max: 100, step: 5, riskLevel: RISK_LEVELS.HIGH, tags: ['treasury', 'refund', 'penalty', 'cancellation'] },
        l9ApprovalLimit: { id: 'l9ApprovalLimit', label: 'Maker-Checker Threshold', desc: 'Refunds above this need 2nd Admin approval.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.CURRENCY, defaultValue: 50000, min: 10000, max: 1000000, step: 10000, riskLevel: RISK_LEVELS.MEDIUM, tags: ['treasury', 'approval', 'limit', 'maker-checker'] }
    },

    // --- SECTOR 4: OPERATIONAL SLAs & HARDWARE (Field Controls) ---
    [CONTROL_SECTORS.OPERATIONS.id]: {
        boardingLockout: { id: 'boardingLockout', label: 'Sales Lockout Window', desc: 'Stop selling X mins before departure.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.MINUTES, defaultValue: 15, min: 0, max: 120, step: 5, riskLevel: RISK_LEVELS.MEDIUM, tags: ['operations', 'time', 'lockout', 'departure'] },
        ticketExpiry: { id: 'ticketExpiry', label: 'Ticket Expiry Post-Arrival', desc: 'QR code becomes invalid after X hours.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.HOURS, defaultValue: 2, min: 1, max: 48, step: 1, riskLevel: RISK_LEVELS.MEDIUM, tags: ['operations', 'expiry', 'time', 'qr'] },
        terminalRadius: { id: 'terminalRadius', label: 'Terminal Scanner Geofence', desc: 'Max distance for scanner ticket validation.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.METERS, defaultValue: 50, min: 10, max: 500, step: 10, riskLevel: RISK_LEVELS.MEDIUM, blastRadius: 'Setting this too narrow will prevent legitimate agents from scanning tickets near the bus.', tags: ['operations', 'gps', 'radius', 'scanner', 'hardware'] },
        offlineTolerance: { id: 'offlineTolerance', label: 'Offline Scan Tolerance', desc: 'Max offline scans before sync required.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.SCANS, defaultValue: 150, min: 10, max: 1000, step: 10, riskLevel: RISK_LEVELS.MEDIUM, tags: ['operations', 'offline', 'scan', 'hardware'] }
    },

    // --- SECTOR 5: PARTNER GOVERNANCE (Operator Rules) ---
    [CONTROL_SECTORS.PARTNERS.id]: {
        settlementWindow: { id: 'settlementWindow', label: 'Settlement Cycle', desc: 'Auto-payout schedule (T+Days).', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.DAYS, defaultValue: 1, min: 0, max: 30, step: 1, riskLevel: RISK_LEVELS.HIGH, tags: ['partners', 'payout', 'days', 'settlement'] },
        defaultRevShare: { id: 'defaultRevShare', label: 'Global Revenue Split', desc: 'Default percentage paid to partners.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.PERCENTAGE, defaultValue: 88, min: 50, max: 99, step: 1, riskLevel: RISK_LEVELS.HIGH, blastRadius: 'Alters the payout math for every active fleet operator on the network.', tags: ['partners', 'split', 'revenue', 'share'] },
        maxSlaStrikes: { id: 'maxSlaStrikes', label: 'Weekly SLA Tolerance', desc: 'Cancellations allowed before suspension.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.ATTEMPTS, defaultValue: 3, min: 1, max: 10, step: 1, riskLevel: RISK_LEVELS.HIGH, tags: ['partners', 'sla', 'strikes', 'suspension'] }
    },

    // --- SECTOR 6: COMMS & TELEMETRY (Gateway Logic) ---
    [CONTROL_SECTORS.TELEMETRY.id]: {
        smsGateway: { id: 'smsGateway', label: 'Primary SMS Gateway', desc: 'Provider for OTPs and notifications.', type: INPUT_TYPES.SELECT, unit: CONTROL_UNITS.TEXT, defaultValue: 'AFRICAS_TALKING', options: ['AFRICAS_TALKING', 'TWILIO', 'SAFRICOM_API'], riskLevel: RISK_LEVELS.HIGH, tags: ['comms', 'sms', 'gateway', 'provider'] },
        gpsPingRate: { id: 'gpsPingRate', label: 'GPS Transmission Rate', desc: 'How often buses send live location.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.SECONDS, defaultValue: 30, min: 5, max: 300, step: 5, riskLevel: RISK_LEVELS.MEDIUM, tags: ['telemetry', 'gps', 'ping', 'tracking'] },
        autoApologyCredit: { id: 'autoApologyCredit', label: 'Delay Compensation', desc: 'Auto-credit for passengers on broken-down trips.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.CURRENCY, defaultValue: 5000, min: 0, max: 20000, step: 1000, riskLevel: RISK_LEVELS.HIGH, blastRadius: 'Automates wallet payouts; setting this too high drains corporate treasury during fleet failures.', tags: ['comms', 'wallet', 'credit', 'apology', 'delay'] }
    },

    // --- SECTOR 7: DATABASE & ENGINE (NoSQL Health) ---
    [CONTROL_SECTORS.DATABASE.id]: {
        wormArchiving: { id: 'wormArchiving', label: 'Cold Storage Archive', desc: 'Days before logs move to WORM storage.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.DAYS, defaultValue: 90, min: 30, max: 365, step: 10, riskLevel: RISK_LEVELS.MEDIUM, tags: ['database', 'archive', 'worm', 'storage'] },
        cacheTtl: { id: 'cacheTtl', label: 'Edge Cache Refresh', desc: 'How long public route data is cached.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.MINUTES, defaultValue: 5, min: 1, max: 60, step: 1, riskLevel: RISK_LEVELS.MEDIUM, tags: ['database', 'cache', 'speed', 'ttl'] },
        apiRateLimit: { id: 'apiRateLimit', label: 'DDoS Rate Limit', desc: 'Max requests allowed per minute per IP.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.REQ_PER_MIN, defaultValue: 100, min: 10, max: 1000, step: 10, riskLevel: RISK_LEVELS.CRITICAL, blastRadius: 'Setting this too low will block legitimate users from browsing or booking tickets.', tags: ['database', 'ddos', 'security', 'rate'] }
    },

    // --- SECTOR 8: SECURITY & CRYPTO (Gatekeeping) ---
    [CONTROL_SECTORS.SECURITY.id]: {
        adminSessionTimeout: { id: 'adminSessionTimeout', label: 'Admin Session Life', desc: 'Auto-logout idle OS admins.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.MINUTES, defaultValue: 15, min: 5, max: 120, step: 5, riskLevel: RISK_LEVELS.LOW, tags: ['security', 'session', 'timeout', 'logout'] },
        maxFailedLogins: { id: 'maxFailedLogins', label: 'Brute-Force Lockout', desc: 'Attempts allowed before IP freeze.', type: INPUT_TYPES.STEPPER, unit: CONTROL_UNITS.ATTEMPTS, defaultValue: 5, min: 3, max: 20, step: 1, riskLevel: RISK_LEVELS.MEDIUM, tags: ['security', 'lockout', 'brute-force', 'login'] },
        force2FA: { id: 'force2FA', label: 'Mandatory 2FA', desc: 'Require OTPs for all Partner/Admin logins.', type: INPUT_TYPES.TOGGLE, unit: CONTROL_UNITS.TOGGLE, defaultValue: true, riskLevel: RISK_LEVELS.CRITICAL, blastRadius: 'Disabling this exposes the entire Level 9 OS to credential-stuffing attacks.', tags: ['security', '2fa', 'otp', 'auth'] }
    }
});

// ========================================================================
// 4. REACT STATE CLONING ENGINE
// ========================================================================
/**
 * HELPER: Zero-Trust Extractor
 * Because our MASTER_SCHEMA is deeply frozen, React cannot safely bind it to 
 * `useState` without throwing read-only errors. 
 * This function safely extracts ONLY the default values and creates a 100% 
 * mutable JSON clone for the UI to use during draft edits.
 */
export const extractDefaultState = () => {
    return JSON.parse(JSON.stringify(
        Object.keys(MASTER_SCHEMA).reduce((acc, sectorKey) => {
            acc[sectorKey] = Object.keys(MASTER_SCHEMA[sectorKey]).reduce((secAcc, settingId) => {
                secAcc[settingId] = MASTER_SCHEMA[sectorKey][settingId].defaultValue;
                return secAcc;
            }, {});
            return acc;
        }, {})
    ));
};