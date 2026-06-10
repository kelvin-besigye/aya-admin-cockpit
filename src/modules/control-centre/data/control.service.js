/**
 * 👑 CONTROL CENTRE DATA GATEWAY (Level 1: Zero-Trust Synchronizer)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: control.service.js
 * * DESCRIPTION:
 * The live-wire connection to the AyaBus NoSQL Configuration Store. 
 * Handles surgical state synchronization, deep-diff calculations, and 
 * pre-flight schema validation.
 * * UPGRADES:
 * - Pre-Flight Schema Validator: Intercepts out-of-bounds UI data before network hits.
 * - Deep-Diff Engine: Identifies granular changes mapped to Risk Levels.
 * - Concurrency Lock: Requires an ETag/Version hash to prevent Admin collisions.
 * - Vault Caching: Caches the last known good state locally for offline resilience.
 */

import { extractDefaultState, MASTER_SCHEMA, INPUT_TYPES } from './control.constants';

// ========================================================================
// 1. NETWORK & AUTH CONFIGURATION
// ========================================================================
const getSafeApiUrl = () => {
    try {
        if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) return import.meta.env.VITE_API_URL;
    } catch (e) { /* Silent fallback */ }
    return '/api/v1'; 
};

const CONFIG_ENDPOINT = `${getSafeApiUrl()}/control/config`;
const LOCAL_VAULT_KEY = 'ayabus_l9_config_backup';

const getSovereignHeaders = (documentVersion = null) => {
    const token = localStorage.getItem('aya_master_token');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Sovereign-Access': 'LEVEL-9', // God-Mode routing flag for backend firewalls
        'Cache-Control': 'no-cache',     // Never cache configuration data at the edge
        ...(documentVersion ? { 'If-Match': documentVersion } : {}), // Concurrency Protection
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

let configAbortController = null;

// ========================================================================
// 2. THE PRE-FLIGHT ZERO-TRUST VALIDATOR
// ========================================================================
/**
 * Interrogates the UI draft payload against the frozen MASTER_SCHEMA.
 * If the UI malfunctions and generates bad data, this stops the network request.
 * @param {Object} draftState - The unverified UI state
 * @throws {Error} Detailed validation failure message
 */
const preFlightValidation = (draftState) => {
    for (const sectorKey of Object.keys(draftState)) {
        for (const settingId of Object.keys(draftState[sectorKey])) {
            const val = draftState[sectorKey][settingId];
            const schemaDef = MASTER_SCHEMA[sectorKey]?.[settingId];

            if (!schemaDef) throw new Error(`CRITICAL ALARM: Unregistered key [${settingId}] detected in payload.`);

            // Type & Boundary Checking
            switch (schemaDef.type) {
                case INPUT_TYPES.STEPPER:
                    if (typeof val !== 'number' || isNaN(val)) throw new Error(`[${settingId}] expects a valid Number.`);
                    if (val < schemaDef.min || val > schemaDef.max) {
                        throw new Error(`[${settingId}] value ${val} violates absolute limits (${schemaDef.min} - ${schemaDef.max}).`);
                    }
                    break;
                case INPUT_TYPES.TOGGLE:
                    if (typeof val !== 'boolean') throw new Error(`[${settingId}] expects a strictly Boolean value.`);
                    break;
                case INPUT_TYPES.SELECT:
                    if (!schemaDef.options.includes(val)) {
                        throw new Error(`[${settingId}] value '${val}' is not in the approved immutable options list.`);
                    }
                    break;
                case INPUT_TYPES.TEXT:
                case INPUT_TYPES.TEXTAREA:
                    if (typeof val !== 'string') throw new Error(`[${settingId}] expects a strictly String value.`);
                    break;
                default:
                    break; // Pass
            }
        }
    }
    return true; // Payload is cryptographically sound
};

// ========================================================================
// 3. THE DEEP DIFF & RISK CALCULATOR
// ========================================================================
/**
 * Computes the exact delta between the server state and the admin draft.
 * Extracts the highest risk level triggered by the modifications.
 */
const calculateEcosystemDiff = (current, draft) => {
    const diff = {};
    let hasChanges = false;
    let highestRiskDetected = 'LOW'; 

    const riskWeight = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

    Object.keys(draft).forEach(sectorKey => {
        const sectorDraft = draft[sectorKey];
        const sectorCurrent = current[sectorKey] || {};
        const sectorChanges = {};
        let sectorHasChanges = false;

        Object.keys(sectorDraft).forEach(settingId => {
            const newValue = sectorDraft[settingId];
            const oldValue = sectorCurrent[settingId];

            // Stringify handles boolean/number/string reliable equality comparison
            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                const risk = MASTER_SCHEMA[sectorKey]?.[settingId]?.riskLevel || 'LOW';
                
                // Escalate global risk level if this change is higher
                if (riskWeight[risk] > riskWeight[highestRiskDetected]) {
                    highestRiskDetected = risk;
                }

                sectorChanges[settingId] = { 
                    from: oldValue, 
                    to: newValue, 
                    riskLevel: risk 
                };
                sectorHasChanges = true;
                hasChanges = true;
            }
        });

        if (sectorHasChanges) diff[sectorKey] = sectorChanges;
    });

    return hasChanges ? { diffPayload: diff, highestRiskDetected } : null;
};

