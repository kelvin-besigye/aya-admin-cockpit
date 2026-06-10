import React, { useState } from 'react';
import { 
    FileText, ShieldAlert, AlertTriangle, 
    Type, AlignLeft, ToggleRight, LayoutTemplate
} from 'lucide-react';

// Import Master OS Laws and Hardware
import { MASTER_SCHEMA, CONTROL_SECTORS, INPUT_TYPES, RISK_LEVELS } from '../../data/control.constants';
import KillSwitch from '../inputs/KillSwitch';

/**
 * 👑 AYA BUS COMMAND BOARD: Ticket & Boarding Pass (Level 4: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SectorTicketConfig.jsx
 * * DESCRIPTION:
 * The physical command board for Sector 2. Controls the dynamic injection 
 * of data fields, legal policies, and QR codes into the passenger's digital ticket.
 * * UPGRADES:
 * - Bifurcated Render Engine: Intelligently separates Toggles from TextAreas for optimized spatial layout.
 * - Sovereign Text Area: A high-capacity, auto-expanding input for legal/policy definitions.
 * - Live State Sync: Edits here prepare the exact payload the NoSQL diff engine expects.
 * - Pure React Physics: 100% compliant hover and focus state management.
 */

// ========================================================================
// 1. HARDWARE: SOVEREIGN TEXT INPUT (Standard String)
// ========================================================================
const SovereignTextInput = ({ value, onChange, disabled, riskLevel, placeholder }) => {
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
            {isHighRisk && !isFocused && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--status-danger)', zIndex: 2 }} />
            )}
            <div style={{ paddingLeft: '16px', color: isFocused ? focusColor : 'var(--text-muted)', transition: 'color 0.2s ease' }}>
                <Type size={18} strokeWidth={2.5} />
            </div>
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                placeholder={placeholder}
                style={{
                    flex: 1, height: '100%', background: 'transparent', border: 'none', outline: 'none',
                    padding: '0 16px', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace',
                    color: isHighRisk ? 'var(--status-danger)' : 'var(--text-main)',
                }}
            />
        </div>
    );
};

// ========================================================================
// 2. HARDWARE: SOVEREIGN TEXT AREA (Multi-line Legal Policies)
// ========================================================================
const SovereignTextArea = ({ value, onChange, disabled, riskLevel }) => {
    const [isFocused, setIsFocused] = useState(false);
    const isHighRisk = riskLevel === RISK_LEVELS.HIGH || riskLevel === RISK_LEVELS.CRITICAL;
    const focusColor = isHighRisk ? 'var(--status-danger)' : 'var(--brand-primary)';

    return (
        <div style={{
            position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '120px',
            background: disabled ? 'var(--bg-surface)' : 'var(--bg-input)',
            border: '1px solid', borderColor: isFocused ? focusColor : 'var(--border-subtle)',
            borderRadius: '12px', transition: 'all 0.2s ease',
            boxShadow: isFocused ? `0 0 0 3px color-mix(in srgb, ${focusColor} 15%, transparent)` : 'none',
            overflow: 'hidden', padding: '12px'
        }}>
            {isHighRisk && !isFocused && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--status-danger)', zIndex: 2 }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: isFocused ? focusColor : 'var(--text-muted)', transition: 'color 0.2s ease' }}>
                <AlignLeft size={16} strokeWidth={2.5} />
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Document Editor</span>
            </div>
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                style={{
                    flex: 1, width: '100%', background: 'transparent', border: 'none', outline: 'none',
                    resize: 'vertical', minHeight: '80px', fontSize: '13px', fontWeight: '600',
                    lineHeight: '1.6', color: isHighRisk ? 'var(--status-danger)' : 'var(--text-main)',
                }}
            />
        </div>
    );
};

