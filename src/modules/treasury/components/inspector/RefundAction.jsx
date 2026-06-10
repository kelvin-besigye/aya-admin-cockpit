import React, { useState } from 'react';
import { RefreshCcw, AlertTriangle, Loader2, ShieldX, CheckCircle } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { treasuryService } from '../../data/treasury.service';
import { formatCurrency } from '../../data/treasury.utils';

/**
 * REFUND ACTION (Level 6: The Microscope)
 * ------------------------------------------------------------------
 * A high-security, multi-state action component for voiding transactions.
 * Features a double-lock confirmation to prevent accidental liquidity loss.
 */

const RefundAction = ({ 
  transaction, 
  activeCurrency = 'UGX', 
  exchangeRate = 1,
  onSuccess // Callback to refresh the ledger/inspector
}) => {
  const [state, setState] = useState('IDLE'); // IDLE | CONFIRMING | PROCESSING | COMPLETED | ERROR
  const [reason, setReason] = useState('');

  if (!transaction) return null;

  // 1. ACTION HANDLER: PUSH TO GATEWAY
  const executeRefund = async () => {
    if (!reason.trim()) return alert("Please provide a reason for the refund.");
    
    setState('PROCESSING');
    try {
      // Direct link to our Level 1 Service Layer
      const result = await treasuryService.initiateRefund(transaction.id, {
        reason: reason,
        amount: transaction.gross_amount,
        gateway_ref: transaction.gateway_ref
      });

      if (result.success) {
        setState('COMPLETED');
        if (onSuccess) setTimeout(() => onSuccess(result.updatedTransaction), 1500);
      } else {
        setState('ERROR');
      }
    } catch (err) {
      console.error("Refund Protocol Failed:", err);
      setState('ERROR');
    }
  };

  // --- RENDER LOGIC: THE COMPACT SECURITY CARD ---
  return (
    <div style={{
      padding: '20px', borderRadius: '12px', border: `1px solid ${state === 'CONFIRMING' ? 'var(--status-danger)' : 'var(--border-subtle)'}`,
      background: state === 'CONFIRMING' ? 'rgba(239, 68, 68, 0.02)' : 'var(--bg-input)',
      transition: 'all 0.3s ease'
    }}>
      
      {state === 'IDLE' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Transaction Reversal</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Void this ticket and return funds to source.</p>
          </div>
          <button 
            onClick={() => setState('CONFIRMING')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)', color: 'var(--status-danger)', fontWeight: '700',
              fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <RefreshCcw size={14} /> Refund
          </button>
        </div>
      )}

      {state === 'CONFIRMING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle color="var(--status-danger)" size={20} />
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--status-danger)' }}>Critical Action Required</span>
          </div>
          
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
            You are about to refund <strong style={{ fontFamily: 'monospace' }}>{formatCurrency(transaction.gross_amount, activeCurrency, exchangeRate)}</strong>. 
            Funds will be pulled from the operator's pending balance. This cannot be undone.
          </p>

          <input 
            type="text"
            placeholder="Reason for refund (Internal audit requirement)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--status-danger)',
              background: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '13px', outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={executeRefund}
              disabled={!reason.trim()}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                background: 'var(--status-danger)', color: '#fff', fontWeight: '800',
                cursor: reason.trim() ? 'pointer' : 'not-allowed', opacity: reason.trim() ? 1 : 0.5
              }}
            >
              Confirm Refund
            </button>
            <button 
              onClick={() => setState('IDLE')}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', fontWeight: '700', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {state === 'PROCESSING' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px' }}>
          <Loader2 size={24} className="animate-spin" color="var(--brand-primary)" />
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Handshaking with Payment Gateway...</span>
        </div>
      )}

      {state === 'COMPLETED' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px' }}>
          <CheckCircle size={24} color="var(--status-success)" />
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--status-success)' }}>Refund Processed Successfully</span>
        </div>
      )}

      {state === 'ERROR' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px' }}>
          <ShieldX size={24} color="var(--status-danger)" />
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--status-danger)' }}>Gateway Rejected Refund Request</span>
          <button onClick={() => setState('IDLE')} style={{ fontSize: '11px', color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Retry Authentication</button>
        </div>
      )}

    </div>
  );
};

export default RefundAction;