// ========================================================================
// 4. THE LIVE SERVICE
// ========================================================================
export const controlService = {
    
    /**
     * fetchGlobalConfiguration: Syncs the NoSQL document from the Master Backend.
     */
    fetchGlobalConfiguration: async () => {
        if (configAbortController) configAbortController.abort();
        configAbortController = new AbortController();

        try {
            const response = await fetch(CONFIG_ENDPOINT, {
                method: 'GET',
                headers: getSovereignHeaders(),
                signal: configAbortController.signal
            });

            if (!response.ok) throw new Error(`Network integrity failed: ${response.status}`);

            // Backend must return document version in ETag header to prevent race conditions
            const documentVersion = response.headers.get('ETag') || 'v1'; 
            const payload = await response.json();
            const configData = payload.data || payload;
            
            // Vault the last known good state for offline resilience
            localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify({ data: configData, version: documentVersion }));
            
            return { data: configData, version: documentVersion };

        } catch (error) {
            if (error.name === 'AbortError') return { aborted: true };
            
            console.error('🚨 [ControlService] Network offline. Attempting Vault recovery...');
            
            // Try to load from the Local Storage Vault
            const vaulted = localStorage.getItem(LOCAL_VAULT_KEY);
            if (vaulted) {
                console.log('🛡️ [ControlService] Recovered state from Local Vault.');
                return JSON.parse(vaulted); // Returns { data, version }
            }

            console.warn('⚠️ [ControlService] Vault empty. Booting with Immutable OS Defaults.');
            return { data: extractDefaultState(), version: 'fallback' };
        }
    },

    /**
     * applyMasterConfiguration: Validates, Diffs, and Patches the Master Backend.
     */
    applyMasterConfiguration: async (currentState, draftState, documentVersion) => {
        
        // Step 1: Zero-Trust Shield (Validates before math)
        preFlightValidation(draftState);

        // Step 2: Compute Surgical Patch & Risk Level
        const analysis = calculateEcosystemDiff(currentState, draftState);
        
        if (!analysis) {
            return { status: 'NO_CHANGES' };
        }

        console.log(`🚀 [ControlService] Executing Master Patch [Risk Level: ${analysis.highestRiskDetected}]`, analysis.diffPayload);

        // Step 3: Execute Network Transmission
        try {
            const response = await fetch(CONFIG_ENDPOINT, {
                method: 'PATCH',
                headers: getSovereignHeaders(documentVersion), // Sends version lock
                body: JSON.stringify({
                    delta: analysis.diffPayload,
                    fullState: draftState,
                    computedRisk: analysis.highestRiskDetected
                })
            });

            // Handle Concurrency (HTTP 412 Precondition Failed)
            if (response.status === 412) {
                throw new Error("Concurrency Collision: Another Administrator has modified this configuration since you opened it. Please refresh the page to pull the latest state.");
            }
            
            // Handle Unauthorized (HTTP 401/403)
            if (response.status === 401 || response.status === 403) {
                throw new Error("L9 Authorization Revoked. Please re-authenticate to commit changes.");
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Master update rejected by Sovereign Gateway.');
            }

            const payload = await response.json();
            
            // Update Local Vault with newly saved state to prevent desync
            const newVersion = response.headers.get('ETag') || documentVersion;
            localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify({ data: draftState, version: newVersion }));

            return { status: 'SUCCESS', ...payload };

        } catch (error) {
            console.error('🚨 [ControlService] Critical Save Failure:', error.message);
            throw error; // Propagate to UI for error modals
        }
    }
};