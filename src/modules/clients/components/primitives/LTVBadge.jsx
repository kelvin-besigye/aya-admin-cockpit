import React from 'react';
import { Crown, Award, Star, User } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { PASSENGER_LTV_TIERS } from '../../data/clients.constants';

/**
 * 👑 LTV BADGE (Level 2: Visual Primitive - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: LTVBadge.jsx
 * * DESCRIPTION:
 * A highly reusable visual atom indicating a passenger's Lifetime Value Tier.
 * Uses dynamic scaling, glassmorphism, and keyframe pulsing for VIP attention.
 * * UPGRADES:
 * - The Sovereign Pulse: Active CSS glow for highest-tier passengers.
 * - Strict Token Mapping: Automatically inherits physics from clients.constants.js.
 */

const LTVBadge = ({ 
    tierId = 'STANDARD', 
    size = 'md', 
    showIcon = true, 
    showLabel = true,
    className = '',
    style = {}
}) => {

    // ========================================================================
    // 1. DATA RESOLUTION
    // ========================================================================
    // Safely fallback to STANDARD if an unknown tier is passed
    const tierConfig = PASSENGER_LTV_TIERS[tierId] || PASSENGER_LTV_TIERS.STANDARD;
    const isSovereign = tierConfig.id === 'SOVEREIGN';

    // ========================================================================
    // 2. ICON MAPPING ENGINE
    // ========================================================================
    const getTierIcon = () => {
        switch (tierConfig.id) {
            case 'SOVEREIGN': return Crown;
            case 'PLATINUM': return Award;
            case 'GOLD': return Star;
            case 'STANDARD':
            default: return User;
        }
    };
    const Icon = getTierIcon();

    // ========================================================================
    // 3. SIZE & SCALING PHYSICS
    // ========================================================================
    const sizingConfig = {
        sm: { padding: '2px 6px', fontSize: '9px', iconSize: 10, gap: '4px', borderRadius: '6px' },
        md: { padding: '4px 10px', fontSize: '11px', iconSize: 12, gap: '6px', borderRadius: '100px' },
        lg: { padding: '6px 14px', fontSize: '13px', iconSize: 16, gap: '8px', borderRadius: '100px' }
    };
    const currentSize = sizingConfig[size] || sizingConfig.md;

    // ========================================================================
    // 4. RENDER ENGINE
    // ========================================================================
    return (
        <>
            {/* Inject Global Keyframe for the Sovereign Pulse if needed */}
            {isSovereign && (
                <style>
                    {`
                        @keyframes sovereignPulse {
                            0% { box-shadow: 0 0 0 0 ${tierConfig.bgPulse}; }
                            70% { box-shadow: 0 0 0 8px transparent; }
                            100% { box-shadow: 0 0 0 0 transparent; }
                        }
                    `}
                </style>
            )}

            <div 
                className={`ltv-badge ${className}`}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: currentSize.gap,
                    padding: currentSize.padding,
                    borderRadius: currentSize.borderRadius,
                    // Advanced Color-Mix for Dark/Light Mode Adaptability
                    background: `color-mix(in srgb, ${tierConfig.color} 12%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${tierConfig.color} 25%, transparent)`,
                    color: tierConfig.color,
                    animation: isSovereign ? 'sovereignPulse 2s infinite cubic-bezier(0.66, 0, 0, 1)' : 'none',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0, // Prevents the badge from squishing in tight layouts
                    ...style
                }}
            >
                {showIcon && (
                    <Icon 
                        size={currentSize.iconSize} 
                        strokeWidth={isSovereign ? 2.5 : 2} 
                        style={{ flexShrink: 0 }}
                    />
                )}
                
                {showLabel && (
                    <span style={{ 
                        fontSize: currentSize.fontSize, 
                        fontWeight: '800', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        lineHeight: '1'
                    }}>
                        {tierConfig.label}
                    </span>
                )}
            </div>
        </>
    );
};

export default LTVBadge;