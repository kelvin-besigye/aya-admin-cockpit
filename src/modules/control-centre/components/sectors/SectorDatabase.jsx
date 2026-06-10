import React from 'react';
import { 
    Server, ShieldAlert, AlertTriangle, 
    Database, HardDrive, Zap
} from 'lucide-react';

// Import Master OS Laws and Hardware
import { MASTER_SCHEMA, CONTROL_SECTORS, INPUT_TYPES, RISK_LEVELS } from '../../data/control.constants';
import SovereignStepper from '../inputs/SovereignStepper';

/**
 * 👑 AYA BUS COMMAND BOARD: Database & Engine (Level 4: Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Control Centre
 * File: SectorDatabase.jsx
 * * DESCRIPTION:
 * The physical command board for Sector 7. Governs backend infrastructure limits,
 * edge caching refresh rates, and immutable cold storage (WORM) migration.
 * * UPGRADES:
 * - DDoS Protection Awareness: Automatically highlights CRITICAL rate limiting parameters.
 * - Hardware Iconography: Natively maps HardDrive, Zap, and Database icons based on config keys.
 * - Schema-Driven Render Engine: Infinitely scalable without frontend updates.
 * - Fluid Grid Physics: Uses minmax(420px, 1fr) to prevent Stepper hardware from crushing.
 */

const SectorDatabase = ({ 
    sectorState = {}, 
    onSettingChange 
}) => {
    // 1. Isolate the schema for the Database sector
    const sectorSchema = MASTER_SCHEMA[CONTROL_SECTORS.DATABASE.id] || {};

    // 2. Icon Mapper for visual cognitive routing
    const getSettingIcon = (settingId) => {
        const id = settingId.toLowerCase();
        if (id.includes('worm') || id.includes('archive')) return HardDrive;
        if (id.includes('cache') || id.includes('ttl')) return Zap;
        if (id.includes('rate') || id.includes('limit') || id.includes('api')) return Database;
        return Server;
    };

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '32px', 
            width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '24px 32px' 
        }}>
            
            {/* --- SECTOR HEADER --- */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Server size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                        Database & NoSQL Infrastructure
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, fontWeight: '600', lineHeight: '1.5', maxWidth: '650px' }}>
                        Govern the underlying physics of the AyaBus cloud engine. Control data lifecycle policies, memory caching speeds, and network request ceilings to prevent DDoS vectors.
                    </p>
                </div>
            </div>

            {/* --- GLOBAL WARNING BANNER --- */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--status-warning) 25%, transparent)' }}>
                <ShieldAlert size={20} color="var(--status-warning)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--status-warning)', fontWeight: '700', lineHeight: '1.4' }}>
                    <strong>INFRASTRUCTURE NOTICE:</strong> Adjusting Cache TTLs directly affects database query loads. Ensure the database cluster is scaled to handle higher read-volumes before lowering the TTL.
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
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ height: '40px', flexShrink: 0 }} />
        </div>
    );
};

export default SectorDatabase;