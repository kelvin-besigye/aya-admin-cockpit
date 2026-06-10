import React, { useState, useMemo } from 'react';
import { Scale, Receipt } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { REVENUE_TRANCHES } from '../../data/treasury.constants';
import { formatCurrency, formatCompactCurrency } from '../../data/treasury.utils';

/**
 * 👑 UNIT ECONOMICS BAR (Level 4: Dashboard Visual - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: UnitEconomicsBar.jsx
 * * DESCRIPTION:
 * A high-precision horizontal stacked bar charting the exact breakdown 
 * of Gross Volume into its constituent tranches (Payout, Yield, Fees, Taxes).
 * * UPGRADES (Phase 3.5):
 * - Anti-Squish Text Lock: Ledger labels dynamically truncate to protect financial data.
 * - Bi-Directional Sync: Hovering the bar highlights the ledger; hovering the ledger highlights the bar.
 * - Sovereign UI: 24px radius, 32px padding, deep shadows, fluid header.
 */

const UnitEconomicsBar = ({ 
  data = {}, // Expected: { gross_volume, partner_payout, platform_yield, gateway_fee, tax_liability }
  isLoading = false,
  activeCurrency = 'UGX',
  exchangeRate = 1
}) => {

  const [hoveredTranche, setHoveredTranche] = useState(null);

  // ========================================================================
  // 1. MATH ENGINE (Calculate Percentages & Map Tranches)
  // ========================================================================
  const { tranches, gross } = useMemo(() => {
    const rawGross = Number(data.gross_volume || 0);
    const rawPayout = Number(data.partner_payout || 0);
    const rawYield = Number(data.platform_yield || 0);
    const rawGateway = Number(data.gateway_fee || 0);
    const rawTax = Number(data.tax_liability || 0);

    // Safety: Prevent divide by zero
    const safeGross = rawGross > 0 ? rawGross : 1; 

    // Build the ordered array of financial slices
    const slices = [
      {
        id: 'PAYOUT',
        label: REVENUE_TRANCHES.PARTNER_PAYOUT.label,
        color: REVENUE_TRANCHES.PARTNER_PAYOUT.color,
        value: rawPayout,
        pct: (rawPayout / safeGross) * 100,
        isDeduction: false
      },
      {
        id: 'YIELD',
        label: REVENUE_TRANCHES.PLATFORM_YIELD.label,
        color: REVENUE_TRANCHES.PLATFORM_YIELD.color,
        value: rawYield,
        pct: (rawYield / safeGross) * 100,
        isDeduction: false
      },
      {
        id: 'GATEWAY',
        label: REVENUE_TRANCHES.GATEWAY_FEES.label,
        color: REVENUE_TRANCHES.GATEWAY_FEES.color,
        value: rawGateway,
        pct: (rawGateway / safeGross) * 100,
        isDeduction: true
      },
      {
        id: 'TAX',
        label: REVENUE_TRANCHES.TAX_LIABILITY.label,
        color: REVENUE_TRANCHES.TAX_LIABILITY.color,
        value: rawTax,
        pct: (rawTax / safeGross) * 100,
        isDeduction: true
      }
    ].filter(slice => slice.value > 0); // Only render active tranches

    return { tranches: slices, gross: rawGross };
  }, [data]);

  // ========================================================================
  // 2. RENDER ENGINE
  // ========================================================================
  return (
    <div className="citadel-card" style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: '24px', // Upgraded to Sovereign Standard
      padding: '32px',      // Upgraded to Sovereign Standard
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: '400px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
    }}>
      
      {/* === A. MASTER HEADER === */}
      {/* FLUID UPGRADE: flex-wrap to prevent collision */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
            <Scale size={20} color="var(--brand-primary)" />
            Unit Economics
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Forensic breakdown of every 100 {activeCurrency} processed.
          </p>
        </div>

        {/* Global Gross Indicator */}
        {!isLoading && gross > 0 && (
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Total Gross
            </span>
            <span style={{ fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {formatCompactCurrency(gross, activeCurrency, exchangeRate)}
            </span>
          </div>
        )}
      </div>

      {/* State: Loading */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
          <div className="animate-pulse" style={{ height: '32px', borderRadius: '16px', background: 'var(--bg-input)' }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse" style={{ height: '24px', borderRadius: '8px', background: 'var(--bg-input)', opacity: 1 - (i * 0.2) }} />
          ))}
        </div>
      )}

      {/* State: Empty */}
      {!isLoading && gross === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px' }}>
          <Receipt size={32} style={{ opacity: 0.3 }} />
          <span style={{ fontSize: '13px', fontWeight: '600' }}>No economic data to breakdown.</span>
        </div>
      )}

      {/* State: Active Data */}
      {!isLoading && gross > 0 && (
        <>
          {/* === B. THE PHYSICAL STACKED BAR === */}
          <div style={{ 
            display: 'flex', height: '32px', width: '100%', 
            borderRadius: '16px', overflow: 'hidden', // Forces the internal blocks to curve at the ends
            marginBottom: '32px', background: 'var(--bg-input)'
          }}>
            {tranches.map((tranche) => {
              const isHovered = hoveredTranche === tranche.id;
              const isFaded = hoveredTranche !== null && hoveredTranche !== tranche.id;

              return (
                <div 
                  key={`bar-${tranche.id}`}
                  onMouseEnter={() => setHoveredTranche(tranche.id)}
                  onMouseLeave={() => setHoveredTranche(null)}
                  style={{
                    width: `${tranche.pct}%`, height: '100%',
                    background: tranche.color,
                    opacity: isFaded ? 0.3 : 1, // Focus effect
                    transition: 'all 0.2s ease',
                    cursor: 'crosshair',
                    boxShadow: isHovered ? `inset 0 0 0 2px rgba(255,255,255,0.3)` : 'none'
                  }}
                  title={`${tranche.label}: ${tranche.pct.toFixed(1)}%`}
                />
              );
            })}
          </div>

          {/* === C. THE FORENSIC LEDGER (The Squish Fix) === */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {tranches.map((tranche) => {
              const isHovered = hoveredTranche === tranche.id;
              const isFaded = hoveredTranche !== null && hoveredTranche !== tranche.id;

              return (
                <div 
                  key={`ledger-${tranche.id}`}
                  onMouseEnter={() => setHoveredTranche(tranche.id)}
                  onMouseLeave={() => setHoveredTranche(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '12px',
                    background: isHovered ? 'var(--bg-hover)' : 'transparent',
                    opacity: isFaded ? 0.4 : 1,
                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                >
                  
                  {/* LEFT: Label & Identity (ANTI-SQUISH ZONE) */}
                  {/* minWidth: 0 prevents long text from blowing out the flex container */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, paddingRight: '16px' }}>
                    <div style={{ 
                      width: '12px', height: '12px', borderRadius: '4px', background: tranche.color, flexShrink: 0,
                      boxShadow: isHovered ? `0 0 10px ${tranche.color}` : 'none', transition: 'all 0.2s'
                    }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ 
                        fontSize: '13px', fontWeight: '800', color: 'var(--text-main)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                      }}>
                        {tranche.label}
                      </span>
                      {tranche.isDeduction && (
                        <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--status-danger)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Deduction
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Financial Data (ARMORED ZONE) */}
                  {/* flexShrink: 0 completely immunizes this data from being crushed by the text on the left */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                      {formatCurrency(tranche.value, activeCurrency, exchangeRate)}
                    </span>
                    <span style={{ 
                      fontSize: '12px', fontWeight: '900', color: tranche.color, 
                      width: '48px', textAlign: 'right', fontFamily: 'monospace' 
                    }}>
                      {tranche.pct.toFixed(1)}%
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default UnitEconomicsBar;