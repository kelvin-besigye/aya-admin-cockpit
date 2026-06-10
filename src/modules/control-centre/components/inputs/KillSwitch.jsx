import React, { useState, useCallback } from 'react';
import { ShieldAlert, Power, Check, X } from 'lucide-react';

/**
 * 👑 AYA BUS OS HARDWARE: Sovereign Kill Switch (Level 2: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: KillSwitch.jsx
 * * DESCRIPTION:
 * A high-friction, visually aggressive toggle switch. Designed specifically 
 * for ecosystem-wide actions (Maintenance Mode, Strict 2FA).
 * * UPGRADES (Zero-Trust Edition):
 * - Animated Hazard Physics: Moving red stripes visually warn of active blast radius.
 * - Adaptive Morphology: Downgrades to a standard sleek toggle for LOW risk parameters.
 * - Haptic Integration: Triggers physical device vibration on critical state changes.
 * - Pure React State: Zero direct DOM mutations. 100% Linter compliant.
 */

const KillSwitch = ({
    checked = false,
    onChange,
    disabled = false,
    riskLevel = 'CRITICAL' // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
}) => {
    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Determine the architectural risk tier
    const isHighRisk = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

    // ========================================================================
    // 2. INTERACTION PHYSICS
    // ========================================================================
    const handleToggle = useCallback(() => {
        if (disabled) return;
        
        // Haptic Feedback for Critical Actions (Supported on Android/Scanners)
        if (isHighRisk && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(checked ? 50 : [50, 100, 50]); // Warning pattern if turning ON
        }

        onChange(!checked);
    }, [disabled, checked, onChange, isHighRisk]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        }
    };

    // ========================================================================
    // 3. DYNAMIC STYLING ENGINE
    // ========================================================================
    
    // Background generation based on state and risk
    const getTrackBackground = () => {
        if (disabled) return 'var(--bg-input)';
        
        if (!checked) return 'var(--bg-input)'; // Default off state

        if (isHighRisk) {
            // The moving hazard stripe pattern
            return `repeating-linear-gradient(
                -45deg,
                var(--status-danger),
                var(--status-danger) 12px,
                color-mix(in srgb, var(--status-danger) 50%, black) 12px,
                color-mix(in srgb, var(--status-danger) 50%, black) 24px
            )`;
        }

        // Standard sleek toggle for Low/Medium risk
        return 'var(--brand-primary)';
    };

    const getHandleColor = () => {
        if (disabled) return 'var(--text-muted)';
        if (!checked) return 'var(--text-muted)';
        return isHighRisk ? 'var(--status-danger)' : 'var(--brand-primary)';
    };

    // ========================================================================
    // 4. RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            
            {/* Inject Global CSS Keyframes for the Hazard Animation */}
            {isHighRisk && checked && (
                <style>
                    {`
                        @keyframes hazardPan {
                            0% { background-position: 0 0; }
                            100% { background-position: 48px 48px; }
                        }
                        @keyframes pulseShadow {
                            0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-danger) 40%, transparent); }
                            70% { box-shadow: 0 0 0 10px transparent; }
                            100% { box-shadow: 0 0 0 0 transparent; }
                        }
                    `}
                </style>
            )}

            <button
                role="switch"
                aria-checked={checked}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => !disabled && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                style={{
                    // Physical Dimensions (Chunky, tactile hit area)
                    width: '64px',
                    height: '32px',
                    borderRadius: '100px',
                    padding: '4px',
                    position: 'relative',
                    
                    // Box Physics
                    border: '1px solid',
                    borderColor: (isFocused || isHovered) && !checked ? 'var(--border-subtle)' : 'transparent',
                    background: getTrackBackground(),
                    backgroundSize: '200% 200%',
                    
                    // Animations
                    animation: (isHighRisk && checked) 
                        ? 'hazardPan 2s linear infinite, pulseShadow 2s infinite' 
                        : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    
                    // Interaction
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    opacity: disabled ? 0.5 : 1,
                    
                    // Accessibility
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: checked ? 'flex-end' : 'flex-start'
                }}
            >
                {/* THE HANDLE (The Physical Knob) */}
                <div 
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#FFFFFF', // Clean white contrast
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        
                        // Slide Animation Physics
                        transform: `translateX(${checked ? (isHovered ? '-2px' : '0px') : (isHovered ? '2px' : '0px')})`,
                        transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), background 0.3s ease',
                        
                        zIndex: 2 // Sit above the hazard stripes
                    }}
                >
                    {/* Dynamic Icon Engine for Colorblind Accessibility */}
                    {checked ? (
                        isHighRisk ? (
                            <ShieldAlert size={14} color={getHandleColor()} strokeWidth={3} />
                        ) : (
                            <Check size={14} color={getHandleColor()} strokeWidth={3} />
                        )
                    ) : (
                        isHighRisk ? (
                            <Power size={14} color="var(--text-muted)" strokeWidth={3} />
                        ) : (
                            <X size={14} color="var(--text-muted)" strokeWidth={3} />
                        )
                    )}
                </div>
            </button>
        </div>
    );
};

export default KillSwitch;