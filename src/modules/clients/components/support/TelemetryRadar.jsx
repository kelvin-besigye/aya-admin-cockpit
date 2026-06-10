import React from 'react';
import { 
    Radar, MapPin, BusFront, Navigation, 
    ShieldCheck, AlertTriangle, Wallet, 
    History, ChevronRight, Activity, Clock, 
    Ticket, CreditCard 
} from 'lucide-react';

// IMPORT LEVEL 2 DEPENDENCIES
import LTVBadge from '../primitives/LTVBadge';

/**
 * 👑 TELEMETRY RADAR (Level 5: Support Helpdesk - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: TelemetryRadar.jsx
 * * DESCRIPTION:
 * The right-sidebar God-Mode HUD. Provides live situational awareness by 
 * fusing physical fleet telemetry with passenger financial data.
 * * UPGRADES:
 * - Live Transit Visualizer: CSS-rendered route progress bar with pulsing blips.
 * - Fleet-Link Engine: Surfaces driver speed and Partner health directly in CRM.
 * - 350px Anti-Squish Anchor: Protects the tri-pane helpdesk layout.
 */

// Local formatter for absolute stability
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
};

const TelemetryRadar = ({ activeTicket }) => {

    // ========================================================================
    // 1. RENDER ENGINE (Empty State)
    // ========================================================================
    if (!activeTicket) {
        return (
            <aside style={{ 
                width: '350px', flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', 
                background: 'var(--bg-canvas)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' 
            }}>
                <Radar size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>Radar Offline</h3>
                <p style={{ fontSize: '12px', fontWeight: '600', textAlign: 'center', maxWidth: '200px' }}>Awaiting active signal lock.</p>
            </aside>
        );
    }

    const { passenger } = activeTicket;
    const isMoving = passenger.activeStatus === 'ON_ROUTE' && passenger.telemetry;
    const isSpeeding = isMoving && passenger.telemetry.speedKmH > 90;

    // ========================================================================
    // 2. RENDER ENGINE (Active HUD)
    // ========================================================================
    return (
        <aside style={{ 
            width: '350px', flexShrink: 0, borderLeft: '1px solid var(--border-subtle)',
            display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)',
            height: '100%', position: 'relative', zIndex: 10
        }}>
            
            {/* Inject Global Keyframes for the Radar HUD */}
            <style>
                {`
                    @keyframes radarPing {
                        0% { transform: scale(0.8); opacity: 0.8; }
                        50% { transform: scale(1.2); opacity: 0; }
                        100% { transform: scale(0.8); opacity: 0; }
                    }
                    @keyframes sweep {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>

            {/* === A. RADAR HEADER === */}
            <div style={{ 
                padding: '24px', borderBottom: '1px solid var(--border-subtle)', 
                background: 'var(--bg-surface)', zIndex: 20, display: 'flex', alignItems: 'center', gap: '12px' 
            }}>
                <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', background: 'color-mix(in srgb, var(--brand-primary) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)', overflow: 'hidden' }}>
                    <Radar size={20} style={{ position: 'relative', zIndex: 2 }} />
                    <div style={{ position: 'absolute', inset: 0, borderTop: '2px solid var(--brand-primary)', borderRadius: '50%', animation: 'sweep 3s linear infinite', opacity: 0.5 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                        Context Radar
                    </h3>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Live Signal Locked
                    </span>
                </div>
            </div>

            {/* === B. SCROLLABLE HUD VIEWPORT === */}
            <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                
                {/* 1. Identity & Value Block */}
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{passenger.name}</span>
                            <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{passenger.formattedId}</span>
                        </div>
                        <LTVBadge tierId={passenger.ltvTier.id} size="sm" showIcon={true} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ padding: '12px', background: 'var(--bg-canvas)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lifetime Spend</span>
                            <div style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', marginTop: '4px' }}>
                                {formatCurrency(passenger.lifetimeSpend)}
                            </div>
                        </div>
                        <div style={{ padding: '12px', background: 'color-mix(in srgb, var(--status-success) 10%, transparent)', borderRadius: '12px', border: '1px solid color-mix(in srgb, var(--status-success) 20%, transparent)' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--status-success)', textTransform: 'uppercase' }}>Wallet Balance</span>
                            <div style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--status-success)', marginTop: '4px' }}>
                                {formatCurrency(passenger.walletBalance)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Live Transit Telemetry (The God-Mode Block) */}
                {isMoving ? (
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'color-mix(in srgb, var(--brand-primary) 3%, transparent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <Activity size={16} color="var(--brand-primary)" />
                            <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Transit</span>
                        </div>

                        {/* Physical Route Visualizer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)', zIndex: 2 }}>
                                <MapPin size={18} color="var(--text-main)" />
                            </div>
                            <div style={{ flex: 1, position: 'relative', height: '2px', background: 'var(--border-subtle)' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '60%', background: 'var(--brand-primary)' }} />
                                {/* Pulsing Current Location Blip */}
                                <div style={{ position: 'absolute', top: '50%', left: '60%', width: '12px', height: '12px', background: 'var(--brand-primary)', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 0 4px color-mix(in srgb, var(--brand-primary) 30%, transparent)' }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', animation: 'radarPing 1.5s infinite ease-out', border: '2px solid var(--brand-primary)' }} />
                                </div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-subtle)', zIndex: 2 }}>
                                <MapPin size={18} color="var(--text-muted)" />
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '24px' }}>
                            {passenger.currentRoute}
                        </div>

                        {/* Live Fleet Metrics Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <TelemetryNode 
                                icon={Navigation} label="Live Speed" value={`${passenger.telemetry.speedKmH} km/h`} 
                                isAlert={isSpeeding} 
                            />
                            <TelemetryNode 
                                icon={Clock} label="Est. Arrival" value={`${passenger.telemetry.etaMinutes} mins`} 
                            />
                            <TelemetryNode 
                                icon={BusFront} label="Asset Tag" value={passenger.currentBus} 
                            />
                            <TelemetryNode 
                                icon={ShieldCheck} label="Partner Health" value={`${passenger.telemetry.partnerHealth}/100`} 
                                isAlert={passenger.telemetry.partnerHealth < 80}
                            />
                        </div>
                    </div>
                ) : (
                    // Idle State
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--bg-canvas)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <BusFront size={20} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Passenger is Idle</span>
                            <span style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>No active transit signal detected.</span>
                        </div>
                    </div>
                )}

                {/* 3. Recent Ledger Shortcut */}
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <History size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Activity</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <ActivitySnippet icon={Ticket} title="Kampala → Gulu" date="Tomorrow, 14:00" status="Upcoming" color="var(--brand-primary)" />
                        <ActivitySnippet icon={CreditCard} title="Wallet Deposit via MoMo" date="Sep 15, 2025" status="Cleared" color="var(--status-success)" />
                    </div>

                    <button style={{ 
                        width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px',
                        background: 'transparent', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-main)', fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                        transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-input)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        Open Full Dossier <ChevronRight size={14} />
                    </button>
                </div>

            </div>
        </aside>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const TelemetryNode = ({ icon: Icon, label, value, isAlert = false }) => (
    <div style={{ 
        display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', borderRadius: '10px',
        background: isAlert ? 'color-mix(in srgb, var(--status-danger) 10%, transparent)' : 'var(--bg-surface)',
        border: `1px solid ${isAlert ? 'color-mix(in srgb, var(--status-danger) 25%, transparent)' : 'var(--border-subtle)'}`
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isAlert ? 'var(--status-danger)' : 'var(--text-muted)' }}>
            {isAlert ? <AlertTriangle size={12} strokeWidth={3} /> : <Icon size={12} strokeWidth={2.5} />}
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', color: isAlert ? 'var(--status-danger)' : 'var(--text-main)' }}>
            {value}
        </span>
    </div>
);

const ActivitySnippet = ({ icon: Icon, title, date, status, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-canvas)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `color-mix(in srgb, ${color} 15%, transparent)`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
            <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)' }}>{date}</span>
        </div>
        <span style={{ fontSize: '10px', fontWeight: '800', color: color, textTransform: 'uppercase' }}>{status}</span>
    </div>
);

export default TelemetryRadar;