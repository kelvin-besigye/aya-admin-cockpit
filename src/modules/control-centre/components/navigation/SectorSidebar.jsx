import React, { useState } from 'react';
import { 
    Smartphone, FileText, Banknote, Activity, 
    Briefcase, Zap, Server, ShieldCheck, AlertCircle 
} from 'lucide-react';

import { CONTROL_SECTORS } from '../../data/control.constants';

/**
 * 👑 AYA BUS OS HARDWARE: Sector Sidebar (Level 3: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SectorSidebar.jsx
 * * DESCRIPTION:
 * The vertical routing engine for the Control Centre. Maps the 8 Sovereign 
 * Sectors into a cognitive, high-density navigation layout.
 * * UPGRADES (Zero-Trust Edition):
 * - Unsaved State Indicators: Visually tracks sectors with pending configuration diffs.
 * - Dynamic Icon Engine: Maps NoSQL string icons to live SVG hardware.
 * - Pure State Physics: 100% React state-driven hover effects (Zero DOM mutation).
 * - Immersive Typography: Micro-descriptions guide L9 Admins without visual clutter.
 */

// ========================================================================
// 1. DYNAMIC ICON ENGINE
// ========================================================================
const ICON_MAP = {
    'Smartphone': Smartphone,
    'FileText': FileText,
    'Banknote': Banknote,
    'Activity': Activity,
    'Briefcase': Briefcase,
    'Zap': Zap,
    'Server': Server,
    'ShieldCheck': ShieldCheck
};

const SectorSidebar = ({ 
    activeSector, 
    onSelectSector, 
    unsavedSectors = [] // Array of sector IDs that have uncommitted changes
}) => {
    // ========================================================================
    // 2. STATE PHYSICS
    // ========================================================================
    const [hoveredSector, setHoveredSector] = useState(null);

    // ========================================================================
    // 3. RENDER ENGINE
    // ========================================================================
    return (
        <aside style={{
            width: '280px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border-subtle)',
            flexShrink: 0,
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            
            {/* INJECT CSS FOR THE UNSAVED PULSE */}
            <style>
                {`
                    @keyframes amberPulse {
                        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-warning) 60%, transparent); }
                        70% { box-shadow: 0 0 0 6px transparent; }
                        100% { box-shadow: 0 0 0 0 transparent; }
                    }
                    /* Custom Scrollbar for the Sidebar */
                    .sovereign-sidebar-scroll::-webkit-scrollbar { width: 4px; }
                    .sovereign-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                    .sovereign-sidebar-scroll::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
                    .sovereign-sidebar-scroll:hover::-webkit-scrollbar-thumb { background: var(--text-muted); }
                `}
            </style>

            <div className="sovereign-sidebar-scroll" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {/* Header / Title Area */}
                <div style={{ padding: '0 12px 16px 12px', marginBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                        Ecosystem Sectors
                    </h2>
                </div>

                {/* Generate Navigation Links from the Frozen Constants */}
                {Object.values(CONTROL_SECTORS).map((sector) => {
                    const isActive = activeSector === sector.id;
                    const isHovered = hoveredSector === sector.id;
                    const hasUnsavedChanges = unsavedSectors.includes(sector.id);
                    const SectorIcon = ICON_MAP[sector.icon] || AlertCircle;

                    // Dynamic Styling Logic
                    let bgStyle = 'transparent';
                    let textStyle = 'var(--text-main)';
                    let iconStyle = 'var(--text-muted)';

                    if (isActive) {
                        bgStyle = 'color-mix(in srgb, var(--brand-primary) 10%, transparent)';
                        textStyle = 'var(--brand-primary)';
                        iconStyle = 'var(--brand-primary)';
                    } else if (isHovered) {
                        bgStyle = 'var(--bg-hover)';
                    }

                    return (
                        <button
                            key={sector.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onSelectSector(sector.id)}
                            onMouseEnter={() => setHoveredSector(sector.id)}
                            onMouseLeave={() => setHoveredSector(null)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '14px',
                                padding: '14px',
                                background: bgStyle,
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                position: 'relative'
                            }}
                        >
                            {/* Active Sector Left-Border Indicator */}
                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    height: '60%',
                                    width: '4px',
                                    background: 'var(--brand-primary)',
                                    borderTopRightRadius: '4px',
                                    borderBottomRightRadius: '4px'
                                }} />
                            )}

                            {/* The Hardware Icon */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                marginTop: '2px', // Slight offset to align with double-line text
                                color: iconStyle,
                                transition: 'color 0.2s ease'
                            }}>
                                <SectorIcon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {/* The Cognitive Text Block */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px', overflow: 'hidden' }}>
                                <span style={{ 
                                    fontSize: '14px', 
                                    fontWeight: isActive ? '900' : '700', 
                                    color: textStyle,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    transition: 'color 0.2s ease'
                                }}>
                                    {sector.label}
                                </span>
                                <span style={{ 
                                    fontSize: '11px', 
                                    fontWeight: '600', 
                                    color: 'var(--text-muted)', 
                                    lineHeight: '1.4',
                                    opacity: isActive ? 0.9 : 0.6
                                }}>
                                    {sector.desc}
                                </span>
                            </div>

                            {/* Unsaved Changes Indicator (Amber Pulse) */}
                            {hasUnsavedChanges && (
                                <div 
                                    title="Unsaved Changes in this Sector"
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--status-warning)',
                                        animation: 'amberPulse 2s infinite',
                                        flexShrink: 0,
                                        marginTop: '6px'
                                    }} 
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default SectorSidebar;