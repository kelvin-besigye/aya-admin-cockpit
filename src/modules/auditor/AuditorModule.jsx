import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Server, AlertTriangle, Lock } from 'lucide-react';

// ========================================================================
// IMPORT LEVEL 1 DATA & CONSTANTS (Strict Typing)
// ========================================================================
import { auditService } from './data/audit.service';
import { AUDIT_DOMAINS, AUDIT_ACTORS, AUDIT_SEVERITY } from './data/audit.constants';

// ========================================================================
// IMPORT LEVEL 5 COMPONENTS (The Sovereign Viewports)
// ========================================================================
import TelemetryPulse from './components/metrics/TelemetryPulse';
import StreamFilters from './components/stream/StreamFilters';
import ActivityStream from './components/stream/ActivityStream';
import ForensicInspector from './components/inspector/ForensicInspector';

/**
 * 👑 AUDITOR MODULE (Level 7: The Master Orchestrator - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Auditor
 * File: AuditorModule.jsx
 * * DESCRIPTION:
 * The apex routing shell for the Immutable Witness. Manages the global 
 * state for forensic filters, paginated data streams, and deep-dive inspections.
 * * UPGRADES:
 * - Spatial Compression: Tightened flex-gaps and wrapper padding to maximize grid height.
 * - Strict Flex Physics: Enforced minHeight:0 to guarantee internal scroll targeting.
 * - Strict Taxonomy Typing: Inherits global constants to prevent hardcoded string errors.
 * - Live State Wiring: Passes data securely between the Service, Filters, and Ledger.
 */

// Define strict default state relying on our taxonomy
const INITIAL_FILTERS = {
    page: 1,
    limit: 50,
    searchQuery: '',
    domain: 'ALL',      // Native fallback, strictly bound to AUDIT_DOMAINS in filters
    actorType: 'ALL',   // Native fallback, bound to AUDIT_ACTORS
    severity: 'ALL',    // Native fallback, bound to AUDIT_SEVERITY
    startDate: '',
    endDate: ''
};

const AuditorModule = () => {
    // ========================================================================
    // 1. GLOBAL MODULE STATE
    // ========================================================================
    
    // Core Data State
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [networkError, setNetworkError] = useState(null);

    // Contextual Inspector State
    const [inspectingLogId, setInspectingLogId] = useState(null);

    // Query & Pagination Engine State
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [pagination, setPagination] = useState({
        page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false
    });

    // ========================================================================
    // 2. LIVE WIRE EXECUTION (The Data Pump)
    // ========================================================================
    
    const fetchLedgerStream = useCallback(async () => {
        setIsLoading(true);
        setNetworkError(null);
        
        try {
            const response = await auditService.fetchForensicLedger(filters);
            
            // If the request was aborted by our race-condition handler, ignore it quietly.
            if (response.aborted) return;

            setLogs(response.data || []);
            setPagination(response.pagination || { page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false });
        } catch (error) {
            console.error('🚨 [AuditorModule] Failed to synchronize ledger:', error);
            setNetworkError('Failed to establish secure connection to the Master Ledger.');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Re-fire the fetch anytime the filters object mutates
    useEffect(() => {
        fetchLedgerStream();
    }, [fetchLedgerStream]);

    // ========================================================================
    // 3. EVENT HANDLERS
    // ========================================================================

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleInspect = (log) => {
        setInspectingLogId(log.id);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await auditService.exportLedger(filters, 'csv');
        } catch (error) {
            alert('Export failed. Ensure secure connection is active.');
        } finally {
            setIsExporting(false);
        }
    };

    // ========================================================================
    // 4. MASTER SHELL RENDER
    // ========================================================================
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
            
            {/* === THE SOVEREIGN MODULE RIBBON === */}
            <header style={{ 
                height: '56px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0,
                zIndex: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontWeight: '900', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        <ShieldCheck size={18} strokeWidth={2.5} /> Master Auditor
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>
                        / Level 9 Forensic Ledger
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Lock size={14} />
                        <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'monospace' }}>WORM Drive Active</span>
                    </div>
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--status-success) 10%, transparent)', color: 'var(--status-success)' }}>
                        <Server size={14} strokeWidth={3} />
                        <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ledger Encrypted</span>
                    </div>
                </div>
            </header>

            {/* === THE PROTECTED VIEWPORT === */}
            {/* CRITICAL FIX: flex: 1, overflow: hidden, and minHeight: 0 delegates scrolling to the inner grid */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', minHeight: 0, padding: '16px 24px', gap: '16px' }}>
                
                {/* Network Fault Barrier */}
                {networkError && (
                    <div style={{ padding: '12px 20px', borderRadius: '12px', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-danger) 30%, transparent)', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <AlertTriangle size={18} strokeWidth={2.5} />
                        <span style={{ fontSize: '13px', fontWeight: '800' }}>{networkError}</span>
                        <button onClick={() => fetchLedgerStream()} style={{ marginLeft: 'auto', padding: '6px 14px', background: 'var(--status-danger)', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'transform 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                            Retry Connection
                        </button>
                    </div>
                )}

                {/* Top Metrics Bar (Does not scroll, anchored to top) */}
                <TelemetryPulse />

                {/* Control Filters (Does not scroll, anchored to top) */}
                <StreamFilters 
                    currentFilters={filters}
                    onFilterChange={handleFilterChange}
                    onExport={handleExport}
                    isExporting={isExporting}
                />

                {/* The Grid Viewport (Handles its own internal scroll physics, locked to 1150px minimum width) */}
                <ActivityStream 
                    logs={logs}
                    isLoading={isLoading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onInspect={handleInspect}
                />
            </main>

            {/* === OVERLAYS & MODALS === */}
            {inspectingLogId && (
                <ForensicInspector 
                    logId={inspectingLogId} 
                    onClose={() => setInspectingLogId(null)} 
                />
            )}

        </div>
    );
};

export default AuditorModule;