import React, { useState } from 'react';
import { ChevronRight, ShieldAlert, AlertCircle, RefreshCcw, ArrowUpRight } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { PAYMENT_GATEWAYS, LEDGER_STATUS } from '../../data/treasury.constants';
import { formatCurrency } from '../../data/treasury.utils';

/**
 * 👑 ANOMALY ROW (Level 5: The Ground Truth - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: AnomalyRow.jsx
 * * DESCRIPTION:
 * A high-density, strictly grid-aligned transaction row specifically 
 * for disputes, refunds, and gateway failures.
 * * UPGRADES:
 * - Anti-Squish Lock: Enforces a strict 1050px minimum width.
 * - CSS Grid Integrity: Uses minWidth: 0 on text containers to guarantee 
 * perfect ellipsis truncation for long gateway error reasons.
 * - Semantic Color-Mix: Adapts to dark/light mode flawlessly while retaining
 * strict danger/warning color theory.
 */

const AnomalyRow = ({ 
  transaction, 
  activeCurrency = 'UGX', 
  exchangeRate = 1,
  onClick // Triggers Level 6: TransactionInspector
}) => {

  const [isHovered, setIsHovered] = useState(false);

  // ========================================================================
  // 1. DATA SAFEGUARDS & EXTRACTION
  // ========================================================================
  if (!transaction) return null;

  const partnerName = transaction.partners?.company_name || 'Unknown Operator';
  const gateway = PAYMENT_GATEWAYS[transaction.payment_gateway] || { label: transaction.payment_gateway || 'SYSTEM', color: 'var(--text-muted)' };
  
  // Resolve Status (Fallback to FAILED if not matched)
  const status = LEDGER_STATUS[transaction.status] || LEDGER_STATUS.FAILED;

  // ========================================================================
  // 2. FINANCIAL IMPACT LOGIC
  // ========================================================================
  // FAILED = Money never arrived (Neutral gray line-through)
  // REFUNDED / CHARGEBACK = Money leaving the system (Negative red)
  const isLoss = transaction.status === 'REFUNDED' || transaction.status === 'CHARGEBACK';
  const amountColor = isLoss ? 'var(--status-danger)' : 'var(--text-muted)';
  const amountPrefix = isLoss ? '-' : '';
  const amountDecoration = transaction.status === 'FAILED' ? 'line-through' : 'none';

  // ========================================================================
  // 3. TEMPORAL FORMATTING
  // ========================================================================
  const txDate = new Date(transaction.created_at);
  const dateStr = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).format(txDate);
  const timeStr = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(txDate);

  // Status Icon Resolver
  const StatusIcon = transaction.status === 'CHARGEBACK' ? ShieldAlert :
                     transaction.status === 'REFUNDED' ? RefreshCcw : AlertCircle;

  // ========================================================================
  // 4. RENDER ENGINE
  // ========================================================================
  return (
    <button
      onClick={() => onClick(transaction)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        minWidth: '1050px', // THE CRITICAL UPGRADE: Prevents squishing on small screens
        display: 'grid',
        // STRICT CSS GRID: Proportional to LedgerRow but with extra room for the Anomaly Reason
        gridTemplateColumns: '1.5fr 2fr 1.5fr 1.5fr 1.5fr 40px',
        alignItems: 'center',
        padding: '16px 24px', // Expanded hit area
        // Semantic Danger Hover State
        background: isHovered ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none',
        position: 'relative',
        fontFamily: 'inherit'
      }}
    >
      
      {/* --- KINETIC DANGER HIGHLIGHT --- */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: isLoss ? 'var(--status-danger)' : 'var(--text-muted)',
        opacity: isHovered ? 1 : 0.4,
        transition: 'all 0.2s ease',
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px'
      }} />

      {/* === COL 1: TIMESTAMP & ID === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {dateStr}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '600' }}>
            {timeStr}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--border-subtle)' }}>•</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '600' }}>
            #{transaction.id?.substring(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* === COL 2: CONTEXT (OPERATOR) === */}
      {/* minWidth: 0 is CRITICAL for truncation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '24px' }}>
        <span style={{ 
          fontSize: '13px', fontWeight: '800', color: 'var(--text-main)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
        }}>
          {partnerName}
        </span>
        <span style={{ 
          fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600'
        }}>
          Anomaly Record
        </span>
      </div>

      {/* === COL 3: PAYMENT GATEWAY === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: gateway.color, opacity: 0.6 }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>
            {gateway.label}
          </span>
        </div>
        <span style={{ 
          fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '4px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          Ref: {transaction.gateway_ref || 'N/A'}
          {transaction.gateway_ref && <ArrowUpRight size={10} style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease', flexShrink: 0 }} />}
        </span>
      </div>

      {/* === COL 4: FINANCIAL IMPACT (RED / GRAY) === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', paddingRight: '32px', minWidth: 0 }}>
        <span style={{ 
          fontSize: '15px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '-0.5px',
          color: amountColor, textDecoration: amountDecoration 
        }}>
          {amountPrefix}{formatCurrency(transaction.gross_amount, activeCurrency, exchangeRate)}
        </span>
        {isLoss && (
          <span style={{ fontSize: '10px', color: 'var(--status-danger)', fontWeight: '800', textTransform: 'uppercase' }}>
            Ledger Deduction
          </span>
        )}
      </div>

      {/* === COL 5: STATUS & REASON === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', minWidth: 0, paddingRight: '16px' }}>
        <div style={{
          padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
          background: `color-mix(in srgb, ${status.color} 10%, transparent)`, // Flawless Dark/Light Mode blending
          border: `1px solid color-mix(in srgb, ${status.color} 20%, transparent)`,
          color: status.color,
          fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          <StatusIcon size={12} strokeWidth={2.5} />
          {status.label}
        </div>
        
        {/* Dynamic Width Truncation for Error Messages */}
        <span style={{ 
          fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', 
          width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          display: 'block' // Required for width: 100% truncation to work inside flex child
        }} title={transaction.anomaly_reason || 'System sync failure / Reason not specified'}>
          {transaction.anomaly_reason || 'System sync failure / Reason not specified'}
        </span>
      </div>

      {/* === COL 6: ACTION INDICATOR === */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: isHovered ? 'rgba(239, 68, 68, 0.1)' : 'transparent', // Danger-tinted hover box
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}>
          <ChevronRight 
            size={18} 
            color={isHovered ? 'var(--status-danger)' : 'var(--border-subtle)'} 
            style={{ 
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)', 
              transition: 'all 0.2s ease' 
            }} 
          />
        </div>
      </div>

    </button>
  );
};

export default AnomalyRow;