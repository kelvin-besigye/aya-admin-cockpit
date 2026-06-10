import React from 'react';
import { ShieldAlert, RefreshCw, TrendingUp, Activity, Lock } from 'lucide-react';

/**
 * 👑 AYABUS CLEARINGHOUSE HUD (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt
 * File: ClearinghouseHud.jsx
 * * DESCRIPTION:
 * The live financial telemetry for cancellations. Connects directly to the 
 * database engine to show un-recovered debt and platform yield.
 */

const ClearinghouseHud = ({ 
    metrics = { pendingLiability: 0, activeClawbacks: 0, netYield: 0 }, 
    isLoading = false 
}) => {

    // --- FINANCIAL FORMATTER ---
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'UGX', 
            minimumFractionDigits: 0 
        }).format(amount || 0);
    };

    // --- SKELETON LOADER (For when the Service Engine is fetching) ---
    if (isLoading) {
        return (
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: '140px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', animation: 'pulse 1.5s infinite', opacity: 0.5 }} />
                ))}
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            
            {/* =========================================================
                CARD 1: PENDING LIABILITY (Urgent Triage)
                Money we owe customers but haven't approved yet.
                ========================================================= */}
            <div style={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid rgba(239, 68, 68, 0.3)', // Red tint for urgency
                borderRadius: '24px', 
                padding: '24px',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.05)'
            }}>
                {/* Background Glow */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-danger)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <ShieldAlert size={14} /> Unresolved Liability
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                            Awaiting L1/L9 Action
                        </div>
                    </div>
                    {/* Live Pulse Dot */}
                    {metrics.pendingLiability > 0 && (
                        <div style={{ width: '8px', height: '8px', background: 'var(--status-danger)', borderRadius: '50%', boxShadow: '0 0 10px var(--status-danger)', animation: 'pulse 2s infinite' }} />
                    )}
                </div>

                <div style={{ position: 'relative', zIndex: 2, marginTop: '20px' }}>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px' }}>
                        {formatMoney(metrics.pendingLiability)}
                    </div>
                </div>
            </div>

            {/* =========================================================
                CARD 2: ACTIVE CLAWBACKS (Approved, Unsettled)
                Money operators hold that we are about to deduct.
                ========================================================= */}
            <div style={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border-subtle)', 
                borderTop: '3px solid var(--brand-primary)', // Corporate Blue indicator
                borderRadius: '24px', 
                padding: '24px',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--brand-primary-subtle) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <RefreshCw size={14} /> Active Clawbacks
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                            Approved, Pending Vault Offset
                        </div>
                    </div>
                    <Lock size={16} color="var(--brand-primary)" style={{ opacity: 0.5 }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2, marginTop: '20px' }}>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px' }}>
                        {formatMoney(metrics.activeClawbacks)}
                    </div>
                </div>
            </div>

            {/* =========================================================
                CARD 3: NET CANCELLATION YIELD (Pure Profit)
                Money AyaBus made from keeping 50% of the penalty.
                ========================================================= */}
            <div style={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid rgba(245, 158, 11, 0.3)', // Gold/Warning tint
                borderRadius: '24px', 
                padding: '24px',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.05)'
            }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-warning)', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <TrendingUp size={14} /> Net Platform Yield
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                            Retained Penalty Revenue
                        </div>
                    </div>
                    <Activity size={16} color="var(--status-warning)" style={{ opacity: 0.5 }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2, marginTop: '20px' }}>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px' }}>
                        {formatMoney(metrics.netYield)}
                    </div>
                </div>
            </div>

            {/* Injected Keyframes for the live pulse effect */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 15px var(--status-danger); }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
            `}</style>

        </div>
    );
};

export default ClearinghouseHud;