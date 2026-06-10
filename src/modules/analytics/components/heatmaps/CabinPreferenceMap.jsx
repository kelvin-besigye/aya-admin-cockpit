import React, { useState, useMemo } from 'react';
import { 
    Flame, ShieldAlert, Layers, Columns, 
    ArrowDownToLine, MoveHorizontal, SplitSquareHorizontal, Crown 
} from 'lucide-react';

/**
 * 👑 AYABUS CABIN PREFERENCE MAP (True Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: CabinPreferenceMap.jsx
 * * DESCRIPTION:
 * Zone 5: A Universal Chassis Engine that visualizes seating gravity.
 * Uses a mathematical string parser to dynamically generate ANY bus 
 * layout on the fly. 
 * * UPGRADES: 
 * 1. Accurately reflects Ugandan Right-Hand Drive (RHD) physics.
 * 2. Implements "Royal/Golden" styling for the premium 'M' bench seat,
 * blending the custom colors seamlessly with the heat matrix opacity.
 */

// ========================================================================
// 1. THE UNIVERSAL CHASSIS DEFINITIONS
// ========================================================================
const MARKET_CLASSES = [
    { id: 'STANDARD', label: 'Standard (2x3)', layoutString: 'L2-R3-BENCH', rows: 12 }, 
    { id: 'EXECUTIVE', label: 'Executive (2x2)', layoutString: 'L2-R2-BENCH', rows: 11 },
    { id: 'VIP', label: 'VIP (1x2)', layoutString: 'L1-R2-BENCH', rows: 9 },
];

