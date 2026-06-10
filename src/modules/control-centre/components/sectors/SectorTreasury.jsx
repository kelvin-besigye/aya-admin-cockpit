import React from 'react';
import { 
    Banknote, ShieldAlert, AlertTriangle, 
    Calculator, ArrowRightLeft, Scale 
} from 'lucide-react';

// Import Master OS Laws and Hardware
import { MASTER_SCHEMA, CONTROL_SECTORS, INPUT_TYPES, RISK_LEVELS } from '../../data/control.constants';
import SovereignStepper from '../inputs/SovereignStepper';

/**
 * 👑 AYA BUS COMMAND BOARD: Treasury & Physics (Level 4: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SectorTreasury.jsx
 * * DESCRIPTION:
 * The physical command board for Sector 3. Controls the global economic 
 * physics of the platform, including fees, penalties, and L9 approval thresholds.
 * * UPGRADES:
 * - Mathematical Armor: Natively deploys the Sovereign Stepper to enforce schema min/max limits.
 * - Dynamic Risk Badging: Auto-detects HIGH risk items and engages warning UI.
 * - Fluid Economics Grid: Adapts seamlessly from ultra-wide 4K to tablet views.
 * - Schema-Driven: Zero hardcoded inputs. Infinite future scalability.
 */

const SectorTreasury = ({ 
    sectorState = {}, 
    onSettingChange 
}) => {
    // 1. Isolate the schema for the Treasury sector
    const sectorSchema = MASTER_SCHEMA[CONTROL_SECTORS.TREASURY.id];

    // 2. Icon Mapper for visual context
    const getSettingIcon = (settingId) => {
        if (settingId.toLowerCase().includes('fee')) return Calculator;
        if (settingId.toLowerCase().includes('refund')) return ArrowRightLeft;
        if (settingId.toLowerCase().includes('limit')) return Scale;
        return Banknote;
    };

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '32px', 
            width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '24px 32px' 
        }}>
            
            {/* --- SECTOR HEADER --- */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--status-warning) 15%, transparent)', color: 'var(--status-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Banknote size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                        Treasury & Economic Physics
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '600', lineHeight: '1.5', maxWidth: '650px' }}>
                        Configure the mathematical foundation of the ecosystem. Changes to platform fees and refund penalties take effect immediately across all passenger checkouts and partner settlements.
                    </p>
                </div>
            </div>

            {/* --- GLOBAL WARNING BANNER --- */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background: 'color-mix(in srgb, var(--status-danger) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--status-danger) 20%, transparent)' }}>
                <ShieldAlert size={20} color="var(--status-danger)" />
                <span style={{ fontSize: '13px', color: 'var(--status-danger)', fontWeight: '700', lineHeight: '1.4' }}>
                    <strong>CRITICAL ZONE:</strong> All parameters on this board directly impact corporate revenue. Ensure changes align with the current quarter's approved financial strategy.
                </span>
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

                            {/* Hardware Injection (Strictly Steppers for Treasury) */}
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

export default SectorTreasury;