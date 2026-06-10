import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Settings, AlertCircle, Save, RotateCcw, 
    ShieldCheck, Server, AlertTriangle, ArrowRight
} from 'lucide-react';

// ========================================================================
// 1. IMPORT LEVEL 1 DATA PHYSICS
// ========================================================================
import { MASTER_SCHEMA, CONTROL_SECTORS, extractDefaultState, RISK_LEVELS } from './data/control.constants';
import { controlService } from './data/control.service';

// ========================================================================
// 2. IMPORT LEVEL 3 & 4 HARDWARE (Sidebar & 8 Sectors)
// ========================================================================
import SectorSidebar from './components/navigation/SectorSidebar';
import SectorConsumerWeb from './components/sectors/SectorConsumerWeb';
import SectorTicketConfig from './components/sectors/SectorTicketConfig';
import SectorTreasury from './components/sectors/SectorTreasury';
import SectorOperations from './components/sectors/SectorOperations';
import SectorPartners from './components/sectors/SectorPartners';
import SectorTelemetry from './components/sectors/SectorTelemetry';
import SectorDatabase from './components/sectors/SectorDatabase';
import SectorSecurity from './components/sectors/SectorSecurity';

/**
 * 👑 CONTROL CENTRE (Level 7: The Master Orchestrator - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: ControlCentreModule.jsx
 * * DESCRIPTION:
 * The apex routing shell for the God-Mode dashboard. Manages global NoSQL state, 
 * calculates deep diffs, and enforces Zero-Trust deployment physics.
 */

