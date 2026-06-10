import React, { useMemo } from 'react';
import { Crown, Medal, Shield, ShieldAlert, Ban } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES (The DNA)
import { PARTNER_TIERS } from '../../data/partner.constants';

/**
 * 👑 TIER SHIELD (Level 2: Visual Primitive - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: TierShield.jsx
 * * DESCRIPTION:
 * A scalable, theme-aware badge that visually represents a partner's
 * operational class (Platinum, Gold, Standard, etc.).
 * * UPGRADES:
 * - Uncrushable Physics: flexShrink: 0 and whiteSpace: nowrap ensure it 
 * survives being placed in tight, responsive data grids.
 * - Semantic DNA: Reads directly from partner.constants.js for colors.
 * - Glassmorphism Auto-Tinting: Automatically blends perfectly into Dark 
 * and Light modes without hardcoded opacity layers.
 */

const TierShield = ({ 
    tierId = 'STANDARD', 
    size = 'md',        // 'sm' (data rows) | 'md' (default) | 'lg' (profile hero)
    showLabel = true,   // Show the text name of the tier next to the icon
    isLoading = false 
}) => {

    // ========================================================================
    // 1. DIMENSION SCALING ENGINE
    // Automatically recalculates paddings, fonts, and icon sizes based on the prop
    // ========================================================================
    const dimensions = useMemo(() => {
        switch(size) {
            case 'sm': return { box: 24, icon: 12, font: '11px', gap: '6px', radius: '6px' };
            case 'lg': return { box: 48, icon: 24, font: '16px', gap: '12px', radius: '12px' };
            case 'md': 
            default: return { box: 32, icon: 16, font: '13px', gap: '8px', radius: '8px' };
        }
    }, [size]);

    // ========================================================================
    // 2. TIER RESOLUTION & ICON MAPPING
    // Safely falls back to STANDARD if a bad ID is passed from the database
    // ========================================================================
    const { tierConfig, Icon } = useMemo(() => {
        const config = PARTNER_TIERS[tierId] || PARTNER_TIERS.STANDARD;
        
        let targetIcon;
        switch(config.id) {
            case 'PLATINUM': targetIcon = Crown; break;
            case 'GOLD': targetIcon = Medal; break;
            case 'AT_RISK': targetIcon = ShieldAlert; break;
            case 'SUSPENDED': targetIcon = Ban; break;
            case 'STANDARD': 
            default: targetIcon = Shield; break;
        }

        return { tierConfig: config, Icon: targetIcon };
    }, [tierId]);

    // ========================================================================
    // 3. RENDER ENGINE
    // ========================================================================
    if (isLoading) {
        return (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: dimensions.gap, flexShrink: 0 }}>
                <div className="animate-pulse" style={{ width: dimensions.box, height: dimensions.box, borderRadius: dimensions.radius, background: 'var(--bg-input)' }} />
                {showLabel && <div className="animate-pulse" style={{ width: '80px', height: '14px', borderRadius: '4px', background: 'var(--bg-input)' }} />}
            </div>
        );
    }

    return (
        <div 
            title={`${tierConfig.label} Status`}
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: dimensions.gap,
                flexShrink: 0, // CRITICAL: Protects layout integrity inside tables
                cursor: 'default'
            }}
        >
            {/* --- THE SHIELD ICON BOX --- */}
            <div style={{
                width: dimensions.box, 
                height: dimensions.box,
                borderRadius: dimensions.radius,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                // Sovereign Dark/Light blending
                background: `color-mix(in srgb, ${tierConfig.color} 15%, transparent)`,
                border: `1px solid color-mix(in srgb, ${tierConfig.color} 30%, transparent)`,
                boxShadow: `0 4px 12px color-mix(in srgb, ${tierConfig.color} 15%, transparent)`,
                color: tierConfig.color,
                transition: 'all 0.2s ease'
            }}>
                <Icon size={dimensions.icon} strokeWidth={2.5} />
            </div>

            {/* --- THE TEXT LABEL --- */}
            {showLabel && (
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ 
                        fontSize: dimensions.font, 
                        fontWeight: '800', 
                        color: 'var(--text-main)', 
                        letterSpacing: '-0.2px',
                        whiteSpace: 'nowrap' // CRITICAL: Prevents text wrapping in tight spaces
                    }}>
                        {tierConfig.label}
                    </span>
                    
                    {/* Optional: Add micro-copy for specific sizes */}
                    {size === 'lg' && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
                            Sovereign SLA Class
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default TierShield;