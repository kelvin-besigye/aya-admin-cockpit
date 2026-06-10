import React from 'react';
import { 
    // Domain & Actor Icons
    ShieldCheck, Briefcase, User, ScanLine, Cpu, Settings, Activity, 
    Users, Truck, Bus, Map, CalendarClock, Banknote, Scale, Fingerprint, 
    Smartphone, MapPin, 
    // Severity Icons
    Info, CheckCircle2, AlertTriangle, AlertOctagon, Zap,
    // UI Icons
    Clock, Eye, Search, ChevronLeft, ChevronRight, Hash
} from 'lucide-react';

// IMPORT LEVEL 1 CONSTANTS
import { AUDIT_ACTORS, AUDIT_SEVERITY, AUDIT_DOMAINS } from '../../data/audit.constants';

/**
 * 👑 ACTIVITY STREAM (Level 5: Auditor Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Auditor
 * File: ActivityStream.jsx
 * * DESCRIPTION:
 * The high-density forensic ledger. Renders the immutable stream of 
 * system events with dynamic taxonomy mapping and strict monospace technicals.
 * * UPGRADES:
 * - High-Density Vertical Spacing: Reclaimed massive vertical real estate per row.
 * - Sticky Header Physics: Context headers remain locked during deep vertical scrolls.
 * - Zero-Shift Hover: Removed jarring text-shifting on hover for better eye-tracking.
 * - Zebra Striping: Alternating row backgrounds to anchor horizontal reading.
 */

// ========================================================================
// 1. DYNAMIC ICON REGISTRY
// ========================================================================
const ICON_MAP = {
    ShieldCheck, Briefcase, User, ScanLine, Cpu, Settings, Activity, Users, 
    Truck, Bus, Map, CalendarClock, Banknote, Scale, Fingerprint, Smartphone, 
    MapPin, Info, CheckCircle2, AlertTriangle, AlertOctagon, Zap
};

const IconRenderer = ({ iconName, size = 16, color = 'currentColor', strokeWidth = 2 }) => {
    const IconComponent = ICON_MAP[iconName] || Info; 
    return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
};

