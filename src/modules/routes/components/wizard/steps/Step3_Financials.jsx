import React from 'react';
import { 
  CreditCard, Banknote, Coins, Calculator, Wallet, 
  ArrowRight, TrendingUp, DollarSign, ShieldCheck 
} from 'lucide-react';
import { ROUTE_RULES } from '../../../data/routes.constants';

/**
 * STEP 3: FINANCIALS (The Revenue Engine)
 * ------------------------------------------------------------------
 * Configures the pricing model for the route.
 * * * WORLD CLASS FEATURES:
 * 1. VISUAL EQUATION: Clearly shows (Base Price + Tax = Total).
 * 2. REVENUE CLARITY: Distinctly labels "Operator Share" vs "Platform Share".
 * 3. REAL-TIME MATH: Instant feedback on the final customer price.
 */

const Step3_Financials = ({ formData, onChange, errors = {} }) => {

  // 1. CALCULATIONS
  const price = parseFloat(formData.ticketPrice) || 0;
  const tax = parseFloat(formData.serviceTax) || 0;
  const total = price + tax;

  // 2. FORMATTER
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-UG', { 
      style: 'decimal', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // 3. HANDLER
  const handleChange = (field, value) => {
    // Prevent negative numbers
    if (value < 0) return;
    onChange({ ...formData, [field]: value });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* 1. HEADER CONTEXT */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          width: '56px', height: '56px', margin: '0 auto 16px', 
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <Wallet size={28} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '24px', marginBottom: '8px' }}>
          Revenue Configuration
        </h3>
        <p className="text-muted" style={{ fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
          Define the pricing structure. The system automatically handles the split payments between the Operator and the Platform.
        </p>
      </div>

      {/* 2. MAIN CARD */}
      <div className="citadel-card" style={{ padding: '0', overflow: 'hidden', borderTop: '4px solid var(--brand-primary)' }}>
        
        {/* Header Bar */}
        <div style={{ 
          padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--brand-primary)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <CreditCard size={16} color="var(--text-inverse)" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)' }}>
              Pricing & Wiring
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
             STEP 3 OF 4
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

          {/* --- THE EQUATION GRID --- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* A. OPERATOR SHARE (Ticket Price) */}
            <div style={{ position: 'relative' }}>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', color: '#16a34a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Banknote size={14} /> Operator Revenue
                </div>
              </label>
              
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>UGX</span>
                <input
                  type="number"
                  min={ROUTE_RULES.MIN_PRICE}
                  max={ROUTE_RULES.MAX_PRICE}
                  value={formData.ticketPrice || ''}
                  onChange={(e) => handleChange('ticketPrice', e.target.value)}
                  placeholder="0"
                  style={{ 
                    width: '100%', padding: '16px 16px 16px 60px', 
                    border: errors.ticketPrice ? '1px solid var(--status-danger)' : '1px solid var(--border-subtle)', 
                    borderRadius: '12px', outline: 'none',
                    fontSize: '20px', fontWeight: '700', fontFamily: 'monospace',
                    background: 'var(--bg-surface)', color: 'var(--text-main)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                  }}
                />
              </div>
              
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Base fare wired directly to the Bus Company account.
              </div>
              
              {errors.ticketPrice && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--status-danger)', fontWeight: '600' }}>
                  {errors.ticketPrice}
                </div>
              )}
            </div>

            {/* PLUS SIGN */}
            <div style={{ paddingTop: '42px', color: 'var(--text-muted)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>+</div>
            </div>

            {/* B. PLATFORM SHARE (Service Tax) */}
            <div style={{ position: 'relative' }}>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', color: '#2563eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Coins size={14} /> Platform Fee
                </div>
              </label>
              
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>UGX</span>
                <input
                  type="number"
                  min="0"
                  value={formData.serviceTax || ''}
                  onChange={(e) => handleChange('serviceTax', e.target.value)}
                  placeholder="0"
                  style={{ 
                    width: '100%', padding: '16px 16px 16px 60px', 
                    border: errors.serviceTax ? '1px solid var(--status-danger)' : '1px solid var(--border-subtle)', 
                    borderRadius: '12px', outline: 'none',
                    fontSize: '20px', fontWeight: '700', fontFamily: 'monospace',
                    background: 'var(--bg-surface)', color: 'var(--text-main)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                  }}
                />
              </div>

              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Service charge wired to the Citadel Platform account.
              </div>

              {errors.serviceTax && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--status-danger)', fontWeight: '600' }}>
                  {errors.serviceTax}
                </div>
              )}
            </div>

          </div>

          {/* --- C. TOTAL SUMMARY (The Customer View) --- */}
          <div style={{ 
            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', 
            borderRadius: '16px', padding: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '10px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--brand-primary)'
              }}>
                <Calculator size={24} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Customer Total
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Final price displayed on the mobile app
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--brand-primary)', fontFamily: 'monospace', lineHeight: '1' }}>
                <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '600', marginRight: '4px' }}>UGX</span>
                {formatMoney(total)}
              </div>
            </div>
          </div>

          {/* D. AUDIT NOTE */}
          <div style={{ display: 'flex', gap: '12px', padding: '0 12px' }}>
            <ShieldCheck size={16} color="var(--status-success)" style={{ marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--text-main)' }}>Secure Routing Active:</strong> 
              &nbsp;The system will automatically split payments at the gateway level. No manual reconciliation required.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Step3_Financials;