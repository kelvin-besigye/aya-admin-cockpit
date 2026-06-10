import { 
    PASSENGER_LTV_TIERS, 
    TICKET_CATEGORIES, 
    SENTIMENT_DICTIONARY 
} from './clients.constants';

/**
 * 👑 AYABUS CLIENT CENTRE (Level 1: The Brains - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: clients.utils.js
 * * DESCRIPTION:
 * The mathematical and logical engine for Passenger CRM.
 * Handles VIP routing logic, SLA countdowns, and NLP text extraction.
 */

// ========================================================================
// 1. DATA SANITIZATION GATES
// Protects the OS from corrupted database payloads.
// ========================================================================
const sanitizeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
};

const sanitizeString = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.trim();
};

// ========================================================================
// 2. LIFETIME VALUE (LTV) & VIP ROUTING ENGINE
// ========================================================================

/**
 * Evaluates a passenger's lifetime spend to determine their Sovereign Tier.
 * @param {number} lifetimeSpendUGX - Total historical ticket spend.
 * @returns {Object} The complete LTV Tier configuration object.
 */
export const calculatePassengerLTV = (lifetimeSpendUGX = 0) => {
    const spend = sanitizeNumber(lifetimeSpendUGX, 0);

    if (spend >= PASSENGER_LTV_TIERS.SOVEREIGN.minSpendUGX) return PASSENGER_LTV_TIERS.SOVEREIGN;
    if (spend >= PASSENGER_LTV_TIERS.PLATINUM.minSpendUGX) return PASSENGER_LTV_TIERS.PLATINUM;
    if (spend >= PASSENGER_LTV_TIERS.GOLD.minSpendUGX) return PASSENGER_LTV_TIERS.GOLD;
    
    return PASSENGER_LTV_TIERS.STANDARD;
};

/**
 * The Escalation Matrix: Merges Ticket Category urgency with Passenger VIP status.
 * Ensures high-net-worth individuals never wait in standard queues.
 * @param {string} categoryId - The TICKET_CATEGORIES key.
 * @param {Object} ltvTier - The resolved PASSENGER_LTV_TIERS object.
 * @returns {Object} Augmented ticket priority data for the OmniInbox.
 */
export const resolveTicketUrgency = (categoryId, ltvTier) => {
    const baseCategory = TICKET_CATEGORIES[categoryId] || TICKET_CATEGORIES.GENERAL_INQUIRY;
    let targetSLA = baseCategory.slaTargetMinutes;
    let finalPriority = baseCategory.priority;
    let isEscalated = false;

    // VIP Override Matrix: Sovereign/Platinum users automatically shrink the SLA timer
    if (ltvTier.id === 'SOVEREIGN') {
        targetSLA = Math.min(targetSLA, PASSENGER_LTV_TIERS.SOVEREIGN.slaTargetMinutes);
        if (finalPriority !== 'CRITICAL') {
            finalPriority = 'HIGH';
            isEscalated = true;
        }
    } else if (ltvTier.id === 'PLATINUM') {
        targetSLA = Math.min(targetSLA, PASSENGER_LTV_TIERS.PLATINUM.slaTargetMinutes);
    }

    return {
        ...baseCategory,
        activeSlaMinutes: targetSLA,
        effectivePriority: finalPriority,
        isVipEscalated: isEscalated
    };
};

// ========================================================================
// 3. INTELLIGENT SLA CHRONOLOGY
// ========================================================================

/**
 * Calculates the exact time remaining before a support ticket breaches its SLA.
 * Outputs UI-ready color codes to drive the Helpdesk flashing alerts.
 * @param {string} createdAtStr - ISO Date string of ticket creation.
 * @param {number} targetMinutes - The SLA limit in minutes.
 * @returns {Object} Human-readable countdown and UI safety colors.
 */
