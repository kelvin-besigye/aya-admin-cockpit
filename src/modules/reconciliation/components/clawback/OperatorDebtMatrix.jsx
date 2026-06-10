import React from 'react';
import { 
    Building2, Receipt, ShieldCheck, ArrowRight, 
    AlertTriangle, Calculator, FileWarning, Lock 
} from 'lucide-react';

/**
 * 👑 AYABUS OPERATOR DEBT MATRIX (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt
 * File: OperatorDebtMatrix.jsx
 * * DESCRIPTION:
 * The Right-Panel Action Vault. Takes the active ticket and the 
 * mathematical output of the Physics Engine to display the exact 
 * Double-Entry ledger offsets before sending to the Approvals Firewall.
 */

const OperatorDebtMatrix = ({ 
    selectedTicket, 
    calculationResult, 
    onProcessAction, 
    isProcessing = false 
}) => {

    // --- FINANCIAL FORMATTER ---
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'UGX', 
            minimumFractionDigits: 0 
        }).format(amount || 0);
    };

    // =========================================================
    // STATE 1: NO TICKET SELECTED (Locked View)
    // =========================================================
    if (!selectedTicket || !calculationResult) {
        return (
            <div style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                height: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', padding: '40px', textAlign: 'center' 
            }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px dashed var(--border-subtle)' }}>
                    <Lock size={32} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                </div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                    Vault is Locked
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '300px' }}>
                    Select a pending cancellation from the Triage Queue to calculate liability and unlock the action matrix.
                </p>
            </div>
        );
    }

    // --- DATA EXTRACTION ---
    const operatorName = selectedTicket.partners?.company_name || 'Unknown Operator';
    const operatorId = selectedTicket.partner_id || selectedTicket.partners?.id || 'N/A';
    const { status, metrics, financials } = calculationResult;
    const isChecksumValid = status === 'VALID';

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', height: '100%', 
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            
            {/* =========================================================
                1. HEADER: OPERATOR IDENTITY
                ========================================================= */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--brand-primary-subtle)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={24} strokeWidth={2} />
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Operator Vault Target
                        </div>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                            {operatorName}
                        </h2>
                    </div>
                </div>
            </div>

            {/* =========================================================
                2. PHYSICS ENGINE LEDGER (The Proof of Math)
                ========================================================= */}
            <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-canvas)' }}>
                
                {/* Penalty Metrics Summary */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Departure Delta</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>{metrics.hours_until_departure} hrs</div>
                    </div>
                    <div style={{ flex: 1, padding: '16px', background: 'var(--bg-surface)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--status-warning)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Applied Penalty</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--status-warning)' }}>{metrics.penalty_applied_pct}%</div>
                    </div>
                </div>

                {/* Ledger Breakdown */}
                <h3 style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calculator size={16} /> Settlement Breakdown
                </h3>
                
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
                    {/* A. Customer Refund */}
                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Customer Payout</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Base Fare minus Penalty</div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--status-danger)', fontFamily: 'monospace' }}>
                            {formatMoney(financials.payout_customer_refund)}
                        </div>
                    </div>

                    {/* B. Platform Yield */}
                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', background: 'var(--brand-primary-subtle)' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--brand-primary)' }}>Platform Net Yield</div>
                            <div style={{ fontSize: '11px', color: 'var(--brand-primary)', opacity: 0.8, marginTop: '4px' }}>Tax + 50% Penalty Share</div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--brand-primary)', fontFamily: 'monospace' }}>
                            +{formatMoney(financials.yield_platform_total)}
                        </div>
                    </div>

                    {/* C. Operator Compensation */}
                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--status-success)' }}>Operator Compensation</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Empty Seat Retainer (Penalty Share)</div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--status-success)', fontFamily: 'monospace' }}>
                            +{formatMoney(financials.yield_operator_compensation)}
                        </div>
                    </div>
                </div>

                {/* CHECKSUM ALERT */}
                {!isChecksumValid && (
                    <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', display: 'flex', gap: '12px', color: 'var(--status-danger)' }}>
                        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>CHECKSUM FAILURE</div>
                            <div style={{ fontSize: '11px', lineHeight: '1.5' }}>Fractions do not equal original receipt. Processing locked to prevent platform leakage. Contact L9 Administrator.</div>
                        </div>
                    </div>
                )}
            </div>

            {/* =========================================================
                3. ACTION FOOTER: THE CLAWBACK TRIGGER
                ========================================================= */}
            <div style={{ padding: '24px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
                
                {/* The Clawback Display */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '16px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Treasury Offset Target
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '600' }}>
                            Debt to be charged to Operator
                        </div>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--status-danger)', letterSpacing: '-1px' }}>
                        -{formatMoney(financials.debt_operator_clawback)}
                    </div>
                </div>

                {/* The Submit Button */}
                <button 
                    onClick={() => onProcessAction(selectedTicket, calculationResult)}
                    disabled={!isChecksumValid || isProcessing}
                    style={{ 
                        width: '100%', height: '56px', borderRadius: '16px', 
                        background: isChecksumValid ? 'var(--brand-primary)' : 'var(--bg-input)', 
                        color: isChecksumValid ? '#FFF' : 'var(--text-muted)', 
                        border: 'none', cursor: isChecksumValid && !isProcessing ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        fontWeight: '900', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase',
                        boxShadow: isChecksumValid && !isProcessing ? '0 10px 25px var(--brand-primary-subtle)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isChecksumValid && !isProcessing ? 'translateY(0)' : 'none'
                    }}
                    onMouseEnter={(e) => { if(isChecksumValid && !isProcessing) e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={(e) => { if(isChecksumValid && !isProcessing) e.currentTarget.style.transform = 'translateY(0)' }}
                >
                    {isProcessing ? (
                        <>ENCRYPTING DATA <span style={{ animation: 'pulse 1.5s infinite' }}>...</span></>
                    ) : (
                        <>
                            <ShieldCheck size={20} strokeWidth={2.5} />
                            SUBMIT TO L9 APPROVAL
                        </>
                    )}
                </button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Action will lock ticket and send payload to Approvals Module.
                </div>
            </div>

            {/* Injected Animations */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>

        </div>
    );
};

export default OperatorDebtMatrix;