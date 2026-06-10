import React, { useState } from 'react';
import { Smartphone, ShieldAlert, Info, Phone, MessageCircle, GitBranch, AlertTriangle } from 'lucide-react';

// Import the Master OS Laws and Hardware
import { MASTER_SCHEMA, CONTROL_SECTORS, INPUT_TYPES, RISK_LEVELS } from '../../data/control.constants';
import KillSwitch from '../inputs/KillSwitch';

/**
 * 👑 AYA BUS COMMAND BOARD: Consumer App & Web (Level 4: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SectorConsumerWeb.jsx
 * * DESCRIPTION:
 * The physical command board for Sector 1. Controls public-facing contacts, 
 * app store versioning, and the B2C Global Kill Switch.
 * * UPGRADES:
 * - Schema-Driven UI: Automatically renders inputs based on the frozen NoSQL schema.
 * - Hardware Text Inputs: Pristine, zero-shift text inputs that match the Stepper physics.
 * - Responsive Grid: Auto-reflows from 2 columns on 4K/1080p to 1 column on tablets.
 * - Cognitive Risk Badging: High/Critical risk items are visually isolated to prevent accidents.
 */

// ========================================================================
// 1. HARDWARE: SOVEREIGN TEXT INPUT
// Built specifically to match the physical dimensions of the Stepper
// ========================================================================
const SovereignTextInput = ({ value, onChange, disabled, riskLevel, icon: Icon }) => {
    const [isFocused, setIsFocused] = useState(false);
    const isHighRisk = riskLevel === RISK_LEVELS.HIGH || riskLevel === RISK_LEVELS.CRITICAL;
    const focusColor = isHighRisk ? 'var(--status-danger)' : 'var(--brand-primary)';

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: '48px',
            background: disabled ? 'var(--bg-surface)' : 'var(--bg-input)',
            border: '1px solid',
            borderColor: isFocused ? focusColor : 'var(--border-subtle)',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
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

            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                style={{
                    flex: 1,
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '0 16px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'monospace',
                    color: isHighRisk ? 'var(--status-danger)' : 'var(--text-main)',
                }}
            />
        </div>
    );
};


// ========================================================================
// 2. THE COMMAND BOARD EXPORT
// ========================================================================
const SectorConsumerWeb = ({ 
    sectorState = {}, 
    onSettingChange 
}) => {
    // Isolate the schema for just this sector
    const sectorSchema = MASTER_SCHEMA[CONTROL_SECTORS.CONSUMER.id];

    // Icon Mapping for Text Inputs based on setting ID
    const getSettingIcon = (settingId) => {
        if (settingId.toLowerCase().includes('phone')) return Phone;
        if (settingId.toLowerCase().includes('whatsapp')) return MessageCircle;
        if (settingId.toLowerCase().includes('version')) return GitBranch;
        return Info;
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '32px',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px 32px'
        }}>
            {/* --- SECTOR HEADER --- */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Smartphone size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                        Consumer App & Web Storefront
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '600', lineHeight: '1.5', maxWidth: '600px' }}>
                        Manage the public-facing logistics of the AyaBus ecosystem. Changes applied here instantly propagate to the Consumer iOS/Android apps and the public web portal.
                    </p>
                </div>
            </div>

            {/* --- SCHEMA-DRIVEN GRID SYSTEM --- */}
            {/* Uses auto-fit minmax to perfectly reflow on any device screen size */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '24px' 
            }}>
                {Object.values(sectorSchema).map((settingDef) => {
                    const currentValue = sectorState[settingDef.id];
                    const isHighRisk = settingDef.riskLevel === RISK_LEVELS.HIGH || settingDef.riskLevel === RISK_LEVELS.CRITICAL;

                    return (
                        <div 
                            key={settingDef.id}
                            style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid',
                                borderColor: isHighRisk ? 'color-mix(in srgb, var(--status-danger) 20%, transparent)' : 'var(--border-subtle)',
                                borderRadius: '16px',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Danger Glow for Critical Settings */}
                            {isHighRisk && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--status-danger)' }} />
                            )}

                            {/* Card Header (Label & Badges) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label style={{ fontSize: '14px', fontWeight: '800', color: isHighRisk ? 'var(--status-danger)' : 'var(--text-main)' }}>
                                            {settingDef.label}
                                        </label>
                                        {isHighRisk && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', color: 'var(--status-danger)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                <AlertTriangle size={10} strokeWidth={3} /> {settingDef.riskLevel}
                                            </span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.4' }}>
                                        {settingDef.desc}
                                    </span>
                                </div>
                            </div>

                            {/* Card Blast Radius Warning (Only for High/Critical Risk) */}
                            {settingDef.blastRadius && (
                                <div style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--status-danger) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--status-danger) 15%, transparent)' }}>
                                    <ShieldAlert size={16} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span style={{ fontSize: '11px', color: 'var(--status-danger)', fontWeight: '700', lineHeight: '1.5' }}>
                                        <strong>Blast Radius:</strong> {settingDef.blastRadius}
                                    </span>
                                </div>
                            )}

                            {/* Dynamic Hardware Injection */}
                            <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                                {settingDef.type === INPUT_TYPES.TEXT && (
                                    <SovereignTextInput 
                                        value={currentValue}
                                        onChange={(val) => onSettingChange(settingDef.id, val)}
                                        riskLevel={settingDef.riskLevel}
                                        icon={getSettingIcon(settingDef.id)}
                                    />
                                )}

                                {settingDef.type === INPUT_TYPES.TOGGLE && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <KillSwitch 
                                            checked={currentValue === true}
                                            onChange={(val) => onSettingChange(settingDef.id, val)}
                                            riskLevel={settingDef.riskLevel}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SectorConsumerWeb;