import React, { useState, useMemo } from 'react';
import { 
    Landmark, Lock, Unlock, TrendingUp, AlertTriangle, 
    Banknote, CheckCircle2, Clock, ChevronRight, Activity 
} from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { formatCurrency, formatCompactCurrency } from '../../data/partner.utils';

/**
 * 👑 LIQUIDITY HUB (Level 6: Embedded Finance - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: LiquidityHub.jsx
 * * DESCRIPTION:
 * The capital deployment engine. Allows highly-rated partners to request 
 * instant cash advances against future ticket sales to maintain fleet health.
 * * UPGRADES:
 * - Algorithmic Gatekeeping: Locks UI for partners below Gold Tier.
 * - Live Amortization: Visually calculates repayment terms instantly.
 * - Bi-Directional Ledger: Tracks active advances and repayment progress.
 */

const LiquidityHub = ({ 
    partner, 
    isLoading = false,
    activeCurrency = 'UGX',
    exchangeRate = 1
}) => {

    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [requestAmount, setRequestAmount] = useState(0);

    // ========================================================================
    // 2. FINANCIAL MATH & MOCK ENGINE
    // ========================================================================
    const { eligibility, advanceMath, activeAdvances } = useMemo(() => {
        if (!partner) return { eligibility: null, advanceMath: null, activeAdvances: [] };

        const maxAdvance = partner.tier.perks.liquidityAdvanceMax || 0;
        const isEligible = maxAdvance > 0;
        
        // Advance Math: Platform takes a flat 2% capital deployment fee
        const feePercentage = 0.02; 
        const platformFee = requestAmount * feePercentage;
        const netDisbursement = requestAmount;
        const totalRepayment = requestAmount + platformFee;

        // Mock Active Advances Ledger
        const mocks = isEligible ? [
            { id: 'ADV-992-B', date: 'Last Month', amount: 5000000, repaid: 5000000, status: 'CLEARED' },
            { id: 'ADV-104-X', date: 'Last Week', amount: 15000000, repaid: 10500000, status: 'REPAYING' }
        ] : [];

        return {
            eligibility: { isEligible, maxAdvance, currentHealth: partner.healthScore },
            advanceMath: { platformFee, netDisbursement, totalRepayment },
            activeAdvances: mocks
        };
    }, [partner, requestAmount]);

    // Handle Slider Change
    const handleSliderChange = (e) => {
        const value = Number(e.target.value);
        setRequestAmount(value);
    };

    // ========================================================================
    // 3. CSS GRID DEFINITION (The Advance Ledger)
    // ========================================================================
    const GRID_TEMPLATE = '1.5fr 1.5fr 2.5fr 1fr';

    // ========================================================================
    // 4. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '650px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden'
        }}>
            
            {/* === A. MASTER HEADER === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '20px', background: 'var(--bg-surface)', zIndex: 20
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <Landmark size={20} color="#F59E0B" />
                        AyaBus Capital & Liquidity
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Embedded cash advances against projected ticket yield.
                    </p>
                </div>

                {/* Eligibility Status Badge */}
                {!isLoading && eligibility && (
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                        background: eligibility.isEligible ? 'color-mix(in srgb, #F59E0B 10%, transparent)' : 'var(--bg-input)', 
                        borderRadius: '12px', border: `1px solid ${eligibility.isEligible ? 'color-mix(in srgb, #F59E0B 30%, transparent)' : 'var(--border-subtle)'}` 
                    }}>
                        {eligibility.isEligible ? <Unlock size={16} color="#F59E0B" /> : <Lock size={16} color="var(--text-muted)" />}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: eligibility.isEligible ? '#F59E0B' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Facility Status
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '900', color: eligibility.isEligible ? '#F59E0B' : 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                {eligibility.isEligible ? 'UNLOCKED' : 'LOCKED'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {isLoading ? (
                 <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="animate-pulse" style={{ height: '200px', borderRadius: '16px', background: 'var(--bg-input)' }} />
                    <div className="animate-pulse" style={{ height: '60px', borderRadius: '12px', background: 'var(--bg-input)' }} />
                 </div>
            ) : !eligibility?.isEligible ? (
                
                // === B. LOCKED STATE (Gamification Engine) ===
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <Lock size={40} color="var(--text-muted)" strokeWidth={1.5} />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                        Capital Facility Locked
                    </h2>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.6' }}>
                        Liquidity advances are an exclusive perk for Gold and Platinum partners. Improve your Algorithmic Health Score to unlock instant fleet capital.
                    </p>
                    
                    <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'var(--bg-canvas)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Score</span>
                            <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--status-danger)' }}>{eligibility?.currentHealth}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--border-subtle)' }}><ChevronRight size={24} /></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase' }}>Target Score (Gold)</span>
                            <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace', color: '#F59E0B' }}>80+</span>
                        </div>
                    </div>
                </div>

            ) : (

                // === C. UNLOCKED FACILITY (The Control Panel) ===
                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
                    
                    {/* LEFT PANE: Request Engine */}
                    <div className="ayabus-scroll-area" style={{ flex: '1 1 450px', padding: '32px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', overflowY: 'auto' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Available Limit
                            </span>
                            <span style={{ fontSize: '28px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-1px' }}>
                                {formatCurrency(eligibility.maxAdvance, activeCurrency, exchangeRate)}
                            </span>
                        </div>

                        {/* The Fluid Range Slider */}
                        <div style={{ marginBottom: '32px' }}>
                            <input 
                                type="range" 
                                min="0" max={eligibility.maxAdvance} step="500000"
                                value={requestAmount}
                                onChange={handleSliderChange}
                                style={{ width: '100%', cursor: 'pointer', accentColor: '#F59E0B' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>0</span>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#F59E0B' }}>MAX</span>
                            </div>
                        </div>

                        {/* Live Ledger Breakdown */}
                        <div style={{ background: 'var(--bg-canvas)', borderRadius: '16px', border: '1px solid var(--border-subtle)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Requested Capital</span>
                                <span style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                                    {formatCurrency(requestAmount, activeCurrency, exchangeRate)}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Activity size={14} color="var(--brand-accent)" />
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Platform Fee (Flat 2%)</span>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--brand-accent)' }}>
                                    +{formatCurrency(advanceMath.platformFee, activeCurrency, exchangeRate)}
                                </span>
                            </div>

                            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Total Repayment</span>
                                <span style={{ fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: '#F59E0B' }}>
                                    {formatCurrency(advanceMath.totalRepayment, activeCurrency, exchangeRate)}
                                </span>
                            </div>

                        </div>

                        {/* Terms & CTA */}
                        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: 'color-mix(in srgb, #F59E0B 5%, transparent)', borderRadius: '12px' }}>
                            <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                By confirming, <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(advanceMath.totalRepayment, activeCurrency, exchangeRate)}</strong> will be automatically deducted from your upcoming daily settlement queues until the balance is cleared.
                            </p>
                        </div>

                        <button 
                            disabled={requestAmount === 0}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px', marginTop: '24px',
                                background: requestAmount > 0 ? '#F59E0B' : 'var(--bg-input)', 
                                color: requestAmount > 0 ? '#fff' : 'var(--text-muted)',
                                border: 'none', cursor: requestAmount > 0 ? 'pointer' : 'not-allowed',
                                fontSize: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'all 0.2s ease', boxShadow: requestAmount > 0 ? '0 4px 16px rgba(245, 158, 11, 0.3)' : 'none'
                            }}
                        >
                            <Banknote size={18} strokeWidth={2.5} /> Deploy Capital Now
                        </button>
                    </div>

                    {/* RIGHT PANE: Active Advances Ledger */}
                    <div className="ayabus-scroll-area" style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
                        
                        {/* The 900px Anchor */}
                        <div style={{ minWidth: '900px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                            
                            <div style={{
                                position: 'sticky', top: 0, zIndex: 10,
                                display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                                padding: '16px 32px', background: 'color-mix(in srgb, var(--bg-canvas) 85%, transparent)',
                                borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(12px)',
                                fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'
                            }}>
                                <span style={{ paddingRight: '16px' }}>Advance ID</span>
                                <span style={{ paddingRight: '16px' }}>Principal Amount</span>
                                <span style={{ paddingRight: '24px' }}>Repayment Progress</span>
                                <span style={{ textAlign: 'right' }}>Status</span>
                            </div>

                            {activeAdvances.length === 0 ? (
                                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <CheckCircle2 size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>No Active Advances</div>
                                    <div style={{ fontSize: '12px', fontWeight: '600' }}>Your ledger is perfectly clean.</div>
                                </div>
                            ) : (
                                activeAdvances.map(adv => {
                                    const progressPct = (adv.repaid / adv.amount) * 100;
                                    const isCleared = adv.status === 'CLEARED';

                                    return (
                                        <div key={adv.id} style={{
                                            display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                                            padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>{adv.id}</span>
                                                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>{adv.date}</span>
                                            </div>

                                            <div style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)', paddingRight: '16px' }}>
                                                {formatCurrency(adv.amount, activeCurrency, exchangeRate)}
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, paddingRight: '24px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: isCleared ? 'var(--status-success)' : '#F59E0B' }}>
                                                        {formatCompactCurrency(adv.repaid, activeCurrency, exchangeRate)} Repaid
                                                    </span>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                                                        {progressPct.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${progressPct}%`, background: isCleared ? 'var(--status-success)' : '#F59E0B', borderRadius: '3px' }} />
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '100px',
                                                    background: isCleared ? 'color-mix(in srgb, var(--status-success) 10%, transparent)' : 'color-mix(in srgb, #F59E0B 10%, transparent)',
                                                    color: isCleared ? 'var(--status-success)' : '#F59E0B',
                                                    fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'
                                                }}>
                                                    {isCleared ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <Clock size={12} strokeWidth={2.5} />}
                                                    {adv.status}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiquidityHub;