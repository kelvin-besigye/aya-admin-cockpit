import React, { useState, useMemo } from 'react';
import { 
    Flame, Map, Timer, TrendingUp, Gavel, 
    BusFront, ChevronRight, AlertOctagon, CheckCircle2, Search, Filter
} from 'lucide-react';

/**
 * 👑 SURGE EXCHANGE (Level 6: The Capacity Marketplace - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: SurgeExchange.jsx
 * * DESCRIPTION:
 * A live B2B marketplace board. Displays unfulfilled passenger demand (Surges)
 * and allows Partners to bid their idle fleet assets for premium yield splits.
 * * UPGRADES:
 * - Anti-Squish Ledger: 1050px minimum width lock protects the marketplace grid.
 * - Dynamic Demand Visualization: Heat-mapped tags for CRITICAL vs HIGH demand.
 * - Simulated Bidding Pane: Integrated UI for asset selection and yield preview.
 */

const SurgeExchange = ({ 
    partner, // The currently logged-in/viewed operator
    isLoading = false 
}) => {

    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH'
    const [selectedSurge, setSelectedSurge] = useState(null); // For the bidding slide-out

    // ========================================================================
    // 2. MOCK MARKETPLACE ENGINE (Pre-Backend Simulation)
    // ========================================================================
    const { activeSurges, metrics } = useMemo(() => {
        const mockSurges = [
            {
                id: 'SRG-EASTER-01',
                route: 'Kampala → Gulu',
                departure: 'Tomorrow, 14:00',
                demandLevel: 'CRITICAL',
                unfulfilledSeats: 145, // Passengers searching but finding no buses
                standardYield: 92,
                premiumYield: 85, // Operator keeps 85% instead of standard 92/8 split (Wait, operator keeps 85% vs 92%? No, operator normally keeps 92%, platform 8%. Let's say operator gets a BONUS. E.g., Platform fee drops to 2%, Operator gets 98%).
                platformFeeDrop: 6, // Platform drops fee from 8% to 2% to incentivize
                bidsActive: 3,
                timeRemaining: '02h 14m',
                status: 'OPEN'
            },
            {
                id: 'SRG-MARTYR-44',
                route: 'Kampala → Mbarara',
                departure: 'Friday, 18:30',
                demandLevel: 'CRITICAL',
                unfulfilledSeats: 210,
                platformFeeDrop: 8, // Platform takes 0% fee (Operator keeps 100%)
                bidsActive: 5,
                timeRemaining: '00h 45m',
                status: 'OPEN'
            },
            {
                id: 'SRG-WKD-99',
                route: 'Entebbe → Kampala',
                departure: 'Today, 20:00',
                demandLevel: 'HIGH',
                unfulfilledSeats: 55,
                platformFeeDrop: 3, // Platform drops fee to 5%
                bidsActive: 0,
                timeRemaining: '04h 30m',
                status: 'OPEN'
            },
            {
                id: 'SRG-WKD-102',
                route: 'Kampala → Mbale',
                departure: 'Tomorrow, 07:00',
                demandLevel: 'MEDIUM',
                unfulfilledSeats: 35,
                platformFeeDrop: 0, // Standard split, just a volume opportunity
                bidsActive: 1,
                timeRemaining: '12h 00m',
                status: 'OPEN'
            }
        ];

        return { 
            activeSurges: mockSurges,
            metrics: {
                totalOpen: mockSurges.length,
                criticalCount: mockSurges.filter(s => s.demandLevel === 'CRITICAL').length,
                totalUnfulfilled: mockSurges.reduce((acc, curr) => acc + curr.unfulfilledSeats, 0)
            }
        };
    }, []);

    // ========================================================================
    // 3. FILTERING ENGINE
    // ========================================================================
    const filteredSurges = useMemo(() => {
        return activeSurges.filter(s => {
            const matchesSearch = s.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  s.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'ALL' || s.demandLevel === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [activeSurges, searchQuery, activeFilter]);

    // ========================================================================
    // 4. CSS GRID DEFINITION (The Marketplace Board)
    // ========================================================================
    const GRID_TEMPLATE = '1.5fr 1.5fr 1.5fr 1fr 1fr 140px';

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '650px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden', position: 'relative'
        }}>
            
            {/* === A. MASTER HEADER === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '20px', background: 'var(--bg-surface)', zIndex: 20
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <Flame size={20} color="var(--status-danger)" fill="var(--status-danger)" />
                        Capacity Exchange (Surge Board)
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Live marketplace for high-demand, unfulfilled route requests.
                    </p>
                </div>

                {/* Macro Marketplace Stats */}
                {!isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Unfulfilled Demand
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                {metrics.totalUnfulfilled} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pax</span>
                            </span>
                        </div>
                        <div style={{ height: '32px', width: '1px', background: 'var(--border-subtle)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--status-danger)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Critical Routes
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--status-danger)', letterSpacing: '-0.5px' }}>
                                {metrics.criticalCount} Active
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* === B. FILTER STRIP === */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)' 
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <FilterButton label="All Surges" isActive={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
                    <FilterButton label="Critical Demand" isActive={activeFilter === 'CRITICAL'} onClick={() => setActiveFilter('CRITICAL')} color="var(--status-danger)" />
                    <FilterButton label="High Demand" isActive={activeFilter === 'HIGH'} onClick={() => setActiveFilter('HIGH')} color="var(--status-warning)" />
                </div>
                
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                    background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-subtle)'
                }}>
                    <Search size={14} color="var(--text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search routes..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '150px', fontSize: '13px', color: 'var(--text-main)' }}
                    />
                </div>
            </div>

            {/* === C. BI-DIRECTIONAL LEDGER VIEWPORT === */}
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)', position: 'relative' }} className="ayabus-scroll-area">
                
                {/* The 1050px Anchor: Prevents marketplace text from squishing on mobile */}
                <div style={{ minWidth: '1050px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    
                    {/* Sticky Ledger Header */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                        padding: '12px 32px', background: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <span style={{ paddingRight: '16px' }}>Surge Route & ID</span>
                        <span style={{ paddingRight: '16px' }}>Target Departure</span>
                        <span style={{ paddingRight: '16px' }}>Demand Index</span>
                        <span style={{ paddingRight: '16px' }}>Yield Incentive</span>
                        <span style={{ paddingRight: '16px' }}>Time Remaining</span>
                        <span style={{ textAlign: 'right' }}>Action</span>
                    </div>

                    {/* Scrollable Data Rows */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        {isLoading && [1, 2, 3].map(i => (
                            <div key={i} style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div className="animate-pulse" style={{ height: '48px', background: 'var(--bg-input)', borderRadius: '12px' }} />
                            </div>
                        ))}

                        {!isLoading && filteredSurges.length === 0 && (
                            <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <CheckCircle2 size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>Network is Balanced</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>No active capacity surges detected.</span>
                            </div>
                        )}

                        {!isLoading && filteredSurges.map(surge => (
                            <SurgeRow 
                                key={surge.id} 
                                surge={surge} 
                                gridTemplate={GRID_TEMPLATE} 
                                onBidClick={() => setSelectedSurge(surge)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* === D. SIMULATED BIDDING PANEL (Overlay) === */}
            {selectedSurge && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'color-mix(in srgb, var(--bg-surface) 60%, transparent)',
                    backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', justifyContent: 'flex-end'
                }}>
                    <div style={{
                        width: '400px', height: '100%', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
                        boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
                        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>Submit Asset Bid</h3>
                            <button onClick={() => setSelectedSurge(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
                            {/* Target Route Summary */}
                            <div style={{ background: 'var(--bg-canvas)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>Target Route</div>
                                <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>{selectedSurge.route}</div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedSurge.departure}</div>
                            </div>

                            {/* Incentive Preview */}
                            {selectedSurge.platformFeeDrop > 0 && (
                                <div style={{ background: 'color-mix(in srgb, var(--status-success) 10%, transparent)', borderRadius: '12px', padding: '16px', border: '1px solid color-mix(in srgb, var(--status-success) 30%, transparent)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-success)' }}>
                                        <TrendingUp size={16} />
                                        <span style={{ fontSize: '14px', fontWeight: '800' }}>Platform Fee Reduced by {selectedSurge.platformFeeDrop}%</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: '600', marginTop: '8px' }}>
                                        You will retain {(92 + selectedSurge.platformFeeDrop)}% of Gross Ticket Revenue for this dispatch.
                                    </div>
                                </div>
                            )}

                            {/* Asset Selection Simulator */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>Select Idle Asset</label>
                                <select style={{ 
                                    padding: '12px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-main)', fontSize: '14px', fontWeight: '600', outline: 'none', cursor: 'pointer'
                                }}>
                                    <option value="">-- Choose available bus --</option>
                                    <option value="UBL-882A">UBL-882A (65 Pax - VIP Config)</option>
                                    <option value="UBM-104K">UBM-104K (45 Pax - Standard)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)' }}>
                            <button style={{
                                width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--brand-primary)',
                                color: '#fff', fontSize: '14px', fontWeight: '900', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: '0 4px 12px color-mix(in srgb, var(--brand-primary) 40%, transparent)'
                            }}>
                                <Gavel size={18} strokeWidth={2.5} /> Lock In Asset
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const FilterButton = ({ label, isActive, onClick, color = 'var(--text-main)' }) => (
    <button onClick={onClick} style={{
        padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: isActive ? `color-mix(in srgb, ${color} 10%, transparent)` : 'transparent',
        border: `1px solid ${isActive ? `color-mix(in srgb, ${color} 30%, transparent)` : 'transparent'}`,
        color: isActive ? color : 'var(--text-muted)', fontSize: '11px', fontWeight: isActive ? '900' : '700',
        display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px', textTransform: 'uppercase'
    }}>
        {label}
    </button>
);

const SurgeRow = ({ surge, gridTemplate, onBidClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Demand Styling
    const demandConfig = useMemo(() => {
        switch(surge.demandLevel) {
            case 'CRITICAL': return { color: 'var(--status-danger)', icon: AlertOctagon };
            case 'HIGH': return { color: 'var(--status-warning)', icon: Flame };
            default: return { color: 'var(--brand-primary)', icon: TrendingUp };
        }
    }, [surge.demandLevel]);
    const DemandIcon = demandConfig.icon;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center',
                padding: '20px 32px', background: isHovered ? 'var(--bg-hover)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)', transition: 'all 0.15s ease', position: 'relative'
            }}
        >
            {/* Critical Edge Highlight */}
            {surge.demandLevel === 'CRITICAL' && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--status-danger)' }} />
            )}

            {/* Col 1: Route & ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Map size={14} color="var(--brand-primary)" />
                    <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {surge.route}
                    </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)', paddingLeft: '22px' }}>
                    {surge.id}
                </span>
            </div>

            {/* Col 2: Target Departure */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, paddingRight: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {surge.departure}
                </span>
            </div>

            {/* Col 3: Demand Index */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px', alignItems: 'flex-start' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '6px',
                    background: `color-mix(in srgb, ${demandConfig.color} 10%, transparent)`, color: demandConfig.color,
                    fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                    <DemandIcon size={12} strokeWidth={2.5} />
                    {surge.demandLevel}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    {surge.unfulfilledSeats} Pax Waiting
                </span>
            </div>

            {/* Col 4: Yield Incentive */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, paddingRight: '16px' }}>
                {surge.platformFeeDrop > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--status-success)' }}>
                            +{(surge.platformFeeDrop)}% Yield Bonus
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Platform Fee Waived
                        </span>
                    </div>
                ) : (
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Standard Split</span>
                )}
            </div>

            {/* Col 5: Time Remaining & Competition */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Timer size={14} color={surge.demandLevel === 'CRITICAL' ? 'var(--status-danger)' : 'var(--text-main)'} />
                    <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', color: surge.demandLevel === 'CRITICAL' ? 'var(--status-danger)' : 'var(--text-main)' }}>
                        {surge.timeRemaining}
                    </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: surge.bidsActive > 0 ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                    {surge.bidsActive} Bids Active
                </span>
            </div>

            {/* Col 6: Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button 
                    onClick={onBidClick}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px',
                        background: isHovered ? 'var(--text-main)' : 'var(--bg-input)', color: isHovered ? 'var(--bg-canvas)' : 'var(--text-main)',
                        border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '800', transition: 'all 0.2s ease',
                        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <BusFront size={14} /> Bid Asset
                </button>
            </div>
        </div>
    );
};

export default SurgeExchange;