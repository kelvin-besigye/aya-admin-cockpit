import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';

import UnitDropdown from './UnitDropdown';

/**
 * 👑 AYA BUS OS HARDWARE: Sovereign Stepper (Level 2: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SovereignStepper.jsx
 * * DESCRIPTION:
 * A high-precision numeric engine. Physically separates numbers from units 
 * to guarantee pristine database entries. Enforces NoSQL schema boundaries natively.
 * * UPGRADES (Zero-Trust Edition):
 * - Pure State Hover Physics: Removed unsafe DOM style mutations to clear all linter warnings.
 * - Stale-Closure Immunity: Uses mutable refs to track high-speed acceleration perfectly.
 * - Hold-to-Accelerate Engine: Press and hold +/- for rapid, continuous stepping.
 * - Auto-Clamping: Forcibly restricts manual typing to schema min/max bounds on blur.
 * - Enterprise Formatting: Injects commas (50,000) for UI, strips them for the database.
 */

const SovereignStepper = ({
    value = 0,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    unitOptions = [],
    onUnitChange,
    disabled = false,
    riskLevel = 'LOW'
}) => {
    // ========================================================================
    // 1. STATE & MUTABLE REFS
    // ========================================================================
    const [displayValue, setDisplayValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    
    // Pure State Hover tracking (Replaces unsafe e.currentTarget.style)
    const [hoverState, setHoverState] = useState(null); // 'DECREMENT' | 'INCREMENT' | null

    // Refs for Hold-to-Accelerate physics & Stale-Closure prevention
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);
    const latestValueRef = useRef(value);

    const isHighRisk = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

    // Keep ref synced with display for high-speed calculation
    useEffect(() => {
        latestValueRef.current = displayValue;
    }, [displayValue]);

    // ========================================================================
    // 2. FORMATTING & MATH ENGINE
    // ========================================================================
    const formatNumber = (num) => {
        if (num === null || num === undefined || isNaN(num)) return '';
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num);
    };

    const parseNumber = useCallback((str) => {
        if (typeof str === 'number') return str;
        const stripped = String(str).replace(/,/g, '');
        const parsed = parseFloat(stripped);
        return isNaN(parsed) ? min : parsed;
    }, [min]);

    // Prevents floating point errors (e.g. 2.5 + 0.1 !== 2.60000000001)
    const preciseMath = useCallback((val1, val2, operation) => {
        const factor = Math.pow(10, 4); 
        const v1 = Math.round(val1 * factor);
        const v2 = Math.round(val2 * factor);
        return operation === 'add' ? (v1 + v2) / factor : (v1 - v2) / factor;
    }, []);

    // Sync external prop changes (e.g., when the NoSQL service finally loads)
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatNumber(value));
        }
    }, [value, isFocused]);

    // Cleanup timers on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // ========================================================================
    // 3. ZERO-TRUST CLAMPING
    // ========================================================================
    const commitValue = useCallback((newValue) => {
        let clamped = newValue;
        if (clamped < min) clamped = min;
        if (clamped > max) clamped = max;
        
        setDisplayValue(formatNumber(clamped));
        if (clamped !== value) {
            onChange(clamped);
        }
    }, [min, max, value, onChange]);

    // ========================================================================
    // 4. EVENT HANDLERS (The Physics)
    // ========================================================================
    const handleStep = useCallback((direction) => {
        if (disabled) return;
        const currentRaw = parseNumber(latestValueRef.current);
        const nextValue = preciseMath(currentRaw, step, direction === 'up' ? 'add' : 'subtract');
        
        let clamped = nextValue;
        if (clamped < min) clamped = min;
        if (clamped > max) clamped = max;

        setDisplayValue(formatNumber(clamped));
        return clamped; // Return raw value for the interval loop
    }, [disabled, parseNumber, preciseMath, step, min, max]);

    // --- Hold-to-Accelerate Loop ---
    const startHolding = (direction) => {
        if (disabled) return;
        
        // Execute first step immediately
        const initialStep = handleStep(direction);
        if (initialStep <= min && direction === 'down') return;
        if (initialStep >= max && direction === 'up') return;

        // Engage acceleration after 400ms hold
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                handleStep(direction);
            }, 50); // 50ms rapid fire
        }, 400);
    };

    const stopHolding = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        timeoutRef.current = null;
        intervalRef.current = null;
        
        // Finalize the value to the parent state on mouse up
        commitValue(parseNumber(latestValueRef.current));
    }, [commitValue, parseNumber]);

    // --- Text Input Interaction ---
    const handleInputChange = (e) => {
        // Allow numbers, decimals, commas, and negative signs while typing
        const val = e.target.value.replace(/[^0-9.,-]/g, '');
        setDisplayValue(val);
    };

    const handleBlur = () => {
        setIsFocused(false);
        commitValue(parseNumber(displayValue));
    };

    const handleFocus = () => {
        setIsFocused(true);
        setDisplayValue(parseNumber(displayValue).toString()); // Strip commas for editing
    };

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    const focusColor = isHighRisk ? 'var(--status-danger)' : 'var(--brand-primary)';
    const baseBorderColor = 'var(--border-subtle)';
    const currentNumber = parseNumber(displayValue);

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            
            {/* LEFT SIDE: THE NUMERIC HARDWARE */}
            <div style={{
                display: 'flex',
                alignItems: 'stretch',
                height: '48px',
                flex: 1,
                background: disabled ? 'var(--bg-surface)' : 'var(--bg-input)',
                border: '1px solid',
                borderColor: isFocused ? focusColor : baseBorderColor,
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px',
                borderTopRightRadius: '0px', // Flat to snap flush with UnitDropdown
                borderBottomRightRadius: '0px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: isFocused ? `0 0 0 3px color-mix(in srgb, ${focusColor} 15%, transparent)` : 'none',
                overflow: 'hidden',
                position: 'relative'
            }}>
                
                {/* Visual Blast Radius Marker */}
                {isHighRisk && !isFocused && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--status-danger)', zIndex: 2 }} />
                )}

                {/* --- DecreMENT BUTTON --- */}
                <button
                    type="button"
                    onMouseDown={() => startHolding('down')}
                    onMouseUp={stopHolding}
                    onMouseLeave={() => { setHoverState(null); stopHolding(); }}
                    onMouseEnter={() => setHoverState('DECREMENT')}
                    onTouchStart={() => startHolding('down')}
                    onTouchEnd={stopHolding}
                    disabled={disabled || currentNumber <= min}
                    style={{
                        width: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (hoverState === 'DECREMENT' && !disabled && currentNumber > min) ? 'var(--bg-hover)' : 'transparent',
                        border: 'none',
                        borderRight: `1px solid ${isFocused ? focusColor : baseBorderColor}`,
                        color: (disabled || currentNumber <= min) ? 'var(--text-muted)' : 'var(--text-main)',
                        cursor: (disabled || currentNumber <= min) ? 'not-allowed' : 'pointer',
                        transition: 'background 0.15s ease, color 0.15s ease',
                        opacity: (disabled || currentNumber <= min) ? 0.4 : 1
                    }}
                    title="Decrease Value"
                >
                    <Minus size={16} strokeWidth={3} />
                </button>

                {/* --- TEXT INPUT SURFACE --- */}
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={displayValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        disabled={disabled}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            textAlign: 'center',
                            fontSize: '15px',
                            fontWeight: '900',
                            fontFamily: 'monospace',
                            color: isHighRisk ? 'var(--status-danger)' : 'var(--text-main)',
                            padding: '0 8px',
                            transition: 'color 0.2s ease'
                        }}
                    />
                </div>

                {/* --- INCREMENT BUTTON --- */}
                <button
                    type="button"
                    onMouseDown={() => startHolding('up')}
                    onMouseUp={stopHolding}
                    onMouseLeave={() => { setHoverState(null); stopHolding(); }}
                    onMouseEnter={() => setHoverState('INCREMENT')}
                    onTouchStart={() => startHolding('up')}
                    onTouchEnd={stopHolding}
                    disabled={disabled || currentNumber >= max}
                    style={{
                        width: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (hoverState === 'INCREMENT' && !disabled && currentNumber < max) ? 'var(--bg-hover)' : 'transparent',
                        border: 'none',
                        borderLeft: `1px solid ${isFocused ? focusColor : baseBorderColor}`,
                        color: (disabled || currentNumber >= max) ? 'var(--text-muted)' : 'var(--text-main)',
                        cursor: (disabled || currentNumber >= max) ? 'not-allowed' : 'pointer',
                        transition: 'background 0.15s ease, color 0.15s ease',
                        opacity: (disabled || currentNumber >= max) ? 0.4 : 1
                    }}
                    title="Increase Value"
                >
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>

            {/* RIGHT SIDE: THE UNIT DROPDOWN (Snaps flush to the stepper) */}
            {unit && (
                <UnitDropdown 
                    value={unit} 
                    options={unitOptions} 
                    onChange={onUnitChange} 
                    disabled={disabled} 
                />
            )}
        </div>
    );
};

export default SovereignStepper;