export const calculateSLARemaining = (createdAtStr, targetMinutes) => {
    if (!createdAtStr) return { status: 'UNKNOWN', text: '--:--', color: 'var(--text-muted)' };

    try {
        const createdAt = new Date(createdAtStr);
        if (isNaN(createdAt.getTime())) throw new Error("Invalid Date");

        const now = new Date();
        const elapsedMs = now.getTime() - createdAt.getTime();
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const remainingMinutes = targetMinutes - elapsedMinutes;

        // Mathematical formatting (e.g., "1h 15m" or "-15m")
        const absMins = Math.abs(remainingMinutes);
        const hours = Math.floor(absMins / 60);
        const mins = absMins % 60;
        const timeText = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

        // State Machine for the OmniInbox UI
        if (remainingMinutes < 0) {
            return { status: 'BREACHED', text: `-${timeText}`, color: 'var(--status-danger)', isBlinking: true };
        }
        if (remainingMinutes <= 5) { // 5 minutes left is critical
            return { status: 'CRITICAL', text: timeText, color: 'var(--brand-accent)', isBlinking: true };
        }
        if (remainingMinutes <= targetMinutes * 0.25) { // 25% time remaining
            return { status: 'WARNING', text: timeText, color: 'var(--status-warning)', isBlinking: false };
        }

        return { status: 'HEALTHY', text: timeText, color: 'var(--text-main)', isBlinking: false };

    } catch (error) {
        console.error("SLA Engine Failure:", error);
        return { status: 'ERROR', text: 'ERR', color: 'var(--status-danger)' };
    }
};

// ========================================================================
// 4. NLP-LITE SENTIMENT EXTRACTION
// ========================================================================

/**
 * Parses raw passenger chat text against the Sovereign Sentiment Dictionary.
 * Instantly identifies safety risks and operational failures.
 * @param {string} rawText - The passenger's message.
 * @returns {Object} The matched severity, AI tags, and system action.
 */
export const analyzeMessageSentiment = (rawText) => {
    const text = sanitizeString(rawText).toLowerCase();
    if (!text) return { isFlagged: false, tags: [], maxSeverity: 0, action: null };

    let highestSeverity = -100;
    let primaryAction = null;
    let primaryColor = 'var(--bg-input)';
    const extractedTags = [];

    // Scan the dictionary for keywords
    Object.keys(SENTIMENT_DICTIONARY).forEach(categoryKey => {
        const category = SENTIMENT_DICTIONARY[categoryKey];
        
        category.tags.forEach(tag => {
            if (text.includes(tag)) {
                // Formatting tag for UI (e.g., "ac broken" -> "AC Broken")
                const formattedTag = tag.replace(/\b\w/g, l => l.toUpperCase());
                if (!extractedTags.includes(formattedTag)) {
                    extractedTags.push(formattedTag);
                }

                if (category.severityScore > highestSeverity) {
                    highestSeverity = category.severityScore;
                    primaryAction = category.action;
                    primaryColor = category.color;
                }
            }
        });
    });

    return {
        isFlagged: extractedTags.length > 0,
        tags: extractedTags,
        maxSeverity: highestSeverity,
        systemAction: primaryAction,
        uiColor: primaryColor
    };
};

// ========================================================================
// 5. FORENSIC IDENTIFIER FORMATTERS
// ========================================================================

/**
 * Standardizes Passenger IDs for strict UI rendering.
 */
export const formatPassengerId = (id) => {
    if (!id) return 'PAX-000000';
    const cleanId = String(id).replace(/[^0-9a-zA-Z]/g, '');
    return `PAX-${cleanId.padStart(6, '0').toUpperCase()}`;
};

/**
 * Masks phone numbers for PII (Personally Identifiable Information) compliance.
 * Converts +256772123456 to +256 772 *** 456
 */
export const maskPhoneNumber = (phone) => {
    const cleanPhone = sanitizeString(phone);
    if (cleanPhone.length < 10) return cleanPhone; // Too short to mask safely
    
    const prefix = cleanPhone.substring(0, cleanPhone.length - 6);
    const suffix = cleanPhone.substring(cleanPhone.length - 3);
    return `${prefix} *** ${suffix}`;
};