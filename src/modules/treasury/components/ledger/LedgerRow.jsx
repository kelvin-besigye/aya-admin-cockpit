import React, { useState } from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { PAYMENT_GATEWAYS, LEDGER_STATUS } from '../../data/treasury.constants';
import { formatCurrency } from '../../data/treasury.utils';

/**
 * 👑 LEDGER ROW (Level 5: The Ground Truth - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: LedgerRow.jsx
 * * DESCRIPTION:
 * A high-density, strictly grid-aligned transaction row.
 * * UPGRADES:
 * - Anti-Squish Lock: Enforces a strict 1050px minimum width.
 * - CSS Grid Integrity: Uses minWidth: 0 on text containers to guarantee 
 * perfect ellipsis truncation without blowing out the grid tracks.
 * - Dynamic Color-Mixing: Uses CSS color-mix for flawless status badges in Dark/Light mode.
 */

const LedgerRow = ({ 
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

  // Extract nested data safely
  const partnerName = transaction.partners?.company_name || 'Unknown Operator';
  const routeName = transaction.routes ? `${transaction.routes.origin_city} → ${transaction.routes.destination_city}` : 'Unknown Route';
  
  // Resolve DNA Constants (Fallback gracefully if gateway/status isn't in dictionary)
  const gateway = PAYMENT_GATEWAYS[transaction.payment_gateway] || { label: transaction.payment_gateway || 'SYSTEM', color: 'var(--text-muted)' };
  const status = LEDGER_STATUS[transaction.status] || LEDGER_STATUS.SETTLED;

  // ========================================================================
  // 2. TEMPORAL FORMATTING
  // ========================================================================
  // Formats strictly to: "Feb 20, 2026" and "14:30:45"
  const txDate = new Date(transaction.created_at);
  const dateStr = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).format(txDate);
  const timeStr = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(txDate);

  // ========================================================================
  // 3. RENDER ENGINE
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
        // STRICT CSS GRID: 1.5fr (Date) | 2.5fr (Context) | 1.5fr (Gateway) | 1.5fr (Money) | 1fr (Status) | 40px (Icon)
        gridTemplateColumns: '1.5fr 2.5fr 1.5fr 1.5fr 1fr 40px', 
        alignItems: 'center',
        padding: '16px 24px', // Expanded hit area for better tactile response
        background: isHovered ? 'var(--bg-hover)' : 'var(--bg-surface)',
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
      
      {/* --- KINETIC HOVER HIGHLIGHT --- */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: isHovered ? 'var(--brand-primary)' : 'transparent',
        transition: 'background 0.2s ease',
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

      {/* === COL 2: CONTEXT (OPERATOR & ROUTE) === */}
      {/* minWidth: 0 is CRITICAL here to allow the text-overflow ellipsis to function inside CSS Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '24px' }}>
        <span style={{ 
          fontSize: '13px', fontWeight: '800', color: 'var(--text-main)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
        }}>
          {partnerName}
        </span>
        <span style={{ 
          fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
        }}>
          {routeName}
        </span>
      </div>

      {/* === COL 3: PAYMENT GATEWAY === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: gateway.color, boxShadow: `0 0 8px ${gateway.color}40` }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>
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

      {/* === COL 4: FINANCIALS (GROSS & YIELD) === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', paddingRight: '32px', minWidth: 0 }}>
        <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'monospace', letterSpacing: '-0.5px' }}>
          {formatCurrency(transaction.gross_amount, activeCurrency, exchangeRate)}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700' }}>
          Yield: <span style={{ color: 'var(--status-success)' }}>{formatCurrency(transaction.platform_fee, activeCurrency, exchangeRate)}</span>
        </span>
      </div>

      {/* === COL 5: STATUS BADGE === */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <div style={{
          padding: '4px 10px', borderRadius: '8px',
          background: `color-mix(in srgb, ${status.color} 10%, transparent)`, // Flawless Dark/Light mode blending
          color: status.color,
          fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px',
          border: `1px solid color-mix(in srgb, ${status.color} 20%, transparent)`
        }}>
          {status.label}
        </div>
      </div>

      {/* === COL 6: ACTION INDICATOR === */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: isHovered ? 'var(--bg-input)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}>
          <ChevronRight 
            size={18} 
            color={isHovered ? 'var(--brand-primary)' : 'var(--border-subtle)'} 
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

export default LedgerRow;