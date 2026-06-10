import React from 'react';
import { 
    Users, Crosshair, UserMinus, Clock, 
    TrendingUp, TrendingDown, Minus, Activity 
} from 'lucide-react';
import { SLA_THRESHOLDS } from '../../data/analytics.constants';

/**
 * 👑 AYABUS GLOBAL TELEMETRY HUD (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: GlobalTelemetryHud.jsx
 * * DESCRIPTION:
 * Zone 1 of the Analytics Grid. Displays high-level network physics,
 * temporal deltas, and the Maker-Checker SLA. 
 * * UPGRADES:
 * - Fluid Grid (auto-fit) prevents layout crushing on smaller screens.
 * - Flex-wrap and gaps applied to metrics to ensure perfect breathing room.
 */

const GlobalTelemetryHud = ({ metrics, isLoading = false }) => {

    // ========================================================================
    // 1. FORMATTERS & HELPERS
    // ========================================================================
    const formatSlaTime = (minutes) => {
        if (!minutes || isNaN(minutes)) return '0m';
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    // Safely extract data from the Physics Engine payload
    const capture = metrics?.captureRate || { current: 0, delta: { value: 0, formatted: '0%', trend: 'FLAT' } };
    const souls = metrics?.soulsInTransit || { current: 0, delta: { value: 0, formatted: '0%', trend: 'FLAT' } };
    const noShow = metrics?.noShowIndex || { current: 0, status: 'HEALTHY' };
    const actualSla = metrics?.slaAverageMinutes || 0;

    // ========================================================================
    // 2. TREND RENDERER (Semantic Logic)
    // ========================================================================
    const renderTrend = (delta, invertGoodBad = false) => {
        if (!delta) return null;
        
        let color = 'var(--text-muted)';
        let Icon = Minus;

        if (delta.trend === 'UP') {
            Icon = TrendingUp;
            color = invertGoodBad ? 'var(--status-danger)' : 'var(--status-success)';
        } else if (delta.trend === 'DOWN') {
            Icon = TrendingDown;
            color = invertGoodBad ? 'var(--status-success)' : 'var(--status-danger)';
        }

        return (
            <div style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', 
                fontSize: '11px', fontWeight: '800', color,
                background: `color-mix(in srgb, ${color} 10%, transparent)`,
                padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap',
                marginBottom: '4px' // Aligns badge visually with the large number's baseline
            }}>
                <Icon size={12} strokeWidth={3} />
                {delta.formatted}
            </div>
        );
    };

    // ========================================================================
    // 3. SLA DYNAMIC STYLING
    // ========================================================================
    let slaColor = 'var(--status-success)';
    let slaBg = 'rgba(16, 185, 129, 0.1)';
    let slaLabel = 'OPTIMAL SPEED';

    if (actualSla >= SLA_THRESHOLDS.CRITICAL_MINUTES) {
        slaColor = 'var(--status-danger)';
        slaBg = 'rgba(239, 68, 68, 0.1)';
        slaLabel = 'CRITICAL BOTTLENECK';
    } else if (actualSla >= SLA_THRESHOLDS.WARNING_MINUTES) {
        slaColor = 'var(--status-warning)';
        slaBg = 'rgba(245, 158, 11, 0.1)';
        slaLabel = 'WARNING: SLOW';
    }

    // ========================================================================
    // 4. SKELETON LOADER
    // ========================================================================
    if (isLoading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: '140px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', animation: 'pulse 1.5s infinite', opacity: 0.5 }} />
                ))}
            </div>
        );
    }

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            
            {/* CARD 1: PLATFORM CAPTURE RATE */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderTop: '3px solid var(--brand-primary)', borderRadius: '24px', padding: '24px',
                position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'radial-gradient(circle, var(--brand-primary-subtle) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <Crosshair size={14} /> Platform Capture
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', fontWeight: '600' }}>
                            AyaBus Market Penetration
                        </div>
                    </div>
                </div>

                {/* UPDATED: gap and flexWrap prevent squishing */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', zIndex: 2, marginTop: '20px' }}>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: 1, whiteSpace: 'nowrap' }}>
                        {capture.current}<span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>%</span>
                    </div>
                    {renderTrend(capture.delta, false)}
                </div>
            </div>

            {/* CARD 2: SOULS IN TRANSIT */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <Users size={14} color="var(--brand-accent)" /> Souls In Transit
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', fontWeight: '600' }}>
                            Active, Unscanned Passengers
                        </div>
                    </div>
                    {souls.current > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: '800', flexShrink: 0 }}>
                            <div style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} /> LIVE
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', zIndex: 2, marginTop: '20px' }}>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: 1, whiteSpace: 'nowrap' }}>
                        {new Intl.NumberFormat().format(souls.current)}
                    </div>
                    {renderTrend(souls.delta, false)}
                </div>
            </div>

            {/* CARD 3: NO-SHOW INDEX */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-warning)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <UserMinus size={14} /> No-Show Index
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', fontWeight: '600' }}>
                            Drop-off before Boarding
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', zIndex: 2, marginTop: '20px' }}>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: 1, whiteSpace: 'nowrap' }}>
                        {noShow.current}<span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>%</span>
                    </div>
                    <div style={{ 
                        fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap', marginBottom: '4px',
                        background: noShow.status === 'WARNING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: noShow.status === 'WARNING' ? 'var(--status-warning)' : 'var(--status-success)'
                    }}>
                        {noShow.status}
                    </div>
                </div>
            </div>

            {/* CARD 4: MAKER-CHECKER SLA (The Fix) */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: `1px solid ${slaColor}`, 
                borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: actualSla >= SLA_THRESHOLDS.CRITICAL_MINUTES ? '0 0 20px rgba(239, 68, 68, 0.15)' : 'none'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: slaBg, opacity: 0.5, zIndex: 0 }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: slaColor, fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <Clock size={14} /> Maker-Checker SLA
                        </div>
                        <div style={{ color: 'var(--text-main)', fontSize: '11px', marginTop: '4px', fontWeight: '600', opacity: 0.7 }}>
                            Avg L9 Approval Delay
                        </div>
                    </div>
                    <Activity size={16} color={slaColor} style={{ opacity: 0.5 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', zIndex: 2, marginTop: '20px' }}>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: slaColor, letterSpacing: '-1px', lineHeight: 1, whiteSpace: 'nowrap' }}>
                        {formatSlaTime(actualSla)}
                    </div>
                    
                    {/* UPDATED: Solid boundary pill for the SLA Label */}
                    <div style={{ 
                        fontSize: '10px', fontWeight: '800', color: slaColor, letterSpacing: '0.5px',
                        background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '6px', 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', whiteSpace: 'nowrap', marginBottom: '4px',
                        border: `1px solid color-mix(in srgb, ${slaColor} 20%, transparent)`
                    }}>
                        {slaLabel}
                    </div>
                </div>
            </div>

            {/* ANIMATIONS */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7); }
                    70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 6px rgba(168, 85, 247, 0); }
                    100% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
                }
            `}</style>
        </div>
    );
};

export default GlobalTelemetryHud;