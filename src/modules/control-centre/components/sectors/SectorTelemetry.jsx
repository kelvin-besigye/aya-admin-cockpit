import React, { useState } from 'react';
import { 
    Zap, ShieldAlert, AlertTriangle, 
    MessageSquare, MapPin, Wallet, ChevronDown
} from 'lucide-react';

// Import Master OS Laws and Hardware
import { MASTER_SCHEMA, CONTROL_SECTORS, INPUT_TYPES, RISK_LEVELS } from '../../data/control.constants';
import SovereignStepper from '../inputs/SovereignStepper';

/**
 * 👑 AYA BUS COMMAND BOARD: Comms & Telemetry (Level 4: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SectorTelemetry.jsx
 * * DESCRIPTION:
 * The physical command board for Sector 6. Controls external API routing 
 * (SMS Gateways), hardware polling frequencies (GPS), and automated financial apologies.
 * * UPGRADES:
 * - Sovereign Select Hardware: Replaces native browser dropdowns with a cross-platform, pure CSS interactive element.
 * - Dynamic Icon Engine: Intelligently assigns Map, Wallet, and Message icons based on NoSQL configuration IDs.
 * - Schema-Driven Architecture: Zero hardcoded forms; natively loops through the NoSQL blueprint.
 * - Fluid Economics Grid: Adapts seamlessly from ultra-wide 4K to tablet views.
 */

// ========================================================================
// 1. HARDWARE: SOVEREIGN SELECT (Immutable Dropdown)
// ========================================================================
const SovereignSelect = ({ value, options = [], onChange, disabled, riskLevel, icon: Icon }) => {
    const [isFocused, setIsFocused] = useState(false);
    const isHighRisk = riskLevel === RISK_LEVELS.HIGH || riskLevel === RISK_LEVELS.CRITICAL;
    const focusColor = isHighRisk ? 'var(--status-danger)' : 'var(--brand-primary)';

    return (
        <div style={{
            position: 'relative', display: 'flex', alignItems: 'center', height: '48px',
            background: disabled ? 'var(--bg-surface)' : 'var(--bg-input)',
            border: '1px solid', borderColor: isFocused ? focusColor : 'var(--border-subtle)',
            borderRadius: '12px', transition: 'all 0.2s ease',
            boxShadow: isFocused ? `0 0 0 3px color-mix(in srgb, ${focusColor} 15%, transparent)` : 'none',
            overflow: 'hidden'
        }}>
            {/* Risk Indicator Ribbon */}
            {isHighRisk && !isFocused && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--status-danger)', zIndex: 2 }} />
            )}
            
            {/* Decorative Icon Prefix */}
            {Icon && (
                <div style={{ paddingLeft: '16px', color: isFocused ? focusColor : 'var(--text-muted)', transition: 'color 0.2s ease' }}>
                    <Icon size={18} strokeWidth={2.5} />
                </div>
            )}

            {/* Native Select with Hidden Default Styling */}
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                style={{
                    flex: 1, height: '100%', background: 'transparent', border: 'none', outline: 'none',
                    padding: '0 40px 0 16px', fontSize: '14px', fontWeight: '800', fontFamily: 'monospace',
                    color: isHighRisk ? 'var(--status-danger)' : 'var(--text-main)',
                    appearance: 'none', WebkitAppearance: 'none', cursor: disabled ? 'not-allowed' : 'pointer'
                }}
            >
                {options.map(opt => (
                    <option key={opt} value={opt} style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', fontWeight: '700' }}>
                        {opt}
                    </option>
                ))}
            </select>

            {/* Custom Chevron Marker */}
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isFocused ? focusColor : 'var(--text-muted)' }}>
                <ChevronDown size={16} strokeWidth={3} />
            </div>
        </div>
    );
};

