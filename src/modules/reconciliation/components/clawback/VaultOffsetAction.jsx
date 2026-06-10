import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

/**
 * 👑 AYABUS VAULT OFFSET ACTION (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt
 * File: VaultOffsetAction.jsx
 * * DESCRIPTION:
 * The isolated execution zone for Clawbacks. Evaluates the Checksum 
 * from the Physics Engine and provides the physical trigger to lock 
 * the ticket and route it to the Level 9 Approvals Firewall.
 */

const VaultOffsetAction = ({ 
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

    // Failsafe: Do not render action zone if there's no math to evaluate
    if (!selectedTicket || !calculationResult) return null;

    const { status, financials } = calculationResult;
    const isChecksumValid = status === 'VALID';

    return (
        <div style={{ 
            padding: '24px', 
            background: 'var(--bg-surface)', 
            borderTop: '1px solid var(--border-subtle)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            position: 'relative',
            zIndex: 10
        }}>
            
            {/* =========================================================
                1. CHECKSUM SECURITY ALERT
                ========================================================= */}
            {!isChecksumValid && (
                <div style={{ 
                    marginBottom: '20px', padding: '16px', 
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', 
                    borderRadius: '12px', display: 'flex', gap: '12px', color: 'var(--status-danger)',
                    animation: 'pulse 2s infinite'
                }}>
                    <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: '900', marginBottom: '4px', letterSpacing: '0.5px' }}>
                            CRITICAL CHECKSUM FAILURE
                        </div>
                        <div style={{ fontSize: '11px', lineHeight: '1.5', fontWeight: '600' }}>
                            The financial split does not equal the original ticket price. Execution has been locked to prevent platform leakage. Contact Level 9 Administrator immediately.
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                2. THE CLAWBACK DISPLAY (What happens to the Operator)
                ========================================================= */}
            <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                marginBottom: '24px', padding: '20px', 
                background: 'var(--bg-input)', borderRadius: '16px', 
                border: '1px dashed var(--border-subtle)' 
            }}>
                <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Treasury Offset Target
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '600' }}>
                        Debt to be clawed back from Operator
                    </div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--status-danger)', letterSpacing: '-1px', fontFamily: 'monospace' }}>
                    -{formatMoney(financials.debt_operator_clawback)}
                </div>
            </div>

            {/* =========================================================
                3. THE MAKER-CHECKER TRIGGER
                ========================================================= */}
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
                    <>
                        ENCRYPTING PAYLOAD 
                        <span style={{ animation: 'pulse 1.5s infinite', marginLeft: '4px' }}>...</span>
                    </>
                ) : (
                    <>
                        <ShieldCheck size={20} strokeWidth={2.5} />
                        SUBMIT TO L9 APPROVAL
                    </>
                )}
            </button>
            
            {/* Action Disclaimer */}
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={12} />
                Action will lock this ticket and send the payload to the Approvals Module.
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default VaultOffsetAction;