// ========================================================================
// 3. THE COMMAND BOARD EXPORT
// ========================================================================
const SectorTicketConfig = ({ 
    sectorState = {}, 
    onSettingChange 
}) => {
    // 1. Extract the Sector Schema
    const sectorSchema = MASTER_SCHEMA[CONTROL_SECTORS.TICKET_CONFIG.id];

    // 2. Bifurcate the Schema for Optimized Rendering
    const toggleSettings = Object.values(sectorSchema).filter(s => s.type === INPUT_TYPES.TOGGLE);
    const textSettings = Object.values(sectorSchema).filter(s => s.type === INPUT_TYPES.TEXT || s.type === INPUT_TYPES.TEXTAREA);

    // 3. Reusable Card Wrapper to maintain DRY principles
    const SettingCard = ({ settingDef, children }) => {
        const isHighRisk = settingDef.riskLevel === RISK_LEVELS.HIGH || settingDef.riskLevel === RISK_LEVELS.CRITICAL;
        const isMediumRisk = settingDef.riskLevel === RISK_LEVELS.MEDIUM;

        return (
            <div style={{
                background: 'var(--bg-surface)', border: '1px solid',
                borderColor: isHighRisk ? 'color-mix(in srgb, var(--status-danger) 30%, transparent)' : (isMediumRisk ? 'color-mix(in srgb, var(--status-warning) 30%, transparent)' : 'var(--border-subtle)'),
                borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
                position: 'relative', overflow: 'hidden'
            }}>
                {isHighRisk && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--status-danger)' }} />}
                {isMediumRisk && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--status-warning)' }} />}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '800', color: isHighRisk ? 'var(--status-danger)' : (isMediumRisk ? 'var(--status-warning)' : 'var(--text-main)') }}>
                                {settingDef.label}
                            </label>
                            {(isHighRisk || isMediumRisk) && (
                                <span style={{ 
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', 
                                    background: isHighRisk ? 'color-mix(in srgb, var(--status-danger) 10%, transparent)' : 'color-mix(in srgb, var(--status-warning) 10%, transparent)', 
                                    color: isHighRisk ? 'var(--status-danger)' : 'var(--status-warning)', 
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

                {settingDef.blastRadius && (
                    <div style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '8px', background: 'color-mix(in srgb, var(--status-danger) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--status-danger) 15%, transparent)' }}>
                        <ShieldAlert size={16} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '11px', color: 'var(--status-danger)', fontWeight: '700', lineHeight: '1.5' }}>
                            <strong>Blast Radius:</strong> {settingDef.blastRadius}
                        </span>
                    </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', height: '100%', 
            overflowY: 'auto', overflowX: 'hidden', padding: '24px 32px' 
        }}>
            
            {/* --- SECTOR HEADER --- */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                        Ticket & Boarding Pass Engine
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '600', lineHeight: '1.5', maxWidth: '650px' }}>
                        Configure the exact fields, legal policies, and verification markers that are printed on passenger digital passes and downloadable PDFs across the ecosystem.
                    </p>
                </div>
            </div>

            {/* --- SECTION A: VISUAL DATA TOGGLES --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                    <ToggleRight size={18} />
                    <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Layout & Verification Injections</h2>
                </div>
                
                {/* High-density grid for simple toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {toggleSettings.map(setting => (
                        <SettingCard key={setting.id} settingDef={setting}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <KillSwitch 
                                    checked={sectorState[setting.id] === true}
                                    onChange={(val) => onSettingChange(setting.id, val)}
                                    riskLevel={setting.riskLevel}
                                />
                            </div>
                        </SettingCard>
                    ))}
                </div>
            </div>

            {/* --- SECTION B: LEGAL & POLICIES (TEXT) --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                    <LayoutTemplate size={18} />
                    <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Printed Policies & Communications</h2>
                </div>
                
                {/* Expansive grid for heavy text content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                    {textSettings.map(setting => (
                        <SettingCard key={setting.id} settingDef={setting}>
                            {setting.type === INPUT_TYPES.TEXTAREA ? (
                                <SovereignTextArea 
                                    value={sectorState[setting.id]}
                                    onChange={(val) => onSettingChange(setting.id, val)}
                                    riskLevel={setting.riskLevel}
                                />
                            ) : (
                                <SovereignTextInput 
                                    value={sectorState[setting.id]}
                                    onChange={(val) => onSettingChange(setting.id, val)}
                                    riskLevel={setting.riskLevel}
                                    placeholder="Enter footer message..."
                                />
                            )}
                        </SettingCard>
                    ))}
                </div>
            </div>

            {/* Spacer for scroll clearance */}
            <div style={{ height: '40px', flexShrink: 0 }} />
        </div>
    );
};

export default SectorTicketConfig;