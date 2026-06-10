import React, { useState } from 'react';
import { 
    Trophy, AlertTriangle, Building2, Map as MapIcon, 
    Activity, ChevronRight, Users, Route 
} from 'lucide-react';

/**
 * 👑 AYABUS APEX MATRIX (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: ApexMatrix.jsx
 * * DESCRIPTION:
 * Zone 2: The dynamic sorting engine. Instantly ranks the top and 
 * bottom performing entities (Operators and Routes) based on the 
 * aggregations from the Temporal Physics engine.
 */

const ApexMatrix = ({ matrixData, isLoading = false }) => {
    // State: Toggle between Operator Rankings and Route Rankings
    const [activeView, setActiveView] = useState('OPERATORS');

    // ========================================================================
    // 1. DATA EXTRACTION (Safeguarded)
    // ========================================================================
    const safeData = matrixData || {
        operators: { top: [], bottom: [] },
        routes: { congested: [], ghosts: [] }
    };

    // ========================================================================
    // 2. HELPER COMPONENTS (Visual Formatting)
    // ========================================================================
    
    // Renders the rank number with special styling for Top 3 (Gold, Silver, Bronze)
    const RankBadge = ({ rank, isBottom }) => {
        let bg = 'var(--bg-input)';
        let color = 'var(--text-muted)';

        if (!isBottom) {
            if (rank === 1) { bg = 'rgba(245, 158, 11, 0.15)'; color = '#f59e0b'; } // Gold
            else if (rank === 2) { bg = 'rgba(156, 163, 175, 0.15)'; color = '#9ca3af'; } // Silver
            else if (rank === 3) { bg = 'rgba(180, 83, 9, 0.15)'; color = '#b45309'; } // Bronze
            else { bg = 'var(--brand-primary-subtle)'; color = 'var(--brand-primary)'; }
        } else {
            // Bottom ranks are styled with danger/warning colors
            bg = rank === 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.05)';
            color = 'var(--status-danger)';
        }

        return (
            <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: bg, color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '900', flexShrink: 0
            }}>
                #{rank}
            </div>
        );
    };

    // Generates the mini-progress bar for reliability scoring
    const ReliabilityBar = ({ score }) => {
        const color = score >= 80 ? 'var(--status-success)' : (score >= 50 ? 'var(--status-warning)' : 'var(--status-danger)');
        return (
            <div style={{ width: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: '800', color: color, marginBottom: '2px' }}>
                    <span>PUNCTUALITY</span>
                    <span>{score}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '2px' }} />
                </div>
            </div>
        );
    };

    // ========================================================================
    // 3. SKELETON LOADER
    // ========================================================================
    if (isLoading) {
        return (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '24px', height: '100%' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '120px', height: '36px', background: 'var(--bg-input)', borderRadius: '12px', animation: 'pulse 1.5s infinite', opacity: 0.5 }} />
                    <div style={{ width: '120px', height: '36px', background: 'var(--bg-input)', borderRadius: '12px', animation: 'pulse 1.5s infinite', opacity: 0.5 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {[1, 2].map(col => (
                        <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3, 4, 5].map(row => (
                                <div key={row} style={{ height: '60px', background: 'var(--bg-input)', borderRadius: '12px', animation: 'pulse 1.5s infinite', opacity: 0.3 }} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ========================================================================
    // 4. MAIN RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ 
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)', overflow: 'hidden'
        }}>
            
            {/* --- HEADER & TOGGLES --- */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={20} color="var(--brand-primary)" />
                        The Apex Matrix
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        System-wide volume and reliability rankings.
                    </p>
                </div>

                {/* The View Switcher */}
                <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                    <button 
                        onClick={() => setActiveView('OPERATORS')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                            background: activeView === 'OPERATORS' ? 'var(--bg-surface)' : 'transparent',
                            color: activeView === 'OPERATORS' ? 'var(--text-main)' : 'var(--text-muted)',
                            fontWeight: '800', fontSize: '11px', cursor: 'pointer',
                            boxShadow: activeView === 'OPERATORS' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Building2 size={14} /> OPERATORS
                    </button>
                    <button 
                        onClick={() => setActiveView('ROUTES')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                            background: activeView === 'ROUTES' ? 'var(--bg-surface)' : 'transparent',
                            color: activeView === 'ROUTES' ? 'var(--text-main)' : 'var(--text-muted)',
                            fontWeight: '800', fontSize: '11px', cursor: 'pointer',
                            boxShadow: activeView === 'ROUTES' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Route size={14} /> ROUTES
                    </button>
                </div>
            </div>

            {/* --- THE DUAL-PANE MATRIX --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border-subtle)', flex: 1 }}>
                
                {/* LEFT PANE: THE LEADERS (Top 5) */}
                <div style={{ background: 'var(--bg-surface)', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--status-success)' }}>
                        <Trophy size={16} />
                        <span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>
                            APEX LEADERS
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(activeView === 'OPERATORS' ? safeData.operators.top : safeData.routes.congested).map((item, index) => (
                            <div key={index} style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 16px', background: 'var(--bg-canvas)', 
                                border: '1px solid var(--border-subtle)', borderRadius: '12px',
                                transition: 'transform 0.2s ease', cursor: 'default'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <RankBadge rank={index + 1} isBottom={false} />
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{item.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            <Users size={10} /> {new Intl.NumberFormat().format(item.volume)} Tickets
                                        </div>
                                    </div>
                                </div>
                                {activeView === 'OPERATORS' && <ReliabilityBar score={item.reliability} />}
                            </div>
                        ))}

                        {/* Empty State Fallback */}
                        {(activeView === 'OPERATORS' ? safeData.operators.top : safeData.routes.congested).length === 0 && (
                            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                                No data available for this timeframe.
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANE: THE LAGGARDS (Bottom 5) */}
                <div style={{ background: 'var(--bg-surface)', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--status-danger)' }}>
                        <AlertTriangle size={16} />
                        <span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>
                            SYSTEM LAGGARDS
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(activeView === 'OPERATORS' ? safeData.operators.bottom : safeData.routes.ghosts).map((item, index) => (
                            <div key={index} style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 16px', background: 'var(--bg-canvas)', 
                                border: '1px dashed rgba(239, 68, 68, 0.3)', borderRadius: '12px',
                                transition: 'transform 0.2s ease', cursor: 'default'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <RankBadge rank={index + 1} isBottom={true} />
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{item.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            <Users size={10} /> {new Intl.NumberFormat().format(item.volume)} Tickets
                                        </div>
                                    </div>
                                </div>
                                {activeView === 'OPERATORS' && <ReliabilityBar score={item.reliability} />}
                            </div>
                        ))}

                        {/* Empty State Fallback */}
                        {(activeView === 'OPERATORS' ? safeData.operators.bottom : safeData.routes.ghosts).length === 0 && (
                            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                                No data available for this timeframe.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ApexMatrix;