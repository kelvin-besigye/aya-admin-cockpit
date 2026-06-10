import React, { useState, useEffect } from 'react';
import { 
    User, Mail, Phone, MapPin, BusFront, 
    Activity, Wallet, Ticket, Clock, 
    Navigation, ShieldCheck, AlertCircle, MessageSquare
} from 'lucide-react';

// IMPORT LEVEL 1 & 2 DEPENDENCIES
import { clientService } from '../../data/clients.service';
import LTVBadge from '../primitives/LTVBadge';

/**
 * 👑 PASSENGER DOSSIER (Level 5: The Micro Profile - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: PassengerDossier.jsx
 * * DESCRIPTION:
 * The apex profile header for a passenger. Displays identity, lifetime KPIs, 
 * and conditionally renders a Live Transit Radar if the user is actively traveling.
 * * UPGRADES:
 * - Transit Radar: Real-time telemetry integration (Speed, ETA, Driver).
 * - Fluid KPI Grid: Auto-scaling financial and support metric cards.
 * - Glassmorphism Architecture: Adapts flawlessly to Dark/Light modes.
 */

// Local formatter to guarantee zero compilation crashes
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { 
        style: 'currency', 
        currency: 'UGX', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(amount || 0);
};

const PassengerDossier = ({ passengerId, onOpenChat }) => {
    // ========================================================================
    // 1. STATE & DATA FETCHING
    // ========================================================================
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!passengerId) return;
        
        let isMounted = true;
        setIsLoading(true);

        clientService.getPassengerProfile(passengerId)
            .then(data => {
                if (isMounted) setProfile(data);
            })
            .catch(err => {
                console.error("Dossier Fetch Error:", err);
                if (isMounted) setError("Failed to load passenger telemetry.");
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [passengerId]);

    // ========================================================================
    // 2. RENDER ENGINE
    // ========================================================================
    
    // ERROR STATE
    if (error) {
        return (
            <div className="citadel-card" style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--status-danger)' }}>
                <AlertCircle size={40} color="var(--status-danger)" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--status-danger)', margin: '0 0 8px 0' }}>Telemetry Failure</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{error}</p>
            </div>
        );
    }

    // LOADING STATE (High-Fidelity Skeletons)
    if (isLoading || !profile) {
        return (
            <div className="citadel-card" style={{ background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <div style={{ padding: '32px', display: 'flex', gap: '24px' }}>
                    <div className="animate-pulse" style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-input)' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="animate-pulse" style={{ width: '200px', height: '28px', borderRadius: '8px', background: 'var(--bg-input)' }} />
                        <div className="animate-pulse" style={{ width: '150px', height: '16px', borderRadius: '6px', background: 'var(--bg-input)' }} />
                    </div>
                </div>
                <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    {[1, 2, 3].map(i => <div key={i} className="animate-pulse" style={{ height: '80px', borderRadius: '16px', background: 'var(--bg-input)' }} />)}
                </div>
            </div>
        );
    }

    const isMoving = profile.activeStatus === 'ON_ROUTE';

    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)', overflow: 'hidden'
        }}>
            
            {/* === A. MASTER IDENTITY HEADER === */}
            <div style={{ 
                padding: '32px', display: 'flex', justifyContent: 'space-between', 
                alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    
                    {/* The Sovereign Avatar */}
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '24px', flexShrink: 0,
                        background: profile.isVip ? profile.ltvTier.bgPulse : 'var(--bg-input)', 
                        border: `2px solid ${profile.isVip ? `color-mix(in srgb, ${profile.ltvTier.color} 40%, transparent)` : 'var(--border-subtle)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: profile.isVip ? profile.ltvTier.color : 'var(--text-muted)',
                        boxShadow: profile.isVip ? `0 8px 24px color-mix(in srgb, ${profile.ltvTier.color} 20%, transparent)` : 'none'
                    }}>
                        <User size={36} strokeWidth={profile.isVip ? 2.5 : 2} />
                    </div>
                    
                    {/* Identity Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                {profile.name}
                            </h2>
                            <LTVBadge tierId={profile.ltvTier.id} size="md" />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px' }}>
                                {profile.formattedId}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
                                <Phone size={14} /> {profile.maskedPhone}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>
                                <Mail size={14} /> {profile.email || 'No email registered'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Action Button */}
                <button 
                    onClick={() => onOpenChat && onOpenChat(profile)}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
                        borderRadius: '12px', background: 'var(--text-main)', color: 'var(--bg-canvas)', 
                        border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '900',
                        transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    <MessageSquare size={16} strokeWidth={2.5} /> Direct Connect
                </button>
            </div>

            {/* === B. THE MACRO KPI GRID === */}
            <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1px', background: 'var(--border-subtle)', borderTop: '1px solid var(--border-subtle)' 
            }}>
                <KpiCard 
                    icon={Activity} color="var(--brand-primary)" 
                    label="Lifetime Ticket Yield" 
                    value={formatCurrency(profile.lifetimeSpend)} 
                />
                <KpiCard 
                    icon={Wallet} color="var(--status-success)" 
                    label="Digital Wallet Balance" 
                    value={formatCurrency(profile.walletBalance)} 
                    subtext="Available for 1-Click Refund"
                />
                <KpiCard 
                    icon={Ticket} color={profile.activeTickets > 0 ? 'var(--status-warning)' : 'var(--text-muted)'} 
                    label="Active Support Tickets" 
                    value={profile.activeTickets.toString()} 
                    subtext={profile.activeTickets > 0 ? 'Requires attention' : 'Inbox zero'}
                />
            </div>

            {/* === C. LIVE TRANSIT RADAR (The God-Mode HUD) === */}
            {isMoving && profile.telemetry && (
                <div style={{ 
                    margin: '24px', padding: '24px', borderRadius: '16px', 
                    background: 'color-mix(in srgb, var(--brand-primary) 5%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)',
                    display: 'flex', flexDirection: 'column', gap: '20px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-primary)', boxShadow: '0 0 10px var(--brand-primary)', animation: 'pulse 2s infinite' }} />
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Live Transit Telemetry Active
                            </h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <MapPin size={14} color="var(--brand-primary)" /> {profile.currentRoute}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        
                        {/* Radar Data Node 1: Physical Asset */}
                        <RadarNode icon={BusFront} label="Asset Code" value={profile.currentBus} />
                        
                        {/* Radar Data Node 2: Live Speed */}
                        <RadarNode 
                            icon={Navigation} 
                            label="Current Velocity" 
                            value={`${profile.telemetry.speedKmH} km/h`} 
                            valueColor={profile.telemetry.speedKmH > 90 ? 'var(--status-danger)' : 'var(--text-main)'}
                        />
                        
                        {/* Radar Data Node 3: Operator Target */}
                        <RadarNode icon={Clock} label="Calculated ETA" value={`${profile.telemetry.etaMinutes} Mins`} />
                        
                        {/* Radar Data Node 4: Partner Health */}
                        <RadarNode 
                            icon={ShieldCheck} 
                            label="Partner Health Score" 
                            value={`${profile.telemetry.partnerHealth}/100`} 
                            valueColor={profile.telemetry.partnerHealth >= 80 ? 'var(--status-success)' : 'var(--status-danger)'}
                        />
                    </div>
                </div>
            )}
            
            {/* Optional Pulse CSS for the Radar */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS (Visual Atoms)
// ========================================================================

const KpiCard = ({ icon: Icon, color, label, value, subtext }) => (
    <div style={{ 
        padding: '24px 32px', background: 'var(--bg-surface)', 
        display: 'flex', flexDirection: 'column', gap: '12px' 
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon size={16} color={color} />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                {value}
            </span>
            {subtext && (
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    {subtext}
                </span>
            )}
        </div>
    </div>
);

const RadarNode = ({ icon: Icon, label, value, valueColor = 'var(--text-main)' }) => (
    <div style={{ 
        flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '6px', 
        background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', 
        border: '1px solid var(--border-subtle)' 
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Icon size={14} />
            <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </span>
        </div>
        <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: valueColor }}>
            {value}
        </span>
    </div>
);

export default PassengerDossier;