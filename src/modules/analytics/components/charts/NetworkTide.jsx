import React, { useMemo } from 'react';
import { 
    Smartphone, Globe, Ticket, MapPin, 
    ArrowRightLeft, Activity, Navigation 
} from 'lucide-react';

/**
 * 👑 AYABUS NETWORK TIDE (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: NetworkTide.jsx
 * * DESCRIPTION:
 * Zone 4: Visualizes Macro Geography and Origination Channels.
 * Uses Pure CSS conic-gradients and flex-flows to create 
 * high-performance, theme-aware charts without external libraries.
 */

const NetworkTide = ({ channelData, migrationData, isLoading = false }) => {

    // ========================================================================
    // 1. DATA NORMALIZATION & PHYSICS
    // ========================================================================
    
    // Default safe data structures in case the physics engine is still spinning up
    const safeChannels = channelData || { mobile: 0, web: 0, boxOffice: 0 };
    const safeMigration = migrationData || { inbound: 0, outbound: 0 };

    const channelStats = useMemo(() => {
        const total = safeChannels.mobile + safeChannels.web + safeChannels.boxOffice || 1; // Prevent Div by 0
        
        const mobilePct = Math.round((safeChannels.mobile / total) * 100);
        const webPct = Math.round((safeChannels.web / total) * 100);
        const boxOfficePct = Math.round((safeChannels.boxOffice / total) * 100);

        // Calculate degrees for the CSS Conic Gradient Donut Chart
        const mobileDeg = (mobilePct / 100) * 360;
        const webDeg = (webPct / 100) * 360;
        
        return {
            total,
            mobile: { value: safeChannels.mobile, pct: mobilePct, color: 'var(--brand-primary)', icon: Smartphone, label: 'Mobile App' },
            web: { value: safeChannels.web, pct: webPct, color: '#a855f7', icon: Globe, label: 'Web Portal' },
            boxOffice: { value: safeChannels.boxOffice, pct: boxOfficePct, color: 'var(--status-success)', icon: Ticket, label: 'L1 Box Office' },
            gradientString: `var(--brand-primary) 0deg ${mobileDeg}deg, #a855f7 ${mobileDeg}deg ${mobileDeg + webDeg}deg, var(--status-success) ${mobileDeg + webDeg}deg 360deg`
        };
    }, [safeChannels]);

    const migrationStats = useMemo(() => {
        const total = safeMigration.inbound + safeMigration.outbound || 1;
        const inboundPct = Math.round((safeMigration.inbound / total) * 100);
        const outboundPct = Math.round((safeMigration.outbound / total) * 100);

        return {
            total,
            inbound: { value: safeMigration.inbound, pct: inboundPct },
            outbound: { value: safeMigration.outbound, pct: outboundPct }
        };
    }, [safeMigration]);


    // ========================================================================
    // 2. SKELETON LOADER
    // ========================================================================
    if (isLoading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {[1, 2].map(i => (
                    <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '32px', height: '350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ width: '150px', height: '24px', background: 'var(--bg-input)', borderRadius: '8px', animation: 'pulse 1.5s infinite', opacity: 0.5 }} />
                        <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: '50%', width: '150px', margin: '0 auto', animation: 'pulse 1.5s infinite', opacity: 0.3 }} />
                    </div>
                ))}
            </div>
        );
    }

    // ========================================================================
    // 3. MAIN RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {/* =========================================================
                CHART A: ORIGINATION VECTORS (The Donut Chart)
                Shows exactly where tickets are being generated.
                ========================================================= */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={18} color="var(--brand-primary)" />
                            Origination Vectors
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Ticket generation volume by platform channel.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                    
                    {/* The Native CSS Donut */}
                    <div style={{ 
                        width: '180px', height: '180px', borderRadius: '50%', 
                        background: `conic-gradient(${channelStats.gradientString})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', flexShrink: 0,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        {/* The Donut Hole (Matches background to create the ring) */}
                        <div style={{ 
                            width: '130px', height: '130px', background: 'var(--bg-surface)', 
                            borderRadius: '50%', display: 'flex', flexDirection: 'column', 
                            alignItems: 'center', justifyContent: 'center', zIndex: 2 
                        }}>
                            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Vol</div>
                            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px' }}>
                                {new Intl.NumberFormat().format(channelStats.total)}
                            </div>
                        </div>
                    </div>

                    {/* The Interactive Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        {[channelStats.mobile, channelStats.web, channelStats.boxOffice].map((channel, i) => {
                            const Icon = channel.icon;
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-canvas)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: channel.color }} />
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{channel.label}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                <Icon size={10} /> {new Intl.NumberFormat().format(channel.value)} Txns
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '900', color: channel.color }}>
                                        {channel.pct}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* =========================================================
                CHART B: THE MIGRATION TIDE
                Shows macro-directional flow (Inbound vs Outbound).
                ========================================================= */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ArrowRightLeft size={18} color="var(--status-warning)" />
                            The Migration Tide
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Macro directional volume relative to Central Hub.
                        </p>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    
                    {/* Directional Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outbound (Borders)</div>
                            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' }}>{migrationStats.outbound.pct}%</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '50%', color: 'var(--text-muted)' }}>
                                <MapPin size={24} />
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inbound (Hub)</div>
                            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' }}>{migrationStats.inbound.pct}%</div>
                        </div>
                    </div>

                    {/* The Dual-Flow Kinetic Gauge */}
                    <div style={{ position: 'relative', height: '16px', background: 'var(--bg-input)', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                        
                        {/* Outbound Flow (Left) */}
                        <div style={{ 
                            width: `${migrationStats.outbound.pct}%`, height: '100%', 
                            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                            transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div className="flow-lines-left" />
                        </div>

                        {/* Center Hub Line */}
                        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', background: 'var(--bg-surface)', zIndex: 10, transform: 'translateX(-50%)' }} />

                        {/* Inbound Flow (Right) */}
                        <div style={{ 
                            width: `${migrationStats.inbound.pct}%`, height: '100%', 
                            background: 'linear-gradient(270deg, #3b82f6, #60a5fa)',
                            transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div className="flow-lines-right" />
                        </div>
                    </div>

                    {/* Meta Detail */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        <div>{new Intl.NumberFormat().format(migrationStats.outbound.value)} Travelers</div>
                        <div>{new Intl.NumberFormat().format(migrationStats.inbound.value)} Travelers</div>
                    </div>

                </div>
            </div>

            {/* CSS ANIMATIONS FOR THE MIGRATION FLOW */}
            <style>{`
                .flow-lines-left {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px);
                    animation: flowLeft 20s linear infinite;
                }
                .flow-lines-right {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px);
                    animation: flowRight 20s linear infinite;
                }
                @keyframes flowLeft { from { background-position: 0 0; } to { background-position: -1000px 0; } }
                @keyframes flowRight { from { background-position: 0 0; } to { background-position: 1000px 0; } }
            `}</style>
        </div>
    );
};

export default NetworkTide;