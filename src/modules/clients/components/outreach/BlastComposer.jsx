import React, { useState, useMemo, useEffect } from 'react';
import { 
    Megaphone, Users, Map, Wallet, Send, 
    AlertTriangle, ShieldCheck, Zap, 
    CheckCircle2, Info, BusFront, Crown
} from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { BLAST_TEMPLATES } from '../../data/clients.constants';

/**
 * 👑 PRE-EMPTIVE BLAST COMPOSER (Level 5: Outreach Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: BlastComposer.jsx
 * * DESCRIPTION:
 * The "God-Move" engine. Allows L9 Admins to target an entire physical manifest, 
 * draft a mass notification, and instantly deploy wallet credits to all affected 
 * passengers simultaneously.
 * * UPGRADES:
 * - Bi-Directional Lock: 1100px minimum width prevents UI wrapping and clipping.
 * - Independent Viewports: Left and Right panes scroll vertically independently.
 * - Omni-Scroll Parent: Gracefully handles horizontal scrolling on smaller screens.
 * - Premium Sandbox: Enhanced glassy notification UI and responsive scaling.
 */

// Standard Currency Formatter
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
};

const BlastComposer = () => {
    // ========================================================================
    // 1. HIGH-FIDELITY MOCK MANIFESTS (Fleet Anomaly Integration)
    // ========================================================================
    const ACTIVE_MANIFESTS = useMemo(() => [
        { id: 'TRP-104K', route: 'Kampala → Mbarara', operator: 'Global Coaches', asset: 'UBM-104K', paxCount: 58, vipCount: 8, status: 'BROKEN_DOWN', delayMins: 120 },
        { id: 'TRP-882A', route: 'Kampala → Gulu', operator: 'Nile Star Buses', asset: 'UBL-882A', paxCount: 65, vipCount: 12, status: 'DELAYED', delayMins: 45 },
        { id: 'TRP-990C', route: 'Entebbe → Kampala', operator: 'Gateway Transport', asset: 'UBJ-990C', paxCount: 42, vipCount: 4, status: 'ON_TIME', delayMins: 0 },
        { id: 'TRP-445Y', route: 'Mbale → Kampala', operator: 'YY Coaches', asset: 'UBA-445Y', paxCount: 60, vipCount: 2, status: 'DELAYED', delayMins: 25 },
    ], []);

    // ========================================================================
    // 2. STATE MANAGEMENT
    // ========================================================================
    const [targetManifest, setTargetManifest] = useState(ACTIVE_MANIFESTS[0]); 
    const [activeTemplate, setActiveTemplate] = useState(BLAST_TEMPLATES[0]);
    const [messageContent, setMessageContent] = useState(BLAST_TEMPLATES[0].message);
    const [creditAmount, setCreditAmount] = useState(10000); 
    const [blastStatus, setBlastStatus] = useState('IDLE'); // 'IDLE' | 'DEPLOYING' | 'SUCCESS'

    // Sync template text when a new template is clicked
    useEffect(() => {
        if (activeTemplate) {
            setMessageContent(activeTemplate.message);
            if (activeTemplate.type === 'INFO' || activeTemplate.type === 'WARNING') {
                setCreditAmount(0); // Info blasts shouldn't have credits by default
            } else {
                setCreditAmount(10000);
            }
        }
    }, [activeTemplate]);

    // ========================================================================
    // 3. FINANCIAL IMPACT CALCULATOR
    // ========================================================================
    const treasuryImpact = targetManifest.paxCount * creditAmount;

    // ========================================================================
    // 4. BLAST EXECUTION ENGINE
    // ========================================================================
    const handleBlastExecution = () => {
        if (blastStatus !== 'IDLE') return;
        setBlastStatus('DEPLOYING');
        
        // Simulate network/treasury execution time
        setTimeout(() => {
            setBlastStatus('SUCCESS');
            
            // Auto-reset after 4 seconds
            setTimeout(() => {
                setBlastStatus('IDLE');
            }, 4000);
        }, 2500);
    };

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-canvas)', display: 'flex', flexDirection: 'column',
            flex: 1, minHeight: 0, overflow: 'hidden'
        }}>
            
            {/* Inject Deployment & Device Keyframes */}
            <style>
                {`
                    @keyframes deploySweep {
                        0% { width: 0%; opacity: 1; }
                        50% { width: 100%; opacity: 0.8; }
                        100% { width: 100%; opacity: 0; }
                    }
                    @keyframes pulseIcon {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.15); color: #fff; }
                        100% { transform: scale(1); }
                    }
                    @keyframes slideDownNotification {
                        0% { transform: translateY(-20px); opacity: 0; }
                        100% { transform: translateY(0); opacity: 1; }
                    }
                `}
            </style>

            {/* === A. MASTER HEADER === */}
            <div style={{ 
                padding: '32px 40px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '24px', background: 'var(--bg-surface)', flexShrink: 0
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
                        <Megaphone size={28} color="var(--brand-accent)" />
                        Pre-Emptive Blast Engine
                    </h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Target full manifests to deploy mass communications and treasury credits instantly.
                    </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', borderRadius: '12px', border: '1px solid color-mix(in srgb, var(--status-danger) 30%, transparent)', color: 'var(--status-danger)', boxShadow: '0 4px 12px color-mix(in srgb, var(--status-danger) 10%, transparent)' }}>
                    <ShieldCheck size={20} strokeWidth={2.5} />
                    <span style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>L9 Clearance Required</span>
                </div>
            </div>

            {/* === B. OMNI-SCROLL VIEWPORT === */}
            {/* This container allows horizontal scrolling if the screen is narrower than 1100px */}
            <div className="ayabus-scroll-area" style={{ flex: 1, display: 'flex', overflow: 'auto' }}>
                
                {/* 1100px Strict Width Anchor: Prevents layout wrapping/clipping */}
                <div style={{ display: 'flex', minWidth: '1100px', flex: 1, height: '100%' }}>
                    
                    {/* === LEFT PANE: TARGETING & COMPOSER === */}
                    {/* Scrolls vertically independently */}
                    <div className="ayabus-scroll-area" style={{ 
                        flex: 1, padding: '40px', borderRight: '1px solid var(--border-subtle)',
                        display: 'flex', flexDirection: 'column', gap: '40px', background: 'var(--bg-canvas)', overflowY: 'auto'
                    }}>
                        
                        {/* Section 1: Target Manifest Selection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Map size={16} /></div>
                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Select Target Manifest</h4>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {ACTIVE_MANIFESTS.map(manifest => (
                                    <ManifestCard 
                                        key={manifest.id} 
                                        manifest={manifest} 
                                        isActive={targetManifest.id === manifest.id} 
                                        onClick={() => setTargetManifest(manifest)} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Template Selection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Zap size={16} /></div>
                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Load Strategic Template</h4>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                {BLAST_TEMPLATES.map(template => (
                                    <TemplateChip 
                                        key={template.id} 
                                        template={template} 
                                        isActive={activeTemplate.id === template.id} 
                                        onClick={() => setActiveTemplate(template)} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Section 3: The Payload Composer */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'color-mix(in srgb, var(--brand-accent) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-accent)' }}><Megaphone size={18} /></div>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>3. Configure Payload</h4>
                            </div>
                            
                            <textarea 
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                style={{ 
                                    width: '100%', height: '140px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', 
                                    borderRadius: '16px', padding: '20px', fontSize: '15px', color: 'var(--text-main)', 
                                    fontWeight: '600', fontFamily: 'inherit', resize: 'none', outline: 'none', lineHeight: '1.6'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                            />

                            {/* Treasury Attachment Zone */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: 'color-mix(in srgb, var(--brand-primary) 5%, transparent)', borderRadius: '16px', border: '1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'color-mix(in srgb, var(--brand-primary) 15%, transparent)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Wallet size={28} strokeWidth={2.5} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                                    <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>Attach Courtesy Credit</span>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>This amount will be deposited directly to every passenger's wallet.</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '6px 6px 6px 16px', borderRadius: '14px', border: '2px solid var(--brand-primary)', boxShadow: '0 8px 24px color-mix(in srgb, var(--brand-primary) 15%, transparent)' }}>
                                    <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-muted)' }}>UGX</span>
                                    <input 
                                        type="number" 
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(Number(e.target.value))}
                                        style={{ 
                                            width: '140px', background: 'transparent', border: 'none', 
                                            padding: '8px 12px', fontSize: '20px', fontWeight: '900', 
                                            fontFamily: 'monospace', color: 'var(--brand-primary)', textAlign: 'right', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === C. RIGHT PANE: LIVE PREVIEW & EXECUTION === */}
                    {/* Fixed 450px width, scrolls vertically independently */}
                    <div className="ayabus-scroll-area" style={{ 
                        width: '450px', flexShrink: 0, display: 'flex', flexDirection: 'column', 
                        background: 'var(--bg-surface)', position: 'relative', overflowY: 'auto'
                    }}>
                        
                        {/* Device Preview Zone */}
                        <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--bg-canvas) 50%, transparent)' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '32px' }}>
                                Device Simulation
                            </span>
                            
                            {/* The CSS Smartphone Lock Screen 2.0 */}
                            <div style={{ 
                                width: '320px', height: '540px', borderRadius: '48px', background: '#09090b', 
                                border: '12px solid #18181b', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.2), inset 0 0 0 2px #3f3f46',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '80px', overflow: 'hidden'
                            }}>
                                {/* The "Dynamic Island" Notch */}
                                <div style={{ position: 'absolute', top: '16px', width: '100px', height: '30px', background: '#000', borderRadius: '20px', zIndex: 10 }} />
                                
                                {/* Dynamic Glassy Notification Bubble */}
                                <div style={{ 
                                    width: '92%', padding: '20px', background: 'rgba(255,255,255,0.85)', 
                                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                                    borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '10px', 
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)', animation: 'slideDownNotification 0.5s ease-out'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BusFront size={14} color="#fff" />
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#18181b', letterSpacing: '0.5px' }}>AyaBus OS</span>
                                        </div>
                                        <span style={{ fontSize: '11px', color: '#71717a', fontWeight: '600' }}>now</span>
                                    </div>
                                    <span style={{ fontSize: '15px', fontWeight: '900', color: '#09090b', marginTop: '4px' }}>{activeTemplate.title}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#3f3f46', lineHeight: '1.5' }}>{messageContent || 'Message preview...'}</span>
                                    
                                    {creditAmount > 0 && (
                                        <div style={{ marginTop: '8px', padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Wallet size={16} color="#059669" />
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#059669' }}>{formatCurrency(creditAmount)} credited to Wallet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Execution Zone (Impact Calculator & Blast Button) */}
                        <div style={{ padding: '40px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', position: 'relative', marginTop: 'auto' }}>
                            
                            {/* Blast Deployment Animation Overlay */}
                            {blastStatus === 'DEPLOYING' && (
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', background: 'var(--status-danger)', animation: 'deploySweep 2.5s ease-out forwards' }} />
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '24px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Treasury Impact</span>
                                    <span style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--brand-accent)', letterSpacing: '-1px', lineHeight: '1' }}>
                                        {formatCurrency(treasuryImpact)}
                                    </span>
                                </div>
                                <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recipients</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Users size={20} color="var(--text-main)" />
                                        <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1' }}>{targetManifest.paxCount}</span>
                                    </div>
                                </div>
                            </div>

                            {blastStatus === 'SUCCESS' ? (
                                <button style={{ 
                                    width: '100%', padding: '24px', borderRadius: '16px', background: 'var(--status-success)', 
                                    color: '#fff', fontSize: '16px', fontWeight: '900', border: 'none', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                                }}>
                                    <CheckCircle2 size={24} strokeWidth={3} /> Payload Successfully Deployed
                                </button>
                            ) : (
                                <button 
                                    onClick={handleBlastExecution}
                                    disabled={blastStatus === 'DEPLOYING'}
                                    style={{ 
                                        width: '100%', padding: '24px', borderRadius: '16px', 
                                        background: blastStatus === 'DEPLOYING' ? 'var(--bg-input)' : 'var(--status-danger)', 
                                        color: blastStatus === 'DEPLOYING' ? 'var(--text-muted)' : '#fff', 
                                        fontSize: '16px', fontWeight: '900', border: 'none', cursor: blastStatus === 'DEPLOYING' ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                        transition: 'all 0.2s ease', boxShadow: blastStatus === 'DEPLOYING' ? 'none' : '0 12px 36px rgba(239, 68, 68, 0.35)'
                                    }}
                                >
                                    <Send size={20} strokeWidth={3} style={{ animation: blastStatus === 'DEPLOYING' ? 'pulseIcon 1s infinite' : 'none' }} /> 
                                    {blastStatus === 'DEPLOYING' ? 'Uplinking to Fleet Devices...' : 'AUTHORIZE L9 BLAST'}
                                </button>
                            )}
                            <span style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                                This action cannot be undone. Funds will be deducted from the Master Treasury Ledger immediately.
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const ManifestCard = ({ manifest, isActive, onClick }) => {
    const isCritical = manifest.status === 'BROKEN_DOWN' || manifest.status === 'DELAYED';
    const statusColor = isCritical ? 'var(--status-danger)' : 'var(--status-success)';

    return (
        <div onClick={onClick} style={{
            padding: '24px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s ease',
            background: isActive ? 'var(--bg-surface)' : 'var(--bg-canvas)',
            border: `2px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
            boxShadow: isActive ? '0 16px 40px color-mix(in srgb, var(--brand-primary) 12%, transparent)' : '0 4px 12px rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'column', gap: '20px'
        }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--brand-primary) 40%, transparent)'; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>{manifest.route}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)' }}>Asset: {manifest.asset}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: `color-mix(in srgb, ${statusColor} 10%, transparent)`, color: statusColor, fontSize: '11px', fontWeight: '900' }}>
                    {isCritical ? <AlertTriangle size={14} strokeWidth={3} /> : <CheckCircle2 size={14} strokeWidth={3} />}
                    {manifest.delayMins > 0 ? `${manifest.delayMins}m Late` : 'On Time'}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    <Users size={18} color="var(--text-muted)" /> {manifest.paxCount} Pax
                </div>
                {manifest.vipCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '900', color: 'var(--brand-accent)' }}>
                        <Crown size={16} /> {manifest.vipCount} VIPs Aboard
                    </div>
                )}
            </div>
        </div>
    );
};

const TemplateChip = ({ template, isActive, onClick }) => {
    let color = 'var(--brand-primary)';
    let Icon = Info;
    if (template.type === 'WALLET_CREDIT') { color = 'var(--status-success)'; Icon = Wallet; }
    if (template.type === 'WARNING') { color = 'var(--status-warning)'; Icon = AlertTriangle; }

    return (
        <button onClick={onClick} style={{
            padding: '20px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s ease',
            background: isActive ? `color-mix(in srgb, ${color} 10%, transparent)` : 'var(--bg-surface)',
            border: `2px solid ${isActive ? color : 'var(--border-subtle)'}`,
            display: 'flex', alignItems: 'flex-start', gap: '16px', flex: '1 1 auto', textAlign: 'left',
            boxShadow: isActive ? `0 12px 30px color-mix(in srgb, ${color} 15%, transparent)` : '0 4px 12px rgba(0,0,0,0.02)'
        }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = `color-mix(in srgb, ${color} 50%, transparent)`; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
            <div style={{ color: isActive ? color : 'var(--text-muted)', marginTop: '2px' }}><Icon size={20} strokeWidth={2.5} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: '900', color: isActive ? 'var(--text-main)' : 'var(--text-main)' }}>{template.title}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{template.trigger}</span>
            </div>
        </button>
    );
};

export default BlastComposer;
