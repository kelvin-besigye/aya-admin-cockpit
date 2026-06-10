import React, { useState } from 'react';
import { 
    User, Mail, Phone, Map, BusFront, 
    ChevronRight, Activity, Clock 
} from 'lucide-react';

// IMPORT LEVEL 2 PRIMITIVES
import LTVBadge from '../primitives/LTVBadge';

/**
 * 👑 PASSENGER ROW (Level 4: Macro Directory Atom - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: PassengerRow.jsx
 * * DESCRIPTION:
 * A single, highly dense row representing a passenger in the master ledger.
 * Inherits CSS Grid layout from its parent to ensure unbreakable alignment.
 * * UPGRADES:
 * - Live Transit Indicators: Visually changes state if the user is on a bus.
 * - PII Masking: Safely renders masked contact data to prevent screen-snooping.
 * - Highlight Physics: Smooth transition states and left-border anchoring on hover.
 */

// Local currency formatter to ensure zero compilation crashes
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { 
        style: 'currency', 
        currency: 'UGX', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(amount || 0);
};

const PassengerRow = ({ 
    passenger, 
    gridTemplate, 
    onClick 
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // ========================================================================
    // 1. STATUS RESOLUTION ENGINE
    // ========================================================================
    const getStatusConfig = (status) => {
        switch (status) {
            case 'ON_ROUTE': 
                return { label: 'In Transit', icon: BusFront, color: 'var(--brand-primary)', bg: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)' };
            case 'BOARDING': 
                return { label: 'Boarding', icon: Activity, color: 'var(--status-warning)', bg: 'color-mix(in srgb, var(--status-warning) 10%, transparent)' };
            case 'IDLE':
            default: 
                return { label: 'Idle', icon: Clock, color: 'var(--text-muted)', bg: 'var(--bg-input)' };
        }
    };

    const statusConfig = getStatusConfig(passenger.activeStatus);
    const StatusIcon = statusConfig.icon;
    const isMoving = passenger.activeStatus === 'ON_ROUTE' || passenger.activeStatus === 'BOARDING';

    // ========================================================================
    // 2. RENDER ENGINE
    // ========================================================================
    return (
        <div 
            onClick={() => onClick(passenger)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'grid', 
                gridTemplateColumns: gridTemplate, 
                alignItems: 'center',
                padding: '20px 32px', 
                background: isHovered ? 'var(--bg-hover)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)', 
                cursor: 'pointer',
                transition: 'all 0.15s ease', 
                position: 'relative'
            }}
        >
            {/* VIP / Hover Edge Highlight */}
            {isHovered && (
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                    background: passenger.isVip ? passenger.ltvTier.color : 'var(--border-subtle)',
                    borderTopRightRadius: '4px', borderBottomRightRadius: '4px'
                }} />
            )}

            {/* Col 1: Identity & Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{ 
                    width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                    background: passenger.isVip ? passenger.ltvTier.bgPulse : 'var(--bg-input)', 
                    border: `1px solid ${passenger.isVip ? `color-mix(in srgb, ${passenger.ltvTier.color} 30%, transparent)` : 'var(--border-subtle)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: passenger.isVip ? passenger.ltvTier.color : 'var(--text-muted)'
                }}>
                    <User size={20} strokeWidth={passenger.isVip ? 2.5 : 2} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {passenger.name}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {passenger.formattedId}
                    </span>
                </div>
            </div>

            {/* Col 2: PII Secured Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {passenger.maskedPhone}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={12} color="var(--border-subtle)" />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {passenger.email}
                    </span>
                </div>
            </div>

            {/* Col 3: Financial & LTV */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', minWidth: 0, paddingRight: '16px' }}>
                <LTVBadge tierId={passenger.ltvTier.id} size="sm" showIcon={true} showLabel={true} />
                <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                    {formatCurrency(passenger.lifetimeSpend)}
                </span>
            </div>

            {/* Col 4: Live Telemetry Status */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, paddingRight: '16px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '100px',
                    background: statusConfig.bg,
                    border: `1px solid color-mix(in srgb, ${statusConfig.color} 20%, transparent)`,
                    color: statusConfig.color, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                    <StatusIcon size={12} strokeWidth={2.5} />
                    {statusConfig.label}
                </div>
            </div>

            {/* Col 5: Route Context */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '24px' }}>
                {isMoving ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Map size={14} color="var(--text-main)" />
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {passenger.currentRoute}
                            </span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            Bus: {passenger.currentBus}
                        </span>
                    </>
                ) : (
                    <>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>No active booking</span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--border-subtle)', fontFamily: 'monospace' }}>
                            Last seen: {new Date(passenger.lastActive).toLocaleDateString()}
                        </span>
                    </>
                )}
            </div>

            {/* Col 6: Action Chevron */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', 
                    background: isHovered ? 'var(--bg-input)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease', color: isHovered ? 'var(--brand-primary)' : 'var(--text-muted)'
                }}>
                    <ChevronRight size={18} style={{ transform: isHovered ? 'translateX(2px)' : 'translateX(0)', transition: 'transform 0.2s ease' }} />
                </div>
            </div>
        </div>
    );
};

export default PassengerRow;