const ControlCentreModule = () => {
    // ========================================================================
    // 3. GLOBAL STATE MANAGEMENT
    // ========================================================================
    const [activeSector, setActiveSector] = useState(CONTROL_SECTORS.CONSUMER.id);
    
    // Core Data States
    const [masterState, setMasterState] = useState(extractDefaultState());
    const [draftState, setDraftState] = useState(extractDefaultState());
    const [documentVersion, setDocumentVersion] = useState(null); // ETag for Concurrency
    
    // Network States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [networkError, setNetworkError] = useState(null);

    // Deployment Overlay State
    const [showDiffModal, setShowDiffModal] = useState(false);

    // ========================================================================
    // 4. LIVE WIRE EXECUTION (Fetch Engine)
    // ========================================================================
    const fetchEcosystemState = useCallback(async () => {
        setIsLoading(true);
        setNetworkError(null);
        try {
            const response = await controlService.fetchGlobalConfiguration();
            if (response.aborted) return;

            setMasterState(response.data);
            setDraftState(response.data); // Clone master to draft
            setDocumentVersion(response.version);
        } catch (error) {
            console.error('🚨 [ControlCentre] Network Boot Failure:', error);
            setNetworkError('Failed to establish secure connection to the NoSQL Gateway.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEcosystemState();
    }, [fetchEcosystemState]);

    // ========================================================================
    // 5. THE DIFF ENGINE (Calculates Unsaved Sectors)
    // ========================================================================
    const calculateDiff = useCallback(() => {
        const changes = {};
        const unsavedSectorIds = [];
        let highestRisk = RISK_LEVELS.LOW;
        const riskWeights = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

        Object.keys(draftState).forEach(sectorKey => {
            const sectorDraft = draftState[sectorKey];
            const sectorMaster = masterState[sectorKey] || {};
            
            let sectorHasChanges = false;
            
            Object.keys(sectorDraft).forEach(settingId => {
                if (JSON.stringify(sectorDraft[settingId]) !== JSON.stringify(sectorMaster[settingId])) {
                    if (!changes[sectorKey]) changes[sectorKey] = {};
                    
                    const def = MASTER_SCHEMA[sectorKey][settingId];
                    changes[sectorKey][settingId] = {
                        label: def.label,
                        from: sectorMaster[settingId],
                        to: sectorDraft[settingId],
                        riskLevel: def.riskLevel
                    };
                    
                    if (riskWeights[def.riskLevel] > riskWeights[highestRisk]) {
                        highestRisk = def.riskLevel;
                    }
                    sectorHasChanges = true;
                }
            });

            if (sectorHasChanges) unsavedSectorIds.push(sectorKey);
        });

        return {
            hasChanges: unsavedSectorIds.length > 0,
            unsavedSectorIds,
            changes,
            highestRisk
        };
    }, [masterState, draftState]);

    const { hasChanges, unsavedSectorIds, changes: pendingDiff, highestRisk } = useMemo(() => calculateDiff(), [calculateDiff]);

    // ========================================================================
    // 6. EVENT HANDLERS
    // ========================================================================
    const handleSettingChange = (sectorId, settingId, value) => {
        setDraftState(prev => ({
            ...prev,
            [sectorId]: {
                ...prev[sectorId],
                [settingId]: value
            }
        }));
    };

    const handleRevert = () => {
        if (window.confirm("Are you sure you want to revert all unsaved changes across all sectors?")) {
            setDraftState(masterState); // Nuke the draft, restore the master
        }
    };

    const handleDeployExecution = async () => {
        setIsSaving(true);
        setNetworkError(null);
        try {
            const response = await controlService.applyMasterConfiguration(masterState, draftState, documentVersion);
            
            if (response.status === 'SUCCESS') {
                // Deployment successful. Update the master state to match the deployed draft.
                setMasterState(draftState);
                if (response.version) setDocumentVersion(response.version);
                setShowDiffModal(false);
            }
        } catch (error) {
            setNetworkError(error.message || 'Deployment failed due to network instability.');
            setShowDiffModal(false);
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================================
    // 7. RENDER ROUTER
    // ========================================================================
    const renderActiveSector = () => {
        if (isLoading) {
            return (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', gap: '16px' }}>
                    <Server size={32} className="animate-pulse" />
                    <span style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'monospace' }}>SYNCHRONIZING GLOBAL NOSQL STATE...</span>
                </div>
            );
        }

        const props = {
            sectorState: draftState[activeSector] || {},
            onSettingChange: (settingId, value) => handleSettingChange(activeSector, settingId, value)
        };

        switch (activeSector) {
            case CONTROL_SECTORS.CONSUMER.id: return <SectorConsumerWeb {...props} />;
            case CONTROL_SECTORS.TICKET_CONFIG.id: return <SectorTicketConfig {...props} />;
            case CONTROL_SECTORS.TREASURY.id: return <SectorTreasury {...props} />;
            case CONTROL_SECTORS.OPERATIONS.id: return <SectorOperations {...props} />;
            case CONTROL_SECTORS.PARTNERS.id: return <SectorPartners {...props} />;
            case CONTROL_SECTORS.TELEMETRY.id: return <SectorTelemetry {...props} />;
            case CONTROL_SECTORS.DATABASE.id: return <SectorDatabase {...props} />;
            case CONTROL_SECTORS.SECURITY.id: return <SectorSecurity {...props} />;
            default: return null;
        }
    };

    // ========================================================================
    // 8. MASTER SHELL RENDER
    // ========================================================================
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg-canvas)', position: 'relative' }}>
            
            {/* === THE SOVEREIGN MODULE RIBBON === */}
            <header style={{ 
                height: '56px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-danger)', fontWeight: '900', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        <Settings size={18} strokeWidth={2.5} /> Global Command Engine
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>
                        / Level 9 Master Switchboard
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {networkError && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-danger)', fontSize: '12px', fontWeight: '800' }}>
                            <AlertCircle size={14} /> Network Degraded
                        </div>
                    )}
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--status-success) 10%, transparent)', color: 'var(--status-success)' }}>
                        <ShieldCheck size={14} strokeWidth={3} />
                        <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Zero-Trust Enforced</span>
                    </div>
                </div>
            </header>

            {/* === MAIN VIEWPORT (Sidebar + Content) === */}
            <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', minHeight: 0 }}>
                
                {/* Level 3: Navigation Sidebar */}
                <SectorSidebar 
                    activeSector={activeSector} 
                    onSelectSector={setActiveSector}
                    unsavedSectors={unsavedSectorIds} 
                />

                {/* Level 4: The Active Command Board Container */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Error Banner Injection */}
                    {networkError && (
                        <div style={{ margin: '24px 32px 0 32px', padding: '12px 20px', borderRadius: '12px', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-danger) 30%, transparent)', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <AlertTriangle size={18} strokeWidth={2.5} />
                            <span style={{ fontSize: '13px', fontWeight: '800' }}>{networkError}</span>
                            <button onClick={fetchEcosystemState} style={{ marginLeft: 'auto', padding: '6px 14px', background: 'var(--status-danger)', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>
                                Retry Synchronization
                            </button>
                        </div>
                    )}

                    {/* The Rendered Sector */}
                    {renderActiveSector()}

                </div>
            </main>

            {/* === THE DEPLOYMENT ACTION BAR (Floats up when changes exist) === */}
            <div style={{
                position: 'absolute', bottom: '24px', left: '50%', transform: `translateX(-50%) translateY(${hasChanges ? '0' : '100px'})`,
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '100px',
                padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '24px',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)', opacity: hasChanges ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-warning)', animation: 'amberPulse 2s infinite' }} />
                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                        {unsavedSectorIds.length} Sector{unsavedSectorIds.length > 1 ? 's' : ''} Modified
                    </span>
                </div>
                
                <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                        onClick={handleRevert}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '100px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                        <RotateCcw size={16} strokeWidth={2.5} /> Discard Changes
                    </button>
                    
                    <button 
                        onClick={() => setShowDiffModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '100px', background: 'var(--brand-primary)', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px color-mix(in srgb, var(--brand-primary) 30%, transparent)', transition: 'transform 0.2s ease' }}
                    >
                        <Save size={16} strokeWidth={2.5} /> Review & Deploy
                    </button>
                </div>
            </div>

            {/* === THE FORENSIC DIFF MODAL (Maker-Checker Review) === */}
            {showDiffModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ width: '100%', maxWidth: '700px', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                        
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-canvas)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Server size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>Confirm Master Deployment</h2>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Review the ecosystem delta before applying changes globally.</span>
                                </div>
                            </div>
                            
                            {/* Global Risk Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: `color-mix(in srgb, ${highestRisk === 'CRITICAL' ? 'var(--status-danger)' : 'var(--status-warning)'} 10%, transparent)`, color: highestRisk === 'CRITICAL' ? 'var(--status-danger)' : 'var(--status-warning)' }}>
                                <AlertTriangle size={14} strokeWidth={3} />
                                <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '0.5px' }}>{highestRisk} RISK</span>
                            </div>
                        </div>

                        {/* Diff Render Output */}
                        <div style={{ padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {Object.entries(pendingDiff).map(([sectorId, sectorChanges]) => (
                                <div key={sectorId} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                                        {CONTROL_SECTORS[sectorId]?.label || sectorId}
                                    </h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {Object.entries(sectorChanges).map(([settingId, change]) => (
                                            <div key={settingId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', width: '200px' }}>{change.label}</span>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
                                                    <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', color: 'var(--status-danger)', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>
                                                        {String(change.from)}
                                                    </div>
                                                    <ArrowRight size={16} color="var(--text-muted)" />
                                                    <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--status-success) 10%, transparent)', color: 'var(--status-success)', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>
                                                        {String(change.to)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                            <button 
                                onClick={() => setShowDiffModal(false)}
                                disabled={isSaving}
                                style={{ padding: '12px 24px', borderRadius: '100px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeployExecution}
                                disabled={isSaving}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '100px', background: 'var(--brand-primary)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '800', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                            >
                                {isSaving ? <Server size={18} className="animate-pulse" /> : <Save size={18} />}
                                {isSaving ? 'Deploying to Edge...' : 'Confirm & Deploy Ecosystem'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
            
        </div>
    );
};

export default ControlCentreModule;