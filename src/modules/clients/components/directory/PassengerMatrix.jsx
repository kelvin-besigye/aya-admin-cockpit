import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, Search, Filter, Crown, 
    BusFront, CheckCircle2, AlertCircle
} from 'lucide-react';

// IMPORT LEVEL 1 & 4 DEPENDENCIES
import { clientService } from '../../data/clients.service';
import PassengerRow from './PassengerRow';

/**
 * 👑 PASSENGER MATRIX (Level 4: The Macro Directory - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: PassengerMatrix.jsx
 * * DESCRIPTION:
 * The infinite-scroll master ledger of all registered passengers.
 * Provides a God's-eye view of the entire B2C user base, allowing L9 Admins
 * to instantly filter by VIP status, active transit state, and LTV.
 * * UPGRADES:
 * - Macro Telemetry: Calculates live ecosystem stats in the header.
 * - Anti-Squish Architecture: 1050px minimum width lock protects the grid.
 * - Fluid Filtering: Instantaneous text search and tag-based segmenting.
 */

const PassengerMatrix = ({ 
    onPassengerSelect 
}) => {

    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [passengers, setPassengers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'VIP_ONLY' | 'ON_ROUTE'

    // ========================================================================
    // 2. DATA FETCHING (The Omniscient Service Link)
    // ========================================================================
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        clientService.getPassengerDirectory()
            .then(res => {
                if (isMounted) setPassengers(res.data || []);
            })
            .catch(err => console.error("Matrix Fetch Error:", err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    // ========================================================================
    // 3. FILTERING & MACRO ANALYTICS ENGINE
    // ========================================================================
    
    // Live Client-Side Filtering
    const filteredPassengers = useMemo(() => {
        return passengers.filter(p => {
            // Text Search (Name, Phone, ID, Email)
            const query = searchQuery.toLowerCase();
            const matchesSearch = 
                p.name.toLowerCase().includes(query) || 
                p.formattedId.toLowerCase().includes(query) ||
                p.phone.includes(query) ||
                (p.email && p.email.toLowerCase().includes(query));

            // Tag Filters
            const matchesFilter = 
                activeFilter === 'ALL' || 
                (activeFilter === 'VIP_ONLY' && p.isVip) ||
                (activeFilter === 'ON_ROUTE' && p.activeStatus === 'ON_ROUTE');

            return matchesSearch && matchesFilter;
        });
    }, [passengers, searchQuery, activeFilter]);

    // Header Macro Analytics
    const metrics = useMemo(() => {
        return {
            total: passengers.length,
            vips: passengers.filter(p => p.isVip).length,
            inTransit: passengers.filter(p => p.activeStatus === 'ON_ROUTE' || p.activeStatus === 'BOARDING').length
        };
    }, [passengers]);

    // ========================================================================
    // 4. CSS GRID DEFINITION
    // ========================================================================
    // Must perfectly match the layout expected by PassengerRow.jsx
    const GRID_TEMPLATE = '2.5fr 2fr 1.5fr 1.2fr 2.5fr 60px';

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden'
        }}>
            
            {/* === A. MASTER HEADER & TELEMETRY === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '24px', background: 'var(--bg-surface)', zIndex: 20
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
                        <Users size={22} color="var(--brand-primary)" />
                        Master Passenger Registry
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Live LTV and transit telemetry for the AyaBus B2C ecosystem.
                    </p>
                </div>

                {/* Macro Telemetry Badges */}
                {!isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <TelemetryBadge 
                            icon={Crown} color="var(--brand-accent)" 
                            label="Active VIPs" value={metrics.vips} 
                        />
                        <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
                        <TelemetryBadge 
                            icon={BusFront} color="var(--brand-primary)" 
                            label="In Transit Now" value={metrics.inTransit} 
                        />
                        <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingLeft: '8px' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Network</span>
                            <span style={{ fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>{metrics.total}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* === B. FILTER & SEARCH STRIP === */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', 
                background: 'var(--bg-canvas)' 
            }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <FilterButton label="All Passengers" isActive={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
                    <FilterButton label="Sovereign / Platinum Only" isActive={activeFilter === 'VIP_ONLY'} onClick={() => setActiveFilter('VIP_ONLY')} color="var(--brand-accent)" icon={Crown} />
                    <FilterButton label="Currently On Route" isActive={activeFilter === 'ON_ROUTE'} onClick={() => setActiveFilter('ON_ROUTE')} color="var(--brand-primary)" icon={BusFront} />
                </div>
                
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                    background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search name, phone, or ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '220px', fontSize: '13px', color: 'var(--text-main)', fontWeight: '600' }}
                    />
                </div>
            </div>

            {/* === C. THE BI-DIRECTIONAL LEDGER VIEWPORT === */}
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)' }} className="ayabus-scroll-area">
                
                {/* The 1050px Anchor: Prevents UI crush on small screens */}
                <div style={{ minWidth: '1050px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    
                    {/* --- THE STICKY GRID HEADER --- */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                        padding: '16px 32px', background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <span style={{ paddingRight: '16px' }}>Passenger Identity</span>
                        <span style={{ paddingRight: '16px' }}>Secure Contact</span>
                        <span style={{ paddingRight: '16px' }}>Lifetime Value</span>
                        <span style={{ paddingRight: '16px' }}>Transit State</span>
                        <span style={{ paddingRight: '24px' }}>Active Route Context</span>
                        <span style={{ textAlign: 'right' }}>Action</span>
                    </div>

                    {/* --- THE SCROLLABLE DATA ROWS --- */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        {/* Loading State Skeleton */}
                        {isLoading && [1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: GRID_TEMPLATE, gap: '16px', alignItems: 'center' }}>
                                <div className="animate-pulse" style={{ height: '40px', background: 'var(--bg-input)', borderRadius: '12px' }} />
                                <div className="animate-pulse" style={{ height: '20px', background: 'var(--bg-input)', borderRadius: '6px' }} />
                                <div className="animate-pulse" style={{ height: '24px', background: 'var(--bg-input)', borderRadius: '100px', width: '80%' }} />
                                <div className="animate-pulse" style={{ height: '24px', background: 'var(--bg-input)', borderRadius: '100px' }} />
                                <div className="animate-pulse" style={{ height: '20px', background: 'var(--bg-input)', borderRadius: '6px' }} />
                                <div className="animate-pulse" style={{ height: '32px', background: 'var(--bg-input)', borderRadius: '8px', justifySelf: 'end', width: '32px' }} />
                            </div>
                        ))}

                        {/* Empty Search / Filter State */}
                        {!isLoading && filteredPassengers.length === 0 && (
                            <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <AlertCircle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>No Passengers Found</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Adjust your filters or search query.</span>
                            </div>
                        )}

                        {/* Live Data Injection */}
                        {!isLoading && filteredPassengers.map(pax => (
                            <PassengerRow 
                                key={pax.id} 
                                passenger={pax} 
                                gridTemplate={GRID_TEMPLATE}
                                onClick={onPassengerSelect} 
                            />
                        ))}

                    </div>
                </div>
            </div>

        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS (Visual Atoms)
// ========================================================================

const TelemetryBadge = ({ icon: Icon, color, label, value }) => (
    <div style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', 
        background: `color-mix(in srgb, ${color} 8%, transparent)`, 
        borderRadius: '12px', border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` 
    }}>
        <div style={{ color: color }}><Icon size={18} strokeWidth={2.5} /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </span>
            <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'monospace', lineHeight: '1.2' }}>
                {value}
            </span>
        </div>
    </div>
);

const FilterButton = ({ label, isActive, onClick, color = 'var(--text-main)', icon: Icon }) => (
    <button onClick={onClick} style={{
        padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: isActive ? `color-mix(in srgb, ${color} 10%, transparent)` : 'transparent',
        border: `1px solid ${isActive ? `color-mix(in srgb, ${color} 30%, transparent)` : 'var(--border-subtle)'}`,
        color: isActive ? color : 'var(--text-muted)', fontSize: '12px', fontWeight: isActive ? '900' : '700',
        display: 'flex', alignItems: 'center', gap: '8px', boxShadow: isActive ? `0 4px 12px color-mix(in srgb, ${color} 15%, transparent)` : 'none'
    }}>
        {Icon && <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />}
        {label}
    </button>
);

export default PassengerMatrix;
