import React, { useState, useEffect, useMemo } from 'react';
import { 
    BusFront, Map, Wrench, Activity, ChevronRight, 
    LayoutTemplate, AlertCircle, CheckCircle2 
} from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { partnerService } from '../../data/partner.service';

/**
 * 👑 ASSET REGISTRY (Level 5: The Micro Asset View - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: AssetRegistry.jsx
 * * DESCRIPTION:
 * A high-performance, strictly aligned ledger tracking the physical fleet 
 * belonging to a specific operator. Visualizes live deployment, cabin 
 * configurations, and predictive maintenance health.
 * * UPGRADES:
 * - Bi-Directional Viewport: Safely houses the 1050px strict-width rows.
 * - Glassmorphism Sticky Header: Table headers remain pinned during vertical scroll.
 * - Predictive Maintenance Engine: Auto-flags buses overdue for servicing.
 */

const AssetRegistry = ({ partner }) => {

    // ========================================================================
    // 1. STATE & DATA FETCHING
    // ========================================================================
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!partner?.id) return;
        
        let isMounted = true;
        setIsLoading(true);

        // Fetch the specific physical fleet for this partner
        partnerService.getAssetRegistry(partner.id)
            .then(data => {
                if (isMounted) setAssets(data || []);
            })
            .catch(err => console.error("Asset Fetch Error:", err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [partner?.id]);

    // ========================================================================
    // 2. FLEET HEALTH MATH
    // ========================================================================
    const { activeCount, totalCount, activePercentage } = useMemo(() => {
        if (!assets.length) return { activeCount: 0, totalCount: 0, activePercentage: 0 };
        const active = assets.filter(a => a.status === 'ON_ROUTE').length;
        const total = assets.length;
        return { 
            activeCount: active, 
            totalCount: total, 
            activePercentage: Math.round((active / total) * 100) 
        };
    }, [assets]);

    // ========================================================================
    // 3. CSS GRID DEFINITION
    // ========================================================================
    // STRICT SYNC: Must perfectly match the gridTemplateColumns in AssetRow
    const GRID_TEMPLATE = '1.5fr 1.5fr 1.5fr 2fr 1.5fr 40px';

    // ========================================================================
    // 4. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '420px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden' // Keeps children bound to the 24px border radius
        }}>
            
            {/* === A. MASTER HEADER === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '20px', background: 'var(--bg-surface)', zIndex: 20
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <BusFront size={20} color="var(--brand-primary)" />
                        Physical Fleet Registry
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Live deployment status and chassis telemetry.
                    </p>
                </div>

                {/* Fleet Utilization Metric */}
                {!isLoading && totalCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Fleet Utilization
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: activePercentage > 50 ? 'var(--status-success)' : 'var(--status-warning)', letterSpacing: '-0.5px' }}>
                                {activePercentage}%
                            </span>
                        </div>
                        <div style={{ height: '32px', width: '1px', background: 'var(--border-subtle)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Active Units
                            </span>
                            <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                {activeCount} <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>/ {totalCount}</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* === B. BI-DIRECTIONAL SCROLL VIEWPORT === */}
            <div style={{ flex: 1, overflow: 'auto' }} className="ayabus-scroll-area">
                
                {/* The 1050px Anchor: Forces horizontal scroll if screen is too small */}
                <div style={{ minWidth: '1050px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    
                    {/* --- THE STICKY GRID HEADER --- */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                        padding: '12px 24px', background: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <span style={{ paddingRight: '16px' }}>Asset ID (Plate)</span>
                        <span style={{ paddingRight: '16px' }}>Cabin DNA</span>
                        <span style={{ paddingRight: '16px' }}>Telemetry Status</span>
                        <span style={{ paddingRight: '24px' }}>Current Deployment</span>
                        <span style={{ paddingRight: '16px' }}>Maintenance Health</span>
                        <span>{/* Action */}</span>
                    </div>

                    {/* --- THE SCROLLABLE DATA ROWS --- */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        
                        {/* Loading State */}
                        {isLoading && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <div className="animate-pulse" style={{ height: '24px', background: 'var(--bg-input)', borderRadius: '8px', width: '100%' }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && assets.length === 0 && (
                            <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <BusFront size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>No Assets Registered</span>
                                <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>This operator has no physical buses in the system.</span>
                            </div>
                        )}

                        {/* Live Data Injection */}
                        {!isLoading && assets.map((asset, index) => (
                            <AssetRow key={asset.busId || index} asset={asset} gridTemplate={GRID_TEMPLATE} />
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

// ========================================================================
// 5. SUB-COMPONENT: ASSET ROW (The Uncrushable Grid Atom)
// ========================================================================
const AssetRow = ({ asset, gridTemplate }) => {
    const [isHovered, setIsHovered] = useState(false);

    // --- STATUS RESOLVER ---
    const getStatusConfig = (status) => {
        switch(status) {
            case 'ON_ROUTE': return { label: 'On Route', color: 'var(--status-success)', icon: Activity };
            case 'GARAGE': return { label: 'In Garage', color: 'var(--status-danger)', icon: Wrench };
            case 'IDLE': 
            default: return { label: 'Idle / Parked', color: 'var(--text-muted)', icon: BusFront };
        }
    };
    const statusConfig = getStatusConfig(asset.status);
    const StatusIcon = statusConfig.icon;

    // --- MAINTENANCE MATH ---
    // Calculate days since last service to predict breakdowns
    const { maintColor, maintText, maintIcon: MaintIcon } = useMemo(() => {
        if (!asset.lastMaintenance) return { maintColor: 'var(--text-muted)', maintText: 'Unknown', maintIcon: AlertCircle };
        
        const lastDate = new Date(asset.lastMaintenance);
        const diffDays = Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 90) return { maintColor: 'var(--status-danger)', maintText: `${diffDays} days ago (Overdue)`, maintIcon: AlertCircle };
        if (diffDays > 60) return { maintColor: 'var(--status-warning)', maintText: `${diffDays} days ago (Due Soon)`, maintIcon: AlertCircle };
        return { maintColor: 'var(--status-success)', maintText: `${diffDays} days ago (Healthy)`, maintIcon: CheckCircle2 };
    }, [asset.lastMaintenance]);

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center',
                padding: '16px 24px', background: isHovered ? 'var(--bg-hover)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer',
                transition: 'all 0.15s ease', position: 'relative'
            }}
        >
            {/* Hover Highlight */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: isHovered ? 'var(--brand-primary)' : 'transparent',
                transition: 'background 0.2s ease', borderTopRightRadius: '4px', borderBottomRightRadius: '4px'
            }} />

            {/* Col 1: Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{ 
                    padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-canvas)', fontSize: '13px', fontWeight: '900', 
                    fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '0.5px'
                }}>
                    {asset.busId}
                </div>
            </div>

            {/* Col 2: Cabin DNA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, paddingRight: '16px' }}>
                <LayoutTemplate size={14} color="var(--brand-primary)" />
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                    {asset.chassis || 'UNREGISTERED'}
                </span>
            </div>

            {/* Col 3: Telemetry Status */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, paddingRight: '16px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '100px',
                    background: `color-mix(in srgb, ${statusConfig.color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${statusConfig.color} 20%, transparent)`,
                    color: statusConfig.color, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'
                }}>
                    <StatusIcon size={12} strokeWidth={2.5} />
                    {statusConfig.label}
                </div>
            </div>

            {/* Col 4: Deployment Route */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, paddingRight: '24px' }}>
                <Map size={14} color={asset.currentRoute ? 'var(--text-main)' : 'var(--text-muted)'} />
                <span style={{ 
                    fontSize: '13px', fontWeight: '700', 
                    color: asset.currentRoute ? 'var(--text-main)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                    {asset.currentRoute || 'Awaiting Dispatch'}
                </span>
            </div>

            {/* Col 5: Maintenance Math */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, paddingRight: '16px' }}>
                <MaintIcon size={14} color={maintColor} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: maintColor }}>
                    {maintText}
                </span>
            </div>

            {/* Col 6: Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <ChevronRight size={18} color={isHovered ? 'var(--brand-primary)' : 'var(--border-subtle)'} style={{ transform: isHovered ? 'translateX(2px)' : 'translateX(0)', transition: 'all 0.2s ease' }} />
            </div>
        </div>
    );
};

export default AssetRegistry;