// ========================================================================
// 2. MAIN COMPONENT EXPORT
// ========================================================================
const ActivityStream = ({ 
    logs = [], 
    isLoading = false, 
    pagination = { page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false }, 
    onPageChange, 
    onInspect 
}) => {
    // Highly optimized CSS Grid: Minimum 1150px to prevent data crush
    const GRID_TEMPLATE = '140px 160px 200px 2.5fr 160px 120px 60px';

    return (
        <div className="citadel-card" style={{ 
            background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)',
            flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
            
            {/* === A. THE SCROLLABLE FORENSIC GRID === */}
            <div className="ayabus-scroll-area" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                <div style={{ minWidth: '1150px', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* STICKY HEADER */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, padding: '12px 24px',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)', background: 'color-mix(in srgb, var(--bg-input) 90%, transparent)'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12}/> Timestamp</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={12}/> Domain</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Fingerprint size={12}/> Actor</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={12}/> Action Verb</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Hash size={12}/> Target ID</span>
                        <span>Severity</span>
                        <span style={{ textAlign: 'right' }}>Inspect</span>
                    </div>

                    {isLoading ? (
                        // Loading State: Render 15 super-compact skeleton rows
                        Array.from({ length: 15 }).map((_, i) => <SkeletonRow key={i} gridTemplate={GRID_TEMPLATE} isEven={i % 2 === 0} />)
                    ) : logs.length === 0 ? (
                        // Empty State
                        <div style={{ padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                            <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-main)' }}>No Cryptographic Logs Found</div>
                            <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Adjust your L9 filter parameters to widen the search.</div>
                        </div>
                    ) : (
                        // Live Data Render
                        logs.map((log, index) => (
                            <AuditRow key={log.id} log={log} index={index} gridTemplate={GRID_TEMPLATE} onInspect={onInspect} />
                        ))
                    )}
                </div>
            </div>

            {/* === B. COMPACT PAGINATION ENGINE === */}
            {!isLoading && logs.length > 0 && (
                <div style={{ 
                    padding: '12px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
                }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                        Viewing page <span style={{ color: 'var(--text-main)', fontWeight: '900' }}>{pagination.page}</span> of {pagination.totalPages}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrevPage}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px',
                                background: pagination.hasPrevPage ? 'var(--bg-input)' : 'transparent', 
                                border: pagination.hasPrevPage ? '1px solid var(--border-subtle)' : '1px solid transparent',
                                color: pagination.hasPrevPage ? 'var(--text-main)' : 'var(--text-muted)',
                                fontSize: '11px', fontWeight: '800', cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease', textTransform: 'uppercase'
                            }}
                            onMouseEnter={e => { if (pagination.hasPrevPage) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                            onMouseLeave={e => { if (pagination.hasPrevPage) e.currentTarget.style.background = 'var(--bg-input)'; }}
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>

                        <button 
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={!pagination.hasNextPage}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px',
                                background: pagination.hasNextPage ? 'var(--bg-input)' : 'transparent', 
                                border: pagination.hasNextPage ? '1px solid var(--border-subtle)' : '1px solid transparent',
                                color: pagination.hasNextPage ? 'var(--text-main)' : 'var(--text-muted)',
                                fontSize: '11px', fontWeight: '800', cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease', textTransform: 'uppercase'
                            }}
                            onMouseEnter={e => { if (pagination.hasNextPage) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                            onMouseLeave={e => { if (pagination.hasNextPage) e.currentTarget.style.background = 'var(--bg-input)'; }}
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ========================================================================
// 3. THE AUDIT ROW COMPONENT (The Dense Data Node)
// ========================================================================
const AuditRow = ({ log, index, gridTemplate, onInspect }) => {
    // Safely extract taxonomy
    const domainDef = AUDIT_DOMAINS[log.domain] || { label: log.domain, icon: 'Activity' };
    const actorDef = AUDIT_ACTORS[log.actorType] || AUDIT_ACTORS.SYSTEM;
    const severityDef = AUDIT_SEVERITY[log.severity] || AUDIT_SEVERITY.INFO;
    
    // Danger Highlights & Zebra Striping
    const isCritical = log.severity === 'CRITICAL' || log.severity === 'FATAL';
    const isEven = index % 2 === 0;
    
    // Base Background Logic
    const baseBg = isCritical 
        ? 'color-mix(in srgb, var(--status-danger) 4%, transparent)' 
        : (isEven ? 'var(--bg-canvas)' : 'var(--bg-surface)');

    // Formatting Helpers
    const formatTimestamp = (isoString) => {
        const d = new Date(isoString);
        return { 
            date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }), 
            time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        };
    };
    const { date, time } = formatTimestamp(log.timestamp);

    return (
        <div style={{ 
            display: 'grid', gridTemplateColumns: gridTemplate, padding: '10px 24px',
            alignItems: 'center', borderBottom: '1px solid var(--border-subtle)',
            background: baseBg, transition: 'background 0.15s ease', position: 'relative'
        }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} 
           onMouseLeave={e => e.currentTarget.style.background = baseBg}>
            
            {/* Critical Side Marker (Fixed, does not shift layout) */}
            {isCritical && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--status-danger)' }} />}

            {/* Col 1: Exact Timestamp */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>{time}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>{date}</span>
            </div>

            {/* Col 2: Domain Origin */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--bg-input)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconRenderer iconName={domainDef.icon} size={12} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {domainDef.label}
                </span>
            </div>

            {/* Col 3: Actor Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.actorName}>
                    {log.actorName}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: '800', color: actorDef.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <IconRenderer iconName={actorDef.icon} size={9} color={actorDef.color} />
                    {actorDef.shortLabel}
                </div>
            </div>

            {/* Col 4: Action Verb */}
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '16px', overflow: 'hidden' }}>
                <div style={{ 
                    fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--brand-primary)', 
                    background: 'color-mix(in srgb, var(--brand-primary) 8%, transparent)', padding: '4px 8px', 
                    borderRadius: '6px', border: '1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)', 
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 'fit-content', maxWidth: '100%'
                }} title={log.action}>
                    {log.action}
                </div>
            </div>

            {/* Col 5: Target ID */}
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '12px', overflow: 'hidden' }}>
                <span style={{ 
                    fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)', 
                    background: 'var(--bg-input)', padding: '3px 6px', borderRadius: '4px', 
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'
                }} title={log.target}>
                    {log.target}
                </span>
            </div>

            {/* Col 6: Severity */}
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '12px' }}>
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', 
                    borderRadius: '6px', background: severityDef.bg, border: '1px solid color-mix(in srgb, ' + severityDef.color + ' 20%, transparent)'
                }}>
                    <span style={{ fontSize: '9px', fontWeight: '900', color: severityDef.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {severityDef.label}
                    </span>
                </div>
            </div>

            {/* Col 7: Inspect Action */}
            <div style={{ textAlign: 'right' }}>
                <button 
                    onClick={() => onInspect(log)}
                    style={{ 
                        width: '28px', height: '28px', borderRadius: '6px', background: 'var(--bg-input)', 
                        border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
                        marginLeft: 'auto'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                    title="Inspect Deep Context"
                >
                    <Eye size={14} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

// ========================================================================
// 4. THE SKELETON LOADER (Compact Edition)
// ========================================================================
const SkeletonRow = ({ gridTemplate, isEven }) => (
    <div style={{ 
        display: 'grid', gridTemplateColumns: gridTemplate, padding: '14px 24px', 
        borderBottom: '1px solid var(--border-subtle)', background: isEven ? 'var(--bg-canvas)' : 'var(--bg-surface)' 
    }}>
        {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="animate-pulse" style={{ 
                height: '14px', background: 'var(--bg-input)', borderRadius: '4px', 
                width: idx === 3 ? '80%' : idx === 6 ? '28px' : '60%', 
                marginLeft: idx === 6 ? 'auto' : '0' 
            }} />
        ))}
    </div>
);

export default ActivityStream;