const CabinPreferenceMap = ({ gravityData, isLoading = false }) => {

    const [activeClass, setActiveClass] = useState('STANDARD');
    const safeGravity = gravityData || { rawCounts: {}, heatMatrix: {} };

    // ========================================================================
    // 2. THE UNIVERSAL GRID PARSER
    // ========================================================================
    const activeLayout = useMemo(() => {
        const config = MARKET_CLASSES.find(c => c.id === activeClass);
        const parts = config.layoutString.split('-');
        
        let leftCols = 0, rightCols = 0, hasBench = false;
        
        parts.forEach(p => {
            if (p.startsWith('L')) leftCols = parseInt(p.replace('L', ''), 10);
            if (p.startsWith('R')) rightCols = parseInt(p.replace('R', ''), 10);
            if (p === 'BENCH') hasBench = true;
        });

        const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let cols = [];
        let currentIndex = 0;

        for (let i = 0; i < leftCols; i++) { cols.push(ALPHABET[currentIndex]); currentIndex++; }
        cols.push('aisle');
        for (let i = 0; i < rightCols; i++) { cols.push(ALPHABET[currentIndex]); currentIndex++; }

        let bench = [];
        if (hasBench) {
            let benchIndex = 0;
            for (let i = 0; i < leftCols; i++) { bench.push(ALPHABET[benchIndex]); benchIndex++; }
            bench.push('M'); // The Royal Seat
            for (let i = 0; i < rightCols; i++) { bench.push(ALPHABET[benchIndex]); benchIndex++; }
        }

        return { rows: config.rows, cols, bench, hasBench, leftCols, rightCols };
    }, [activeClass]);

    // ========================================================================
    // 3. THE LAW OF AVERAGES (Dynamic Zonal Physics)
    // ========================================================================
    const zonalAverages = useMemo(() => {
        let stats = {
            windowTotal: 0, windowCount: 0,
            aisleTotal: 0, aisleCount: 0,
            frontTotal: 0, frontCount: 0,
            rearTotal: 0, rearCount: 0
        };

        const validCols = activeLayout.cols.filter(c => c !== 'aisle');
        const windowCols = [validCols[0], validCols[validCols.length - 1]];

        for (let r = 1; r <= activeLayout.rows + (activeLayout.hasBench ? 1 : 0); r++) {
            const isBench = activeLayout.hasBench && r === activeLayout.rows + 1;
            const targetCols = isBench ? activeLayout.bench : validCols;

            targetCols.forEach(col => {
                const seatId = `${r}${col}`;
                const heat = safeGravity.heatMatrix[seatId] || 0;

                if (windowCols.includes(col) || (isBench && (col === activeLayout.bench[0] || col === activeLayout.bench[activeLayout.bench.length-1]))) {
                    stats.windowTotal += heat; stats.windowCount++;
                } else {
                    stats.aisleTotal += heat; stats.aisleCount++;
                }

                if (r <= Math.ceil(activeLayout.rows / 2)) {
                    stats.frontTotal += heat; stats.frontCount++;
                } else {
                    stats.rearTotal += heat; stats.rearCount++;
                }
            });
        }

        return {
            windowAvg: stats.windowCount > 0 ? (stats.windowTotal / stats.windowCount) : 0,
            aisleAvg: stats.aisleCount > 0 ? (stats.aisleTotal / stats.aisleCount) : 0,
            frontAvg: stats.frontCount > 0 ? (stats.frontTotal / stats.frontCount) : 0,
            rearAvg: stats.rearCount > 0 ? (stats.rearTotal / stats.rearCount) : 0,
        };
    }, [activeLayout, safeGravity]);

    // ========================================================================
    // 4. THE MICRO-RENDERER (With Royal M-Seat Logic)
    // ========================================================================
    const Seat = ({ id, label }) => {
        const heat = safeGravity.heatMatrix[id] || 0; 
        const rawVol = safeGravity.rawCounts[id] || 0;
        
        const heatOpacity = Math.max(heat, 0.05);
        const isHighHeat = heat > 0.6;
        const isMSeat = label.startsWith('M');

        return (
            <div 
                className="seat-wrapper" 
                style={{ position: 'relative', zIndex: 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.zIndex = 10; }}
                onMouseLeave={(e) => { e.currentTarget.style.zIndex = 1; }}
            >
                {/* The CSS classes handle the light/dark mode color switching, 
                  while inline variables pass the exact heat math to the CSS. 
                */}
                <div 
                    className={`seat-box ${isMSeat ? 'seat-m' : ''} ${isHighHeat ? 'high-heat' : ''}`}
                    style={{ '--heat-opacity': heatOpacity }}
                >
                    {label}
                </div>

                <div className="seat-tooltip">
                    <span className={isMSeat ? 'm-tooltip-label' : ''} style={{ color: 'var(--brand-primary)', marginBottom: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isMSeat && <Crown size={14} strokeWidth={2.5} />}
                        SEAT {id}
                    </span>
                    <span style={{ fontSize: '11px' }}>{new Intl.NumberFormat().format(rawVol)} Tickets</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '9px', marginTop: '4px', fontWeight: '600' }}>
                        {(heat * 100).toFixed(1)}% Gravity Index
                    </span>
                </div>
            </div>
        );
    };

    // ========================================================================
    // 5. SKELETON LOADER
    // ========================================================================
    if (isLoading) {
        return (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '32px', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '250px', height: '80%', background: 'var(--bg-input)', borderRadius: '24px', animation: 'pulse 1.5s infinite', opacity: 0.3 }} />
            </div>
        );
    }

    // ========================================================================
    // 6. MAIN RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{ 
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
            borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
            {/* --- A. HEADER & DYNAMIC TOGGLES --- */}
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Flame size={20} color="var(--status-danger)" />
                            Cabin Gravity & Zonal Physics
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Macro spatial analysis. Select a market layout to re-calculate physics.
                        </p>
                    </div>

                    {/* The Market Class Selector */}
                    <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        {MARKET_CLASSES.map(config => (
                            <button
                                key={config.id}
                                onClick={() => setActiveClass(config.id)}
                                style={{
                                    padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: activeClass === config.id ? 'var(--bg-surface)' : 'transparent',
                                    color: activeClass === config.id ? 'var(--text-main)' : 'var(--text-muted)',
                                    fontWeight: '800', fontSize: '11px', textTransform: 'uppercase',
                                    boxShadow: activeClass === config.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Layers size={14} />
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- B. THE LAW OF AVERAGES (Intelligence Panel) --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px' }}>
                    
                    {/* Window vs Aisle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-canvas)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Columns size={18} color="var(--brand-primary)" />
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Preference Index</div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Window vs Aisle</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: zonalAverages.windowAvg >= zonalAverages.aisleAvg ? 'var(--status-danger)' : 'var(--text-main)' }}>
                                {(zonalAverages.windowAvg * 100).toFixed(1)}% <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>WIN</span>
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: zonalAverages.aisleAvg > zonalAverages.windowAvg ? 'var(--status-danger)' : 'var(--text-main)' }}>
                                {(zonalAverages.aisleAvg * 100).toFixed(1)}% <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>AIS</span>
                            </div>
                        </div>
                    </div>

                    {/* Front vs Rear */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-canvas)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <SplitSquareHorizontal size={18} color="var(--brand-accent)" />
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Zonal Gravity</div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Front vs Rear</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: zonalAverages.frontAvg >= zonalAverages.rearAvg ? 'var(--status-danger)' : 'var(--text-main)' }}>
                                {(zonalAverages.frontAvg * 100).toFixed(1)}% <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>FRN</span>
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: zonalAverages.rearAvg > zonalAverages.frontAvg ? 'var(--status-danger)' : 'var(--text-main)' }}>
                                {(zonalAverages.rearAvg * 100).toFixed(1)}% <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>RER</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- C. THE DYNAMIC CHASSIS RENDERER --- */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-canvas)', padding: '40px', position: 'relative' }}>
                
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--text-main) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <div style={{ 
                    border: '4px solid var(--border-subtle)', borderRadius: '48px 48px 16px 16px', 
                    padding: '24px 32px', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05), inset 0 10px 30px rgba(0,0,0,0.02)',
                    zIndex: 2
                }}>
                    
                    {/* The Cockpit (RHD Accurate: Entry Left, Driver Right) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '2px dashed var(--border-subtle)', marginBottom: '8px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'var(--bg-input)', borderRadius: '6px' }}>
                            <ArrowDownToLine size={12} /> ENTRY
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--status-warning)', textTransform: 'uppercase' }}>Driver</span>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '16px', height: '16px', background: 'var(--border-subtle)', borderRadius: '50%' }} />
                            </div>
                        </div>
                    </div>

                    {/* The Dynamic Row Generator */}
                    {Array.from({ length: activeLayout.rows }, (_, i) => i + 1).map(row => (
                        <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                            {activeLayout.cols.map((col, idx) => {
                                if (col === 'aisle') {
                                    return (
                                        <div key={idx} style={{ width: '40px', display: 'flex', justifyContent: 'center', color: 'var(--border-subtle)' }}>
                                            <MoveHorizontal size={16} style={{ opacity: 0.3 }} />
                                        </div>
                                    );
                                }
                                return <Seat key={idx} id={`${row}${col}`} label={col} />;
                            })}
                        </div>
                    ))}

                    {/* The Dynamic Back Bench */}
                    {activeLayout.hasBench && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '2px solid var(--border-subtle)', justifyContent: 'center' }}>
                            {activeLayout.bench.map((col, idx) => (
                                <Seat key={idx} id={`${activeLayout.rows + 1}${col}`} label={col.replace(/[0-9]/g, '')} />
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* --- THE SOVEREIGN CSS ENGINE --- */}
            <style>{`
                /* Standard Seat Physics */
                .seat-box {
                    width: 38px; height: 38px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 11px; font-weight: 900;
                    border: 1px solid var(--border-subtle);
                    background: rgba(239, 68, 68, var(--heat-opacity));
                    color: var(--text-main);
                    cursor: crosshair; 
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .seat-box:hover {
                    transform: scale(1.15);
                }
                .seat-box.high-heat {
                    color: #FFF;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                /* THE ROYAL M-SEAT (Light Mode Default: Royal Blue) */
                .seat-box.seat-m {
                    border: 2px solid #2563EB;
                    background: rgba(37, 99, 235, var(--heat-opacity));
                    color: #2563EB;
                }
                .seat-box.seat-m.high-heat {
                    color: #FFF;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
                }
                .m-tooltip-label {
                    color: #2563EB !important;
                }

                /* THE GOLDEN M-SEAT (Dark Mode: Golden Yellow) */
                body.dark-mode .seat-box.seat-m {
                    border: 2px solid #FBBF24;
                    background: rgba(251, 191, 36, var(--heat-opacity));
                    color: #FBBF24;
                }
                body.dark-mode .seat-box.seat-m.high-heat {
                    color: #000;
                    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
                }
                body.dark-mode .m-tooltip-label {
                    color: #FBBF24 !important;
                }

                /* Tooltip Mechanics */
                .seat-tooltip {
                    position: absolute; left: 50%; transform: translateX(-50%);
                    background: var(--text-main); color: var(--bg-canvas);
                    padding: 8px 12px; border-radius: 8px; font-size: 10px; font-weight: 800;
                    pointer-events: none; white-space: nowrap; 
                    display: flex; flex-direction: column; align-items: center;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    opacity: 0; bottom: 100%; transition: all 0.2s ease;
                }
                .seat-wrapper:hover .seat-tooltip { 
                    opacity: 1 !important; 
                    bottom: 130% !important; 
                }
            `}</style>
        </div>
    );
};

export default CabinPreferenceMap;
