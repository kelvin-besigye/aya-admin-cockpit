/**
 * 👑 AUDITOR DATA GATEWAY (Level 1: The Data Engine - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Auditor
 * File: audit.service.js
 * * DESCRIPTION:
 * The apex production data service. Connects the React OS directly to the 
 * backend immutable ledger (e.g., Elasticsearch / PostgreSQL).
 * * UPGRADES:
 * - 100% Live Wires: Zero simulators. Executes real HTTP requests to the backend.
 * - Dynamic Serialization: Converts complex UI filter objects into safe URL query strings.
 * - Network Resilience: Built-in AbortControllers to prevent race conditions during rapid searching.
 * - RBAC Ready: Automatically injects the Level 9 Authorization Bearer tokens.
 * - Bundler Agnostic: Safely handles environment variables without crashing Vite/Webpack.
 */

// ========================================================================
// 1. CORE NETWORK CONFIGURATION
// ========================================================================
// Safely extract environment variables without crashing modern bundlers (like Vite)
const getSafeApiUrl = () => {
    try {
        // Try Create React App standard
        if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
            return process.env.REACT_APP_API_URL;
        }
        // Try Vite standard
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
            return import.meta.env.VITE_API_URL;
        }
    } catch (e) {
        // Fail silently and use fallback
    }
    return '/api/v1'; // Master Fallback
};

const API_BASE_URL = getSafeApiUrl();
const AUDIT_ENDPOINT = `${API_BASE_URL}/audit`;

/**
 * Standardized Auth Injector
 * Safely pulls the JWT token from storage and constructs the headers.
 */
const getSovereignHeaders = () => {
    const token = localStorage.getItem('aya_master_token'); // Adjust key to match your auth system
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

/**
 * Custom Error Class for Forensic Tracking
 */
class AuditNetworkError extends Error {
    constructor(message, status, endpoint) {
        super(message);
        this.name = 'AuditNetworkError';
        this.status = status;
        this.endpoint = endpoint;
    }
}

// Global Abort Controller for the main search stream to prevent race conditions
let streamAbortController = null;

// ========================================================================
// 2. THE LIVE SERVICE ENGINE
// ========================================================================

export const auditService = {

    /**
     * fetchForensicLedger: The Master Search Engine
     * Fetches paginated logs from the backend based on complex L9 filters.
     * * @param {Object} filters - The search/filter criteria from the UI
     * @returns {Promise<Object>} { data: [...logs], pagination: { total, page, limit, totalPages } }
     */
    fetchForensicLedger: async (filters = {}) => {
        // Prevent race conditions: Cancel any pending request if a new one fires instantly
        if (streamAbortController) {
            streamAbortController.abort();
        }
        streamAbortController = new AbortController();

        try {
            // Dynamically construct the query string from the filters object
            const queryParams = new URLSearchParams();
            
            // Pagination
            queryParams.append('page', filters.page || 1);
            queryParams.append('limit', filters.limit || 50);

            // Time Constraints
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            // Taxonomy Filters (Ignore 'ALL' to keep URLs clean and fast)
            if (filters.domain && filters.domain !== 'ALL') queryParams.append('domain', filters.domain);
            if (filters.actorType && filters.actorType !== 'ALL') queryParams.append('actorType', filters.actorType);
            if (filters.severity && filters.severity !== 'ALL') queryParams.append('severity', filters.severity);
            
            // Full Text Search
            if (filters.searchQuery && filters.searchQuery.trim() !== '') {
                queryParams.append('search', filters.searchQuery.trim());
            }

            const url = `${AUDIT_ENDPOINT}/stream?${queryParams.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: getSovereignHeaders(),
                signal: streamAbortController.signal
            });

            if (!response.ok) {
                throw new AuditNetworkError(`Ledger fetch failed: ${response.statusText}`, response.status, url);
            }

            const payload = await response.json();
            return payload; // Expected shape: { data: [], pagination: {} }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('🚧 [Auditor] Rapid search request aborted to prevent race condition.');
                return { aborted: true }; 
            }
            console.error('🚨 [Auditor] Critical Network Failure:', error);
            throw error;
        }
    },

    /**
     * fetchTelemetryPulse: Real-Time Scorecard Data
     * Hits a lightweight aggregation endpoint to power the top KPI cards.
     * * @returns {Promise<Object>} Metrics payload (e.g., events per hour, critical alerts)
     */
    fetchTelemetryPulse: async () => {
        try {
            const url = `${AUDIT_ENDPOINT}/telemetry`;
            const response = await fetch(url, {
                method: 'GET',
                headers: getSovereignHeaders()
            });

            if (!response.ok) {
                throw new AuditNetworkError('Telemetry pulse fetch failed', response.status, url);
            }

            return await response.json();
        } catch (error) {
            console.error('🚨 [Auditor] Telemetry Fetch Failure:', error);
            throw error;
        }
    },

    /**
     * fetchDeepContext: The Forensic Inspector Wire
     * Pulls the massive JSON diff payload, IP addresses, and hardware data for a single event.
     * * @param {string} logId - The unique transaction ID of the log
     * @returns {Promise<Object>} The heavily detailed single log object
     */
    fetchDeepContext: async (logId) => {
        if (!logId) throw new Error("A valid Transaction ID is required for deep context fetching.");

        try {
            const url = `${AUDIT_ENDPOINT}/inspect/${logId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: getSovereignHeaders()
            });

            if (!response.ok) {
                throw new AuditNetworkError('Deep context fetch failed', response.status, url);
            }

            return await response.json();
        } catch (error) {
            console.error(`🚨 [Auditor] Deep Context Failure for ${logId}:`, error);
            throw error;
        }
    },

    /**
     * exportLedger: The Compliance Download Wire
     * Triggers a backend compilation of a CSV/PDF report and downloads it to the Admin's device.
     * * @param {Object} filters - The current UI filters to apply to the export
     * @param {string} format - 'csv' | 'pdf'
     */
    exportLedger: async (filters = {}, format = 'csv') => {
        try {
            const queryParams = new URLSearchParams();
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.domain && filters.domain !== 'ALL') queryParams.append('domain', filters.domain);
            queryParams.append('format', format);

            const url = `${AUDIT_ENDPOINT}/export?${queryParams.toString()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: getSovereignHeaders()
            });

            if (!response.ok) {
                throw new AuditNetworkError('Ledger export failed', response.status, url);
            }

            // Handle the binary blob download natively in React
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `AyaBus_Forensic_Export_${new Date().toISOString().split('T')[0]}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return true;
        } catch (error) {
            console.error('🚨 [Auditor] Ledger Export Failure:', error);
            throw error;
        }
    }
};