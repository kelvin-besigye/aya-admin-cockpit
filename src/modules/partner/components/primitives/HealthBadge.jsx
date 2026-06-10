 import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

/**
 * 👑 HEALTH BADGE (Level 2: Visual Primitive - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: HealthBadge.jsx
 * * DESCRIPTION:
 * A high-fidelity, dynamic SVG progress ring that visualizes a partner's 
 * Algorithmic Health Score (0-100). 
 * * UPGRADES:
 * - Fluid SVG Scaling: Uses a responsive viewBox so it can be 16px in a table 
 * or 200px in a profile without losing crispness.
 * - Semantic Color Engine: Automatically maps to the Partner Tier color logic.
 * - Dark Mode Sync: Uses pure CSS `color-mix` for perfect background blending.
 */

const HealthBadge = ({ 
    score = 0, 
    trend = 'flat', // 'up' | 'down' | 'flat'
    size = 'md',    // 'sm' (table row) | 'md' (standard) | 'lg' (profile hero)
    showLabel = false, 
    isLoading = false 
}) => {

    // ========================================================================
    // 1. CONFIGURATION & SCALING ENGINE
    // ========================================================================
    const dimensions = useMemo(() => {
        switch(size) {
            case 'sm': return { width: 32, stroke: 3, font: '10px', icon: 10 };
            case 'lg': return { width: 84, stroke: 4, font: '24px', icon: 20 };
            case 'md': 
            default: return { width: 48, stroke: 3.5, font: '14px', icon: 14 };
        }
    }, [size]);

    // ========================================================================
    // 2. SOVEREIGN COLOR & TIER RESOLUTION
    // Matches the exact logic defined in partner.constants.js
    // ========================================================================
    const { color, label, glow } = useMemo(() => {
        const safeScore = Math.max(0, Math.min(100, Number(score)));
        
        if (safeScore >= 92) return { 
            color: 'var(--brand-primary)', // Citadel Blue (Platinum)
            label: 'Elite', 
            glow: 'rgba(37, 99, 235, 0.4)' 
        };
        if (safeScore >= 80) return { 
            color: '#F59E0B',              // Citadel Gold (Gold)
            label: 'Healthy', 
            glow: 'rgba(245, 158, 11, 0.4)' 
        };
        if (safeScore >= 60) return { 
            color: 'var(--text-main)',     // Neutral Slate (Standard)
            label: 'Standard', 
            glow: 'rgba(148, 163, 184, 0.2)' 
        };
        return { 
            color: 'var(--status-danger)', // Danger Red (At-Risk / Suspended)
            label: 'Critical', 
            glow: 'rgba(239, 68, 68, 0.4)' 
        };
    }, [score]);

    // ========================================================================
    // 3. SVG MATH (The Circular Progress Ring)
    // ========================================================================
    // A 36x36 viewBox gives us a clean 18px radius center.
    const radius = 16; 
    const circumference = 2 * Math.PI * radius;
    // Calculate the exact stroke offset to simulate the progress bar
    const strokeDashoffset = circumference - ((isLoading ? 0 : score) / 100) * circumference;

    // ========================================================================
    // 4. RENDERING ENGINE
    // ========================================================================
    if (isLoading) {
        return (
            <div style={{ 
                width: dimensions.width, height: dimensions.width, 
                borderRadius: '50%', background: 'var(--bg-input)', 
                flexShrink: 0 
            }} className="animate-pulse" />
        );
    }

    return (
        <div 
            className="health-badge-wrapper"
            title={`Algorithmic Health: ${score}/100`}
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '12px',
                flexShrink: 0, // CRITICAL: Prevents squishing inside horizontal scroll ledgers
                cursor: 'default'
            }}
        >
            {/* --- THE KINETIC SVG RING --- */}
            <div style={{ 
                position: 'relative', 
                width: dimensions.width, 
                height: dimensions.width,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                background: `color-mix(in srgb, ${color} 10%, transparent)`, // Dark Mode safe tinted background
                boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 20%, transparent), 0 4px 12px ${glow}`,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <svg 
                    viewBox="0 0 36 36" 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
                >
                    {/* Background Track */}
                    <circle 
                        cx="18" cy="18" r={radius} 
                        fill="none" 
                        stroke={`color-mix(in srgb, ${color} 15%, transparent)`} 
                        strokeWidth={dimensions.stroke} 
                    />
                    {/* Active Progress Ring */}
                    <circle 
                        cx="18" cy="18" r={radius} 
                        fill="none" 
                        stroke={color} 
                        strokeWidth={dimensions.stroke} 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                    />
                </svg>

                {/* Center Number */}
                <span style={{ 
                    position: 'relative', zIndex: 2,
                    fontSize: dimensions.font, fontWeight: '900', fontFamily: 'monospace',
                    color: color, letterSpacing: '-0.5px'
                }}>
                    {Math.round(score)}
                </span>
            </div>

            {/* --- OPTIONAL EXPANSIVE LABEL (For Profile Views) --- */}
            {showLabel && (
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
                            {label} Status
                        </span>
                        
                        {/* Trend Indicator */}
                        {trend === 'up' && <TrendingUp size={14} color="var(--status-success)" strokeWidth={3} />}
                        {trend === 'down' && <TrendingDown size={14} color="var(--status-danger)" strokeWidth={3} />}
                        {trend === 'flat' && <Minus size={14} color="var(--text-muted)" strokeWidth={3} />}
                    </div>
                    
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={10} /> Sovereign Health Index
                    </span>
                </div>
            )}
        </div>
    );
};

export default HealthBadge;