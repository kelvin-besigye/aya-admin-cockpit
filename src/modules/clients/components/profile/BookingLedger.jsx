import React, { useState, useMemo } from 'react';
import { 
    Ticket, CalendarClock, Map, BusFront, 
    CheckCircle2, XCircle, Clock, Receipt, 
    RefreshCcw, Filter, AlertTriangle
} from 'lucide-react';

/**
 * 👑 BOOKING LEDGER (Level 5: Passenger Dossier Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: BookingLedger.jsx
 * * DESCRIPTION:
 * An immutable, infinite-scroll ledger of a passenger's transit history.
 * Links physical trips (Assets/Routes) to financial states (Refunds/Penalties).
 * * UPGRADES:
 * - Anti-Squish Architecture: 950px strict minimum width anchor.
 * - Forensic Row Data: Displays exact Bus Plates and Partner mapping.
 * - Live Filtering: Instantaneous client-side state filtering.
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

const BookingLedger = ({ passengerId }) => {
    // ========================================================================
    // 1. STATE & FILTERS
    // ========================================================================
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'

    // ========================================================================
    // 2. HIGH-FIDELITY MOCK ENGINE (Pre-Backend Simulator)
    // Ensures realistic, East African context data for UI precision.
    // ========================================================================
    const { bookings, metrics } = useMemo(() => {
        if (!passengerId) return { bookings: [], metrics: {} };

        // Simulated Database Payload
        const mockBookings = [
            { id: 'TKT-8891-A', date: 'Tomorrow, 14:00', route: 'Kampala → Gulu', operator: 'Nile Star Buses', assetCode: 'UBL-882A', amount: 45000, status: 'UPCOMING', financialState: 'PAID' },
            { id: 'TKT-8710-X', date: 'Oct 12, 2025, 08:30', route: 'Entebbe → Kampala', operator: 'Gateway Transport', assetCode: 'UBJ-990C', amount: 15000, status: 'COMPLETED', financialState: 'SETTLED' },
            { id: 'TKT-8655-B', date: 'Sep 28, 2025, 22:00', route: 'Kampala → Mbarara', operator: 'Global Coaches', assetCode: 'UBM-104K', amount: 35000, status: 'CANCELLED', financialState: 'REFUNDED_WALLET' },
            { id: 'TKT-8422-C', date: 'Aug 04, 2025, 07:00', route: 'Kampala → Mbale', operator: 'YY Coaches', assetCode: 'UBA-445Y', amount: 30000, status: 'COMPLETED', financialState: 'SETTLED' },
            { id: 'TKT-8109-Z', date: 'Jul 19, 2025, 13:00', route: 'Gulu → Kampala', operator: 'Nile Star Buses', assetCode: 'UBH-771X', amount: 45000, status: 'NO_SHOW', financialState: 'PENALTY_RETAINED' },
            { id: 'TKT-7990-A', date: 'Jun 02, 2025, 09:00', route: 'Kampala → Fort Portal', operator: 'Link Bus Services', assetCode: 'UBF-332D', amount: 40000, status: 'COMPLETED', financialState: 'SETTLED' },
        ];

        return { 
            bookings: mockBookings,
            metrics: {
                total: mockBookings.length,
                upcoming: mockBookings.filter(b => b.status === 'UPCOMING').length,
                cancelled: mockBookings.filter(b => b.status === 'CANCELLED' || b.status === 'NO_SHOW').length
            }
        };
    }, [passengerId]);

    // ========================================================================
    // 3. FILTERING ENGINE
    // ========================================================================
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'NO_SHOW';
            return b.status === activeFilter;
        });
    }, [bookings, activeFilter]);

    // ========================================================================
    // 4. CSS GRID DEFINITION
    // ========================================================================
    const GRID_TEMPLATE = '1.2fr 1.5fr 2fr 1fr 1.5fr 80px';

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden'
        }}>
            
            {/* === A. HEADER & QUICK STATS === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '20px', background: 'var(--bg-surface)'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <Ticket size={20} color="var(--brand-primary)" />
                        Booking & Transit Ledger
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Immutable history of physical transit and financial states.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <FilterButton label={`All (${metrics.total})`} isActive={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
                    <FilterButton label={`Upcoming (${metrics.upcoming})`} isActive={activeFilter === 'UPCOMING'} onClick={() => setActiveFilter('UPCOMING')} color="var(--brand-primary)" />
                    <FilterButton label="Completed" isActive={activeFilter === 'COMPLETED'} onClick={() => setActiveFilter('COMPLETED')} color="var(--status-success)" />
                    <FilterButton label={`Exceptions (${metrics.cancelled})`} isActive={activeFilter === 'CANCELLED'} onClick={() => setActiveFilter('CANCELLED')} color="var(--status-danger)" />
                </div>
            </div>

            {/* === B. BI-DIRECTIONAL LEDGER VIEWPORT === */}
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-canvas)' }} className="ayabus-scroll-area">
                
                {/* The 950px Anchor: Prevents table crush on small screens */}
                <div style={{ minWidth: '950px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    
                    {/* Sticky Ledger Header */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                        padding: '12px 32px', background: 'color-mix(in srgb, var(--bg-canvas) 85%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(12px)',
                        fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px'
                    }}>
                        <span style={{ paddingRight: '16px' }}>Ticket ID</span>
                        <span style={{ paddingRight: '16px' }}>Date & Time</span>
                        <span style={{ paddingRight: '16px' }}>Route & Asset</span>
                        <span style={{ paddingRight: '16px' }}>Fare</span>
                        <span style={{ paddingRight: '16px' }}>Status & Finance</span>
                        <span style={{ textAlign: 'right' }}>Receipt</span>
                    </div>

                    {/* Scrollable Data Rows */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        {filteredBookings.length === 0 && (
                            <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <Filter size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>No Records Found</span>
                                <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>This passenger has no trips matching this filter.</span>
                            </div>
                        )}

                        {filteredBookings.map(booking => (
                            <BookingRow key={booking.id} booking={booking} gridTemplate={GRID_TEMPLATE} />
                        ))}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========================================================================
// 6. SUB-COMPONENT: BOOKING ROW (The Uncrushable Grid Atom)
// ========================================================================
const BookingRow = ({ booking, gridTemplate }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Dynamic Status Logic
    const getStatusConfig = (status, financialState) => {
        switch(status) {
            case 'UPCOMING': return { label: 'Upcoming', color: 'var(--brand-primary)', icon: Clock, bg: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', note: 'Awaiting Transit' };
            case 'COMPLETED': return { label: 'Completed', color: 'var(--status-success)', icon: CheckCircle2, bg: 'color-mix(in srgb, var(--status-success) 10%, transparent)', note: 'Settled' };
            case 'CANCELLED': return { label: 'Cancelled', color: 'var(--status-danger)', icon: XCircle, bg: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', note: financialState === 'REFUNDED_WALLET' ? 'Refunded to Wallet' : 'Refund Pending' };
            case 'NO_SHOW': return { label: 'No Show', color: 'var(--status-warning)', icon: AlertTriangle, bg: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', note: 'Penalty Retained' };
            default: return { label: status, color: 'var(--text-muted)', icon: Ticket, bg: 'var(--bg-input)', note: '' };
        }
    };

    const config = getStatusConfig(booking.status, booking.financialState);
    const StatusIcon = config.icon;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center',
                padding: '20px 32px', background: isHovered ? 'var(--bg-hover)' : 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s ease', position: 'relative'
            }}
        >
            {/* Edge Highlight for Upcoming/Attention */}
            {booking.status === 'UPCOMING' && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--brand-primary)' }} />
            )}
            {(booking.status === 'CANCELLED' || booking.status === 'NO_SHOW') && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--status-danger)' }} />
            )}

            {/* Col 1: Ticket ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                    {booking.id}
                </span>
                {booking.status === 'UPCOMING' && (
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Active Ticket</span>
                )}
            </div>

            {/* Col 2: Date & Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, paddingRight: '16px' }}>
                <CalendarClock size={14} color={booking.status === 'UPCOMING' ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {booking.date}
                </span>
            </div>

            {/* Col 3: Route & Asset */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Map size={14} color="var(--text-main)" />
                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {booking.route}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    <BusFront size={12} /> {booking.operator} <span style={{ fontFamily: 'monospace', color: 'var(--border-subtle)', marginLeft: '4px' }}>[{booking.assetCode}]</span>
                </div>
            </div>

            {/* Col 4: Fare */}
            <div style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', paddingRight: '16px' }}>
                {formatCurrency(booking.amount)}
            </div>

            {/* Col 5: Status & Finance */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '100px',
                    background: config.bg, color: config.color, border: `1px solid color-mix(in srgb, ${config.color} 20%, transparent)`,
                    fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                    <StatusIcon size={12} strokeWidth={2.5} />
                    {config.label}
                </div>
                {config.note && (
                    <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', paddingLeft: '4px' }}>
                        {config.note}
                    </span>
                )}
            </div>

            {/* Col 6: Receipt Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button 
                    title="View Receipt & Itinerary"
                    style={{ 
                        width: '32px', height: '32px', borderRadius: '8px', 
                        background: isHovered ? 'var(--bg-input)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', 
                        color: isHovered ? 'var(--brand-primary)' : 'var(--text-muted)'
                    }}
                >
                    <Receipt size={16} />
                </button>
            </div>
        </div>
    );
};

// ========================================================================
// HELPER COMPONENT
// ========================================================================
const FilterButton = ({ label, isActive, onClick, color = 'var(--text-main)' }) => (
    <button onClick={onClick} style={{
        padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: isActive ? `color-mix(in srgb, ${color} 10%, transparent)` : 'transparent',
        border: `1px solid ${isActive ? `color-mix(in srgb, ${color} 30%, transparent)` : 'var(--border-subtle)'}`,
        color: isActive ? color : 'var(--text-muted)', fontSize: '11px', fontWeight: isActive ? '900' : '700',
        letterSpacing: '0.5px', textTransform: 'uppercase'
    }}>
        {label}
    </button>
);

export default BookingLedger;