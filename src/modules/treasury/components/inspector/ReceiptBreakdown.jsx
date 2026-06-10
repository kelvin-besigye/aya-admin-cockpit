import React from 'react';
import { ChevronDown, ArrowDownRight, CheckCircle2, ShieldCheck } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { formatCurrency } from '../../data/treasury.utils';

/**
 * RECEIPT BREAKDOWN (Level 6: The Microscope)
 * ------------------------------------------------------------------
 * A vertical financial waterfall visualizing the exact split of a single transaction.
 * Breaks down Gross Volume into Payouts, Fees, and Taxes with high precision.
 */

const ReceiptBreakdown = ({ 
  transaction, 
  activeCurrency = 'UGX', 
  exchangeRate = 1 
}) => {

  if (!transaction) return null;

  // 1. DATA CALCULATIONS
  const gross = Number(transaction.gross_amount || 0);
  const tax = Number(transaction.tax_liability || 0);
  const gatewayFee = Number(transaction.gateway_fee || 0);
  const platformYield = Number(transaction.platform_fee || 0);
  const partnerPayout = Number(transaction.partner_payout || 0);

  // Percentage Calculations
  const calculatePct = (val) => gross > 0 ? ((val / gross) * 100).toFixed(1) : '0.0';

  return (
    <div style={{
      background: 'var(--bg-input)', borderRadius: '12px', padding: '24px',
      border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px'
    }}>
      
      {/* === A. THE GROSS STARTING POINT === */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Volume</span>
          <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>
            {formatCurrency(gross, activeCurrency, exchangeRate)}
          </span>
        </div>
        <div style={{ padding: '6px 12px', borderRadius: '100px', background: 'var(--brand-primary)', color: '#fff', fontSize: '10px', fontWeight: '900' }}>
          100% BASE
        </div>
      </div>

      {/* Connection Line */}
      <div style={{ height: '20px', marginLeft: '12px', borderLeft: '2px dashed var(--border-subtle)' }} />

      {/* === B. DEDUCTIONS SECTION === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* 1. Tax Liability */}
        <BreakdownRow 
          label="Government Tax (VAT/Levy)" 
          value={tax} 
          pct={calculatePct(tax)} 
          type="deduction" 
          activeCurrency={activeCurrency} 
          exchangeRate={exchangeRate} 
        />

        {/* 2. Gateway Fee */}
        <BreakdownRow 
          label="Gateway Processing Fee" 
          value={gatewayFee} 
          pct={calculatePct(gatewayFee)} 
          type="deduction" 
          activeCurrency={activeCurrency} 
          exchangeRate={exchangeRate} 
        />

        {/* 3. Platform Yield */}
        <BreakdownRow 
          label="Platform Service Fee" 
          value={platformYield} 
          pct={calculatePct(platformYield)} 
          type="yield" 
          activeCurrency={activeCurrency} 
          exchangeRate={exchangeRate} 
        />

      </div>

      {/* Connection Line */}
      <div style={{ height: '20px', marginLeft: '12px', borderLeft: '2px dashed var(--border-subtle)', position: 'relative' }}>
        <ChevronDown size={14} style={{ position: 'absolute', bottom: '-8px', left: '-8px', color: 'var(--border-subtle)' }} />
      </div>

      {/* === C. FINAL SETTLEMENT (THE NET) === */}
      <div style={{ 
        marginTop: '8px', padding: '16px', borderRadius: '8px', 
        background: 'var(--bg-surface)', border: '1px solid var(--status-success)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} color="var(--status-success)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--status-success)', textTransform: 'uppercase' }}>Partner Payout</span>
              <span style={{ fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                {formatCurrency(partnerPayout, activeCurrency, exchangeRate)}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>{calculatePct(partnerPayout)}%</span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>NET SHARE</span>
          </div>
        </div>
      </div>

      {/* Footer Audit Stamp */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
        <ShieldCheck size={12} color="var(--text-muted)" />
        <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Verified by Citadel Treasury Engine
        </span>
      </div>

    </div>
  );
};

// --- SUB-COMPONENT: BREAKDOWN ROW ---
const BreakdownRow = ({ label, value, pct, type, activeCurrency, exchangeRate }) => {
  const isYield = type === 'yield';
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowDownRight size={14} color="var(--text-muted)" />
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ 
          display: 'block', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace',
          color: isYield ? 'var(--brand-primary)' : 'var(--text-main)' 
        }}>
          -{formatCurrency(value, activeCurrency, exchangeRate)}
        </span>
        <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>{pct}%</span>
      </div>
    </div>
  );
};

export default ReceiptBreakdown;