// ========================================================================
// 2. THE COMMAND BOARD EXPORT
// ========================================================================
const SectorTelemetry = ({ 
    sectorState = {}, 
    onSettingChange 
}) => {
    // 1. Isolate the schema for the Telemetry sector
    const sectorSchema = MASTER_SCHEMA[CONTROL_SECTORS.TELEMETRY.id] || {};

    // 2. Icon Mapper for visual cognitive routing
    const getSettingIcon = (settingId) => {
        const id = settingId.toLowerCase();
        if (id.includes('sms') || id.includes('gateway')) return MessageSquare;
        if (id.includes('gps') || id.includes('ping')) return MapPin;
        if (id.includes('credit') || id.includes('apology') || id.includes('wallet')) return Wallet;
        return Zap;
    };

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '32px', 
            width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '24px 32px' 
        }}>
            
            {/* --- SECTOR HEADER --- */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                        Comms & Telemetry
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '600', lineHeight: '1.5', maxWidth: '650px' }}>
                        Control the external communication routing protocols and internal hardware data transmission limits. Ensure high-risk wallet compensation mechanisms are strictly monitored.
                    </p>
                </div>
            </div>

            {/* --- SCHEMA-DRIVEN GRID SYSTEM --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
                {Object.values(sectorSchema).map((settingDef) => {
                    const currentValue = sectorState[settingDef.id];
                    const isHighRisk = settingDef.riskLevel === RISK_LEVELS.HIGH || settingDef.riskLevel === RISK_LEVELS.CRITICAL;
                    const isMediumRisk = settingDef.riskLevel === RISK_LEVELS.MEDIUM;
                    const ContextIcon = getSettingIcon(settingDef.id);

                    // Determine Border & Accent Colors
                    const accentColor = isHighRisk ? 'var(--status-danger)' : (isMediumRisk ? 'var(--status-warning)' : 'var(--brand-primary)');
                    const cardBorder = isHighRisk ? 'color-mix(in srgb, var(--status-danger) 30%, transparent)' : (isMediumRisk ? 'color-mix(in srgb, var(--status-warning) 30%, transparent)' : 'var(--border-subtle)');
                    const bgAccent = isHighRisk ? 'color-mix(in srgb, var(--status-danger) 10%, transparent)' : (isMediumRisk ? 'color-mix(in srgb, var(--status-warning) 10%, transparent)' : 'color-mix(in srgb, var(--brand-primary) 10%, transparent)');

                    return (
                        <div 
                            key={settingDef.id}
                            style={{
                                background: 'var(--bg-surface)', border: '1px solid', borderColor: cardBorder,
                                borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
                                transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {/* Danger/Warning Top Ribbon */}
                            {(isHighRisk || isMediumRisk) && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor }} />
                            )}

                            {/* Card Header (Icon, Label, Badges) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ marginTop: '2px', color: accentColor }}>
                                        <ContextIcon size={20} strokeWidth={2.5} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <label style={{ fontSize: '14px', fontWeight: '800', color: accentColor }}>
                                                {settingDef.label}
                                            </label>
                                            {(isHighRisk || isMediumRisk) && (
                                                <span style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', 
                                                    background: bgAccent, color: accentColor, 
                                                    fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' 
                                                }}>
                                                    <AlertTriangle size={10} strokeWidth={3} /> {settingDef.riskLevel}
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.4' }}>
                                            {settingDef.desc}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Blast Radius Warning */}
                            {settingDef.blastRadius && (
                                <div style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '8px', background: bgAccent, border: `1px solid ${cardBorder}` }}>
                                    <ShieldAlert size={16} color={accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span style={{ fontSize: '11px', color: accentColor, fontWeight: '700', lineHeight: '1.5' }}>
                                        <strong>Blast Radius:</strong> {settingDef.blastRadius}
                                    </span>
                                </div>
                            )}

                            {/* Hardware Injection Engine */}
                            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                                {settingDef.type === INPUT_TYPES.STEPPER && (
                                    <SovereignStepper 
                                        value={currentValue}
                                        onChange={(val) => onSettingChange(settingDef.id, val)}
                                        min={settingDef.min}
                                        max={settingDef.max}
                                        step={settingDef.step}
                                        unit={settingDef.unit}
                                        riskLevel={settingDef.riskLevel}
                                    />
                                )}
                                {settingDef.type === INPUT_TYPES.SELECT && (
                                    <SovereignSelect 
                                        value={currentValue}
                                        options={settingDef.options}
                                        onChange={(val) => onSettingChange(settingDef.id, val)}
                                        riskLevel={settingDef.riskLevel}
                                        icon={ContextIcon}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ height: '40px', flexShrink: 0 }} />
        </div>
    );
};

export default SectorTelemetry;