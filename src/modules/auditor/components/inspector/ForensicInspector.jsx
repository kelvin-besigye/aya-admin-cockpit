import React, { useState, useEffect } from 'react';
import { 
    X, Copy, CheckCircle2, Terminal, 
    FileJson, GitCompare, Globe, MapPin, 
    Smartphone, ShieldAlert, Cpu, Hash
} from 'lucide-react';

// IMPORT LEVEL 1 DATA & CONSTANTS
import { auditService } from '../../data/audit.service';
import { AUDIT_ACTORS, AUDIT_SEVERITY, AUDIT_DOMAINS } from '../../data/audit.constants';

/**
 * 👑 FORENSIC INSPECTOR (Level 5: Auditor Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Auditor
 * File: ForensicInspector.jsx
 * * DESCRIPTION:
 * The slide-out deep dive panel. Fetches massive JSON payloads from the 
 * backend and decodes them into readable Execution Contexts and State Mutation Diffs.
 * * UPGRADES:
 * - Live Deep Fetching: Calls the backend API for the full event context.
 * - Auto-Diffing Engine: Detects 'old' and 'new' keys to render Git-style visual diffs.
 * - Hardware Fingerprinting: Beautifully formats IPs and User Agents.
 * - Copiable Monospace: 1-click clipboard integration for rapid engineering escalation.
 */

const ForensicInspector = ({ logId, onClose }) => {
    // ========================================================================
    // 1. STATE MANAGEMENT & LIVE FETCHING
    // ========================================================================
    const [deepLog, setDeepLog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('CONTEXT'); // 'CONTEXT' | 'DIFF' | 'RAW'

    useEffect(() => {
        if (!logId) return;
        
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        // Fetch the heavy JSON payload from the Live API Wire
        auditService.fetchDeepContext(logId)
            .then(data => {
                if (isMounted) {
                    setDeepLog(data);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setError('Failed to retrieve deep cryptographic context. The record may have been archived.');
                    setIsLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, [logId]);

    // ========================================================================
    // 2. HELPER FUNCTIONS
    // ========================================================================
    // Look up taxonomy details safely
    const actorDef = deepLog ? (AUDIT_ACTORS[deepLog.actorType] || AUDIT_ACTORS.SYSTEM) : null;
    const severityDef = deepLog ? (AUDIT_SEVERITY[deepLog.severity] || AUDIT_SEVERITY.INFO) : null;
    const domainDef = deepLog ? (AUDIT_DOMAINS[deepLog.domain] || { label: deepLog.domain, icon: 'Activity' }) : null;

    // ========================================================================
    // 3. RENDER ENGINES (The Tabs)
    // ========================================================================

    // TAB 1: Execution Context (Hardware & Location Fingerprints)
    const renderContextTab = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* IP Fingerprint */}
                <div style={{ padding: '20px', background: 'var(--bg-canvas)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <Globe size={16} /> <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Origin Network</span>
                    </div>
                    <CopyableText text={deepLog.ipAddress || 'UNKNOWN_IP'} />
                </div>

                {/* Device Fingerprint */}
                <div style={{ padding: '20px', background: 'var(--bg-canvas)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <Smartphone size={16} /> <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hardware Signature</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.5', display: 'block' }}>
                        {deepLog.userAgent || 'UNKNOWN_USER_AGENT'}
                    </span>
                </div>
            </div>

            {/* General Metadata Render */}
            <div style={{ padding: '24px', background: 'var(--bg-canvas)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Extracted Metadata</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {deepLog.metadata && Object.entries(deepLog.metadata).map(([key, value]) => {
                        // Skip diff keys in the general context view
                        if (key.startsWith('old') || key.startsWith('new') || key.startsWith('previous')) return null;
                        
                        return (
                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{key}</span>
                                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--brand-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(value)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // TAB 2: State Mutation (The Git-Style Diff Engine)
    const renderDiffTab = () => {
        const meta = deepLog.metadata || {};
        
        // Auto-detect financial/state changes
        const diffs = [];
        if (meta.oldPrice !== undefined && meta.newPrice !== undefined) {
            diffs.push({ label: 'Route Price Mutation', before: meta.oldPrice, after: meta.newPrice });
        }
        if (meta.previousBalance !== undefined && meta.newBalance !== undefined) {
            diffs.push({ label: 'Wallet Balance Mutation', before: meta.previousBalance, after: meta.newBalance });
        }

        if (diffs.length === 0) {
            return (
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-canvas)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
                    <GitCompare size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>No State Mutations Detected</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>This was a read/execute event, not a data modification.</div>
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {diffs.map((diff, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-canvas)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{diff.label}</span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                            {/* Before State (Red) */}
                            <div style={{ display: 'flex', alignItems: 'center', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', padding: '12px 16px', borderBottom: '1px solid color-mix(in srgb, var(--status-danger) 20%, transparent)' }}>
                                <div style={{ width: '24px', color: 'var(--status-danger)', fontWeight: '900' }}>-</div>
                                <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--status-danger)' }}>{String(diff.before)}</span>
                            </div>
                            {/* After State (Green) */}
                            <div style={{ display: 'flex', alignItems: 'center', background: 'color-mix(in srgb, var(--status-success) 10%, transparent)', padding: '12px 16px' }}>
                                <div style={{ width: '24px', color: 'var(--status-success)', fontWeight: '900' }}>+</div>
                                <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--status-success)' }}>{String(diff.after)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // TAB 3: Raw JSON
    const renderRawTab = () => (
        <div style={{ background: '#09090b', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #27272a' }}>
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <CopyButton text={JSON.stringify(deepLog, null, 2)} dark />
            </div>
            <pre className="ayabus-scroll-area" style={{ margin: 0, padding: 0, fontSize: '13px', fontFamily: 'monospace', color: '#a1a1aa', overflowX: 'auto', lineHeight: '1.6' }}>
                <span style={{ color: '#ec4899' }}>const</span> eventPayload = {JSON.stringify(deepLog, null, 2)}
            </pre>
        </div>
    );

    // ========================================================================
    // 4. MASTER RENDER (The Slide-out Drawer)
    // ========================================================================
    return (
        <>
            {/* Backdrop: Clicking outside closes the drawer */}
            <div 
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9999, transition: 'opacity 0.3s ease' }} 
            />

            {/* The Drawer Panel */}
            <div style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '600px', maxWidth: '100vw', 
                background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.2)', zIndex: 10000, 
                display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s var(--ease-main)' 
            }}>
                <style>
                    {`
                        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
                    `}
                </style>

                {isLoading ? (
                    // LOADING STATE
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Cpu size={48} className="animate-pulse" style={{ color: 'var(--brand-primary)', marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 8px 0' }}>Decrypting Forensic Payload...</h3>
                        <p style={{ fontSize: '13px', fontWeight: '600' }}>Fetching cryptographic hash from the Master Ledger.</p>
                    </div>
                ) : error ? (
                    // ERROR STATE
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--status-danger)' }}>
                        <ShieldAlert size={48} style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 8px 0' }}>Integrity Fault</h3>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{error}</p>
                        <button onClick={onClose} style={{ marginTop: '24px', padding: '10px 24px', borderRadius: '12px', background: 'var(--bg-input)', border: 'none', color: 'var(--text-main)', fontWeight: '800', cursor: 'pointer' }}>Close Inspector</button>
                    </div>
                ) : (
                    // LIVE DATA RENDER
                    <>
                        {/* Drawer Header */}
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-canvas)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Terminal size={18} color="var(--brand-primary)" />
                                    <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>System Event Inspector</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'monospace' }}>{deepLog.id}</h2>
                                    <CopyButton text={deepLog.id} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                                    Recorded at {new Date(deepLog.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <button onClick={onClose} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--status-danger)'; e.currentTarget.style.borderColor = 'var(--status-danger)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Event Hero Badges */}
                        <div style={{ padding: '24px 32px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Executing Actor</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--bg-canvas)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: actorDef.color }} />
                                        <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-main)' }}>{deepLog.actorName}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Event Severity</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: severityDef.bg, borderRadius: '10px', border: `1px solid color-mix(in srgb, ${severityDef.color} 20%, transparent)` }}>
                                        <span style={{ fontSize: '14px', fontWeight: '900', color: severityDef.color }}>{severityDef.label}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target System</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-canvas)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}><Hash size={16} color="var(--brand-primary)"/> {deepLog.target}</div>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                                    <div style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>{deepLog.action}</div>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>Origin: {domainDef.label}</div>
                                </div>
                            </div>

                        </div>

                        {/* Navigation Tabs */}
                        <div style={{ display: 'flex', padding: '0 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                            <Tab label="Execution Context" icon={Globe} isActive={activeTab === 'CONTEXT'} onClick={() => setActiveTab('CONTEXT')} />
                            <Tab label="State Mutation" icon={GitCompare} isActive={activeTab === 'DIFF'} onClick={() => setActiveTab('DIFF')} />
                            <Tab label="Raw Payload" icon={FileJson} isActive={activeTab === 'RAW'} onClick={() => setActiveTab('RAW')} />
                        </div>

                        {/* Tab Content Viewport */}
                        <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '32px', background: 'var(--bg-canvas)' }}>
                            {activeTab === 'CONTEXT' && renderContextTab()}
                            {activeTab === 'DIFF' && renderDiffTab()}
                            {activeTab === 'RAW' && renderRawTab()}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const Tab = ({ label, icon: Icon, isActive, onClick }) => (
    <button 
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 20px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderBottom: `3px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
            color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontSize: '13px', fontWeight: '900', transition: 'all 0.2s ease', outline: 'none'
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-main)'; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
    >
        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} /> {label}
    </button>
);

const CopyButton = ({ text, dark = false }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button 
            onClick={handleCopy}
            style={{ 
                background: copied ? 'color-mix(in srgb, var(--status-success) 15%, transparent)' : (dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-input)'), 
                border: 'none', width: '28px', height: '28px', borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: copied ? 'var(--status-success)' : (dark ? '#fff' : 'var(--text-muted)'), 
                cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            title="Copy to clipboard"
        >
            {copied ? <CheckCircle2 size={14} strokeWidth={3} /> : <Copy size={14} />}
        </button>
    );
};

const CopyableText = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '15px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>{text}</span>
        <CopyButton text={text} />
    </div>
);

export default ForensicInspector;