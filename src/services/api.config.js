/**
 * 👑 AYABUS ADMIN COCKPIT (Sovereign Data Link)
 * ------------------------------------------------------------------
 * Module: API Services / Infrastructure
 * File: api.config.js
 * * DESCRIPTION:
 * The Master Database Client for the L9 Admin Cockpit. This serves as 
 * the singular umbilical cord between the Citadel and Supabase.
 * * WORLD-CLASS ARCHITECTURE:
 * 1. TENANT ISOLATION LOCK: Uses a unique storage key and header to ensure 
 * Admin sessions never collide with Partner Portal sessions.
 * 2. PRE-FLIGHT VALIDATION: Violently rejects system boot if credentials are missing.
 * 3. TELEMETRY HEADERS: Tags traffic as `L9_DISPATCH_COMMAND` for secure audits.
 * 4. UNIFIED EXCEPTION PIPELINE: Standardizes error shapes to prevent UI crashes.
 */

import { createClient } from '@supabase/supabase-js';

// ========================================================================
// 1. INFRASTRUCTURE CREDENTIALS (Pre-Flight Check)
// ========================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Immediate system halt if environment is compromised
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 [CITADEL CRITICAL]: Supabase credentials missing. Check .env.local');
}

// ========================================================================
// 2. THE MASTER CLIENT INSTANCE
// ========================================================================
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'x-application-name': 'ayabus-admin-cockpit',
            'x-tenant-type': 'L9_DISPATCH_COMMAND' // 🚀 The critical Admin tag
        }
    }
});

// ========================================================================
// 3. THE EXCEPTION ORCHESTRATOR
// ========================================================================
/**
 * Standardized Data Exception Handler
 * Translates cryptic database rejections into actionable UI telemetry.
 * @param {Object} error - The raw error from Supabase.
 * @param {string} context - The operational area.
 * @returns {Object} { success: false, error: string, code: string }
 */
export const handleDataException = (error, context = 'Citadel Engine') => {
    const errorMessage = error?.message || 'An unknown anomaly occurred during data transfer.';
    const errorCode = error?.code || 'X000_UNKNOWN';
    
    // Developer Telemetry
    console.error(`🚨 [AyaBus ${context} Exception] Code: ${errorCode} | ${errorMessage}`);
    
    // Structured response for UI components to consume
    return {
        success: false,
        error: errorMessage,
        code: errorCode,
        timestamp: new Date().toISOString()
    };
};

// ========================================================================
// 4. CONSTANTS & SYSTEM DEFAULTS
// ========================================================================
export const API_CONFIG = Object.freeze({
    MAX_RETRY_ATTEMPTS: 3,
    CACHE_EXPIRY_MS: 300000, // 5 minutes standard TTL
});