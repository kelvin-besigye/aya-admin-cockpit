import React, { useMemo } from 'react';
import { 
    Wallet, ArrowRightLeft, Clock, CheckCircle2, 
    Landmark, CreditCard, ShieldAlert 
} from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { formatPartnerId } from '../../data/partner.utils';

/**
 * 👑 PARTNER FINANCIALS (Level 5: The Micro Financial View - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: PartnerFinancials.jsx
 * * DESCRIPTION:
 * A read-only, high-fidelity viewport into the Treasury for a specific operator.
 * Visualizes their Gross Sales, Platform Deductions, and Net Payout Queue.
 * * UPGRADES:
 * - Embedded Finance UI: Dynamically highlights Liquidity Advances and T+0 privileges.
 * - Anti-Squish Ledger: Bi-directional scrollable viewport for the payout queue.
 * - Shared Visual DNA: Mirrors the exact CSS grid physics of the Master Treasury.
 */

// Safe inline currency formatter to guarantee execution
const formatMoney = (amount, currency = 'UGX') => {
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
};

const PartnerFinancials = ({ 
    partner, 
    isLoading = false,
    activeCurrency = 'UGX'
}) => {

    // ========================================================================
    // 1. DATA SAFEGUARDS & FINANCIAL MOCK ENGINE (Pre-Backend)
    // ========================================================================
    const { tier, metrics, payouts, summary } = useMemo(() => {
        if (!partner) return { tier: null, metrics: null, payouts: [], summary: {} };

        // In a real system, these would be fetched via partnerService.getPartnerFinancials()
        // We generate high-fidelity simulated ledger rows based on their health
        const baseVolume = 15000000; // 15M UGX baseline
        const gross = baseVolume * (partner.healthScore / 100);
        const platformFee = gross * 0.08; // 8% AyaBus Yield
        const penalties = partner.yieldLeakage?.totalLeakage || 0;
        const netPayable = gross - platformFee - penalties;

        const simulatedPayouts = [
            { id: 'SET-9921', date: 'Today, 14:30', gross: gross * 0.4, fee: (gross * 0.4) * 0.08, net: (gross * 0.4) * 0.92, status: partner.tier.id === 'PLATINUM' ? 'SETTLED' : 'PENDING' },
            { id: 'SET-9918', date: 'Yesterday', gross: gross * 0.3, fee: (gross * 0.3) * 0.08, net: (gross * 0.3) * 0.92, status: 'SETTLED' },
            { id: 'SET-9890', date: '3 Days Ago', gross: gross * 0.3, fee: (gross * 0.3) * 0.08, net: (gross * 0.3) * 0.92, status: 'SETTLED' }
        ];

        return { 
            tier: partner.tier, 
            metrics: partner.performance, 
            payouts: simulatedPayouts,
            summary: { gross, platformFee, penalties, netPayable }
        };
    }, [partner]);

    // ========================================================================
    // 2. CSS GRID DEFINITION (The Ledger Anatomy)
    // ========================================================================
    const GRID_TEMPLATE = '2fr 2fr 1.5fr 2fr 1.5fr';

    // ========================================================================
    // 3. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
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
                        <Wallet size={20} color="var(--brand-primary)" />
                        Treasury & Payouts
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Live settlement queue and embedded finance privileges.
                    </p>
                </div>

                {/* THE EMBEDDED FINANCE INDICATOR (Reads directly from DNA) */}
                {!isLoading && tier && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        
                        {/* Liquidity Advance Line */}
                        {tier.perks.liquidityAdvanceMax > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: '16px', borderRight: '1px solid var(--border-subtle)' }}>
                                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Landmark size={10} /> Max Cash Advance
                                </span>
                                <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: tier.color, letterSpacing: '-0.5px' }}>
                                    {formatMoney(tier.perks.liquidityAdvanceMax, activeCurrency)}
                                </span>
                            </div>
                        )}

                        {/* Settlement Window Indicator */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Settlement Velocity
                            </span>
                            <div style={{ 
                                display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px',
                                padding: '2px 8px', borderRadius: '4px',
                                background: `color-mix(in srgb, ${tier.color} 10%, transparent)`,
                                color: tier.color, fontSize: '14px', fontWeight: '900', fontFamily: 'monospace'
                            }}>
                                <Clock size={14} strokeWidth={2.5} />
                                {tier.perks.settlementWindow}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* === B. THE MACRO KPI STRIP === */}
            <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px', padding: '24px 32px', background: 'var(--bg-canvas)',
                borderBottom: '1px solid var(--border-subtle)'
            }}>
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="animate-pulse" style={{ height: '64px', borderRadius: '12px', background: 'var(--bg-input)' }} />)
                ) : (
                    <>
                        <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Processed</span>
                            <div style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', marginTop: '4px' }}>
                                {formatMoney(summary.gross, activeCurrency)}
                            </div>
                        </div>
                        <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Platform Yield (8%)</span>
                            <div style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--status-warning)', marginTop: '4px' }}>
                                -{formatMoney(summary.platformFee, activeCurrency)}
                            </div>
                        </div>
                        <div style={{ padding: '16px', background: `color-mix(in srgb, var(--brand-primary) 5%, transparent)`, borderRadius: '12px', border: `1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)` }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Net Payable</span>
                            <div style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--brand-primary)', marginTop: '4px' }}>
                                {formatMoney(summary.netPayable, activeCurrency)}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* === C. THE BI-DIRECTIONAL LEDGER VIEWPORT === */}
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)' }} className="ayabus-scroll-area">
                
                {/* The 800px Anchor: Forces horizontal scroll on mobile to protect data */}
                <div style={{ minWidth: '800px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    
                    {/* Sticky Ledger Header */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                        padding: '12px 32px', background: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <span>Settlement ID & Date</span>
                        <span>Gross Sales</span>
                        <span>Platform Fee</span>
                        <span>Net Payout</span>
                        <span>Status</span>
                    </div>

                    {/* Scrollable Ledger Rows */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {isLoading && [1,2,3].map(i => (
                            <div key={i} style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div className="animate-pulse" style={{ height: '24px', background: 'var(--bg-input)', borderRadius: '8px' }} />
                            </div>
                        ))}

                        {!isLoading && payouts.map(payout => (
                            <div key={payout.id} style={{
                                display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                                padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)',
                                transition: 'background 0.2s ease', cursor: 'default'
                            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                
                                {/* Col 1: ID & Date */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                                    <span style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)' }}>{payout.id}</span>
                                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>{payout.date}</span>
                                </div>

                                {/* Col 2: Gross */}
                                <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                                    {formatMoney(payout.gross, activeCurrency)}
                                </span>

                                {/* Col 3: Fee */}
                                <span style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--status-warning)' }}>
                                    -{formatMoney(payout.fee, activeCurrency)}
                                </span>

                                {/* Col 4: Net Payout */}
                                <span style={{ fontSize: '15px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>
                                    {formatMoney(payout.net, activeCurrency)}
                                </span>

                                {/* Col 5: Status */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '4px 10px', borderRadius: '100px',
                                        background: payout.status === 'SETTLED' ? 'color-mix(in srgb, var(--status-success) 10%, transparent)' : 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
                                        color: payout.status === 'SETTLED' ? 'var(--status-success)' : 'var(--status-warning)',
                                        fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'
                                    }}>
                                        {payout.status === 'SETTLED' ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <Clock size={12} strokeWidth={2.5} />}
                                        {payout.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PartnerFinancials;