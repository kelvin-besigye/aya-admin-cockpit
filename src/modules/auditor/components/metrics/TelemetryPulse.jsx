import React, { useState, useEffect, useCallback } from 'react';
import { 
    Activity, Zap, ShieldAlert, Users, 
    RefreshCw, WifiOff, ChevronDown, ChevronUp,
    Server, AlertTriangle
} from 'lucide-react';

// IMPORT LEVEL 1 DATA ENGINE
import { auditService } from '../../data/audit.service';

/**
 * 👑 TELEMETRY PULSE (Level 5: Auditor Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Auditor
 * File: TelemetryPulse.jsx
 * * DESCRIPTION:
 * The live heartbeat dashboard for the system. Aggregates and displays 
 * real-time system velocity, threat vectors, and active user distribution.
 * * UPGRADES:
 * - Sovereign Ribbon Architecture: Collapses massive data cards into a sleek 64px bar.
 * - Progressive Disclosure: Deep-dive cards are hidden until the Admin explicitly expands them.
 * - Compact KPI Formatting: Auto-truncates large numbers (14.5K) for the dense ribbon view.
 * - Persistent Threat Awareness: Critical alerts violently pulse in the ribbon even when collapsed.
 */

const TelemetryPulse = () => {
    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [metrics, setMetrics] = useState({
        eventsPerHour: 0,
        totalLogs24h: 0,
        criticalAlerts: 0,
        activeActors: { admins: 0, partners: 0, agents: 0 }
    });
    const [status, setStatus] = useState('CONNECTING'); // 'CONNECTING' | 'LIVE' | 'OFFLINE'
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // ========================================================================
    // 2. THE LIVE WIRE (Polling Engine)
    // ========================================================================
    const fetchHeartbeat = useCallback(async (isSilent = false) => {
        if (!isSilent) setStatus('CONNECTING');
        
        try {
            const data = await auditService.fetchTelemetryPulse();
            setMetrics(data);
            setStatus('LIVE');
            setLastUpdated(new Date());
        } catch (error) {
            console.error('🚨 [TelemetryPulse] Heartbeat flatlined:', error);
            setStatus('OFFLINE');
        }
    }, []);

    // Establish the 30-second heartbeat ping
    useEffect(() => {
        fetchHeartbeat();
        const intervalId = setInterval(() => {
            fetchHeartbeat(true); // Silent fetch
        }, 30000);
        return () => clearInterval(intervalId);
    }, [fetchHeartbeat]);

    // ========================================================================
    // 3. FORMATTERS & LOGIC
    // ========================================================================
    const formatExact = (num) => new Intl.NumberFormat('en-US').format(num || 0);
    const formatCompact = (num) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num || 0);
    
    const hasCriticalThreat = metrics.criticalAlerts > 0;

    // ========================================================================
    // 4. RENDER ENGINES
    // ========================================================================

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', flexShrink: 0, 
            background: 'var(--bg-surface)', borderRadius: '16px', 
            border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            transition: 'all 0.3s var(--ease-main)'
        }}>
            {/* CSS Animations */}
            <style>
                {`
                    @keyframes sonarPulse {
                        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-success) 40%, transparent); }
                        70% { box-shadow: 0 0 0 8px transparent; }
                        100% { box-shadow: 0 0 0 0 transparent; }
                    }
                    @keyframes threatPulseRibbon {
                        0% { background: color-mix(in srgb, var(--status-danger) 15%, transparent); }
                        50% { background: color-mix(in srgb, var(--status-danger) 30%, transparent); }
                        100% { background: color-mix(in srgb, var(--status-danger) 15%, transparent); }
                    }
                `}
            </style>

            {/* === A. THE COMPACT SOVEREIGN RIBBON (Always Visible) === */}
            <div style={{ 
                height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '0 24px', cursor: 'pointer' 
            }} onClick={() => setIsExpanded(!isExpanded)}>
                
                {/* 1. Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                    <div style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        background: status === 'LIVE' ? 'var(--status-success)' : status === 'CONNECTING' ? 'var(--status-warning)' : 'var(--status-danger)',
                        animation: status === 'LIVE' ? 'sonarPulse 2s infinite' : 'none'
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {status === 'LIVE' ? 'Telemetry Live' : status === 'CONNECTING' ? 'Syncing...' : 'Network Offline'}
                        </span>
                        {lastUpdated && status === 'LIVE' && (
                            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>
                                Sync: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Mini KPI Strip (The Space Saver) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'center' }}>
                    
                    {/* Mini Velocity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                        <Activity size={14} color="var(--brand-primary)" />
                        <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace' }}>
                            {status === 'OFFLINE' ? '--' : formatCompact(metrics.eventsPerHour)}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>EVT/HR</span>
                    </div>
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

                    {/* Mini Volume */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                        <Zap size={14} color="var(--brand-accent)" />
                        <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace' }}>
                            {status === 'OFFLINE' ? '--' : formatCompact(metrics.totalLogs24h)}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>24H VOL</span>
                    </div>
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

                    {/* Mini Threat (Pulses Red if > 0) */}
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px',
                        background: hasCriticalThreat && status === 'LIVE' ? 'color-mix(in srgb, var(--status-danger) 10%, transparent)' : 'transparent',
                        color: hasCriticalThreat && status === 'LIVE' ? 'var(--status-danger)' : 'var(--text-main)',
                        animation: hasCriticalThreat && status === 'LIVE' ? 'threatPulseRibbon 2s infinite' : 'none',
                        border: `1px solid ${hasCriticalThreat && status === 'LIVE' ? 'color-mix(in srgb, var(--status-danger) 30%, transparent)' : 'transparent'}`
                    }}>
                        <ShieldAlert size={14} color={hasCriticalThreat && status === 'LIVE' ? 'var(--status-danger)' : 'var(--status-success)'} />
                        <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace' }}>
                            {status === 'OFFLINE' ? '--' : metrics.criticalAlerts}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: hasCriticalThreat && status === 'LIVE' ? 'var(--status-danger)' : 'var(--text-muted)' }}>CRITICAL</span>
                    </div>
                </div>

                {/* 3. Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px', justifyContent: 'flex-end' }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); fetchHeartbeat(); }}
                        disabled={status === 'CONNECTING'}
                        style={{ 
                            width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-input)', border: 'none',
                            color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: status === 'CONNECTING' ? 'wait' : 'pointer', transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
                        title="Force Synchronization"
                    >
                        <RefreshCw size={14} className={status === 'CONNECTING' ? 'animate-spin' : ''} /> 
                    </button>
                    
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', 
                        color: isExpanded ? 'var(--brand-primary)' : 'var(--text-muted)', textTransform: 'uppercase' 
                    }}>
                        {isExpanded ? 'Collapse' : 'Deep Analytics'}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
            </div>

            {/* === B. THE EXPANDED KPI GRID (Progressive Disclosure) === */}
            {isExpanded && (
                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', 
                    padding: '24px', borderTop: '1px solid var(--border-subtle)', background: 'color-mix(in srgb, var(--bg-canvas) 50%, transparent)',
                    borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'
                }}>
                    
                    {/* 1. Global Velocity */}
                    <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                            <Activity size={16} color="var(--brand-primary)" />
                            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Velocity</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: '1' }}>{status === 'OFFLINE' ? '--' : formatExact(metrics.eventsPerHour)}</span>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--brand-primary)' }}>EVT/HR</span>
                        </div>
                    </div>

                    {/* 2. Total 24H Volume */}
                    <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                            <Zap size={16} color="var(--brand-accent)" />
                            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>24H Ledger</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: '1' }}>{status === 'OFFLINE' ? '--' : formatExact(metrics.totalLogs24h)}</span>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>RECORDS</span>
                        </div>
                    </div>

                    {/* 3. Threat Radar */}
                    <div style={{ 
                        background: hasCriticalThreat && status === 'LIVE' ? 'color-mix(in srgb, var(--status-danger) 5%, var(--bg-surface))' : 'var(--bg-surface)', 
                        padding: '20px', borderRadius: '16px', border: `1px solid ${hasCriticalThreat && status === 'LIVE' ? 'color-mix(in srgb, var(--status-danger) 40%, transparent)' : 'var(--border-subtle)'}`, 
                        display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: hasCriticalThreat && status === 'LIVE' ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                                <ShieldAlert size={16} />
                                <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Threat Level</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'monospace', color: hasCriticalThreat && status === 'LIVE' ? 'var(--status-danger)' : 'var(--text-main)', letterSpacing: '-1px', lineHeight: '1' }}>{status === 'OFFLINE' ? '--' : formatExact(metrics.criticalAlerts)}</span>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: hasCriticalThreat && status === 'LIVE' ? 'var(--status-danger)' : 'var(--text-muted)' }}>CRITICAL</span>
                        </div>
                    </div>

                    {/* 4. Active Actors Distribution */}
                    <div style={{ gridColumn: '1 / -1', background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                            <Users size={16} /> <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ecosystem Distribution</span>
                        </div>
                        {status === 'OFFLINE' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--status-danger)', height: '100%', padding: '10px 0' }}>
                                <WifiOff size={20} /> <span style={{ fontSize: '13px', fontWeight: '800' }}>Network Isolated</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <ActorBadge label="System Admins" count={metrics.activeActors.admins} color="var(--brand-accent)" />
                                <ActorBadge label="Fleet Partners" count={metrics.activeActors.partners} color="var(--status-warning)" />
                                <ActorBadge label="Field Scanners" count={metrics.activeActors.agents} color="var(--status-success)" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================
const ActorBadge = ({ label, count, color }) => (
    <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
        <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'monospace', color: color, lineHeight: '1' }}>{count}</span>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    </div>
);

export default TelemetryPulse;