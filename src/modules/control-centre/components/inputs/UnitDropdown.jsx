import React, { useState, useRef, useEffect } from 'react';
import { 
    ChevronDown, Clock, Banknote, Percent, 
    MapPin, Activity, Hash, ToggleRight, 
    Type, ShieldAlert, Lock
} from 'lucide-react';

/**
 * 👑 AYA BUS OS HARDWARE: Unit Dropdown (Level 2: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: UnitDropdown.jsx
 * * DESCRIPTION:
 * A high-precision, stylized unit selector designed to sit flush against 
 * numeric inputs. Prevents data-type corruption by strictly isolating units.
 * * UPGRADES:
 * - Cryptographic Lock: Defaults to a read-only "Badge" mode based on the Schema.
 * - Dynamic Ontology: Automatically maps units (UGX, Mins, %) to localized icons.
 * - Future-Proof: Seamlessly transforms into a functional dropdown if 'options' are provided.
 * - Zero-Shift Layout: Fixed typography widths prevent UI jitter.
 */

// ========================================================================
// 1. DYNAMIC ICON ENGINE
// ========================================================================
// Maps the exact strings from CONTROL_UNITS to visual context markers
const UNIT_ICON_MAP = {
    'UGX': Banknote,
    'USD': Banknote,
    '%': Percent,
    'Meters': MapPin,
    'KM': MapPin,
    'Secs': Clock,
    'Mins': Clock,
    'Hours': Clock,
    'Days': Clock,
    'Scans': Hash,
    'Attempts': ShieldAlert,
    'SemVer': Activity,
    'State': ToggleRight,
    'String': Type,
    'Req/Min': Activity
};

const UnitDropdown = ({ 
    value, 
    options = [], // If empty, component physically locks into 'Badge Mode'
    onChange, 
    disabled = false,
    width = '110px' // Fixed width prevents the grid from shifting
}) => {
    // ========================================================================
    // 2. STATE & PHYSICS
    // ========================================================================
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Hardware Lock Physics
    const isLocked = options.length === 0 || disabled;

    // Click-Outside Listener for dropdown mode
    useEffect(() => {
        if (isLocked) return;
        
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isLocked]);

    // Icon Resolution
    const ActiveIcon = UNIT_ICON_MAP[value] || Hash;

    // ========================================================================
    // 3. RENDER ENGINE
    // ========================================================================
    return (
        <div ref={dropdownRef} style={{ position: 'relative', width, flexShrink: 0 }}>
            
            {/* THE HARDWARE SURFACE */}
            <button
                type="button"
                onClick={() => !isLocked && setIsOpen(!isOpen)}
                disabled={isLocked && options.length === 0 ? false : disabled} // Allow click for tooltip if just locked
                style={{
                    width: '100%',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 12px',
                    background: isLocked ? 'var(--bg-surface)' : 'var(--bg-input)',
                    border: '1px solid',
                    borderColor: isOpen ? 'var(--brand-primary)' : 'var(--border-subtle)',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    borderTopLeftRadius: '0px', // Designed to snap flush against the Stepper
                    borderBottomLeftRadius: '0px',
                    borderLeft: 'none', // Prevents double-borders when attached to input
                    color: isLocked ? 'var(--text-muted)' : 'var(--text-main)',
                    cursor: isLocked ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 0 0 3px color-mix(in srgb, var(--brand-primary) 15%, transparent)' : 'none',
                    outline: 'none'
                }}
                title={isLocked ? `Immutable Unit: ${value}` : `Select Unit`}
            >
                {/* Active Selection Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <ActiveIcon size={14} color={isLocked ? "var(--text-muted)" : "var(--brand-primary)"} strokeWidth={2.5} />
                    <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '800', 
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {value}
                    </span>
                </div>

                {/* Right Side Marker (Chevron or Lock) */}
                {isLocked ? (
                    <Lock size={12} color="var(--border-subtle)" style={{ opacity: 0.5 }} />
                ) : (
                    <ChevronDown 
                        size={14} 
                        color="var(--text-muted)" 
                        style={{ 
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                        }} 
                    />
                )}
            </button>

            {/* THE DROPDOWN MENU (Future-Proofing for multi-currency/metrics) */}
            {!isLocked && isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '140px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    animation: 'dropdownFade 0.15s ease-out'
                }}>
                    <style>
                        {`@keyframes dropdownFade { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}
                    </style>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {options.map((opt) => {
                            const OptIcon = UNIT_ICON_MAP[opt] || Hash;
                            const isSelected = opt === value;
                            
                            return (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '10px 12px',
                                        background: isSelected ? 'var(--bg-input)' : 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        fontFamily: 'monospace',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background 0.15s ease'
                                    }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)' }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                                >
                                    <OptIcon size={14} />
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitDropdown;