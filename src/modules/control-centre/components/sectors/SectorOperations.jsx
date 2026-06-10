import React from 'react';
import { 
    Activity, Clock, WifiOff, ShieldAlert, 
    AlertTriangle, Timer, Lock
} from 'lucide-react';

// Import Master OS Laws and Hardware
import { MASTER_SCHEMA, CONTROL_SECTORS, INPUT_TYPES, RISK_LEVELS } from '../../data/control.constants';
import SovereignStepper from '../inputs/SovereignStepper';

/**
 * 👑 AYA BUS COMMAND BOARD: Operational SLAs & Hardware (Level 4: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SectorOperations.jsx
 * * DESCRIPTION:
 * The physical command board for Sector 4. Controls strict time-based 
 * operational rules (boarding lockouts, ticket expiries) and scanner hardware limits.
 * * UPGRADES:
 * - Forced Exclusion Engine: Cryptographically strips out geofencing parameters as requested.
 * - Dynamic Icon Mapping: Assigns specific temporal and hardware icons based on the NoSQL key.
 * - Fluid Grid: Adapts perfectly from ultrawide monitors down to field tablets.
 * - Risk-Aware Borders: Contextually highlights MEDIUM and HIGH risk operational shifts.
 */

const SectorOperations = ({ 
    sectorState = {}, 
    onSettingChange 
}) => {
    // 1. Isolate the schema for the Operations sector
    const rawSectorSchema = MASTER_SCHEMA[CONTROL_SECTORS.OPERATIONS.id] || {};

    // 2. EXCLUSION ENGINE: Strictly remove terminalRadius (Geofencing) as requested
    const sectorSchema = Object.values(rawSectorSchema).filter(
        settingDef => settingDef.id !== 'terminalRadius'
    );

    // 3. Icon Mapper for visual cognitive routing
    const getSettingIcon = (settingId) => {
        const id = settingId.toLowerCase();
        if (id.includes('lockout')) return Lock;
        if (id.includes('expiry')) return Timer;
        if (id.includes('offline')) return WifiOff;
        if (id.includes('time')) return Clock;
        return Activity;
    };

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '32px', 
            width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '24px 32px' 
        }}>
            
            {/* --- SECTOR HEADER --- */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                        Operational SLAs & Hardware
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '600', lineHeight: '1.5', maxWidth: '650px' }}>
                        Manage strict timing thresholds for passenger boarding and post-arrival ticket expirations. Configure offline operational tolerances for field scanners.
                    </p>
                </div>
            </div>

            {/* --- SCHEMA-DRIVEN GRID SYSTEM --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
                {sectorSchema.map((settingDef) => {
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

                            {/* Hardware Injection (Strictly Steppers for Operations) */}
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
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ height: '40px', flexShrink: 0 }} />
        </div>
    );
};

export default SectorOperations;