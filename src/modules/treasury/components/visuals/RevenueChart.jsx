import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { REVENUE_TRANCHES } from '../../data/treasury.constants';
import { formatCompactCurrency, formatCurrency } from '../../data/treasury.utils';

/**
 * 👑 REVENUE CHART (Level 4: Dashboard Visual - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: RevenueChart.jsx
 * * DESCRIPTION:
 * A high-performance kinetic area chart visualizing the flow of funds over time.
 * Supports interactive toggling of metric layers.
 * * UPGRADES (Phase 3.5):
 * - Fluid Header Architecture: Added flex-wrap to prevent legend crushing.
 * - Sovereign Aesthetics: 24px radius, 32px padding, deep shadows.
 * - Glassmorphism Tooltip: Premium frosted glass effect for the forensic hover ledger.
 */

const RevenueChart = ({ 
  data = [], 
  isLoading = false,
  activeCurrency = 'UGX',
  exchangeRate = 1
}) => {

  // ========================================================================
  // 1. STATE: INTERACTIVE METRIC TOGGLES
  // ========================================================================
  const [activeMetrics, setActiveMetrics] = useState({
    gross: true,
    payout: true,
    yield: true
  });

  const toggleMetric = (key) => {
    setActiveMetrics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ========================================================================
  // 2. THE CUSTOM FORENSIC TOOLTIP
  // ========================================================================
  // Replaces Recharts' generic tooltip with a Citadel-themed "mini-ledger"
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(12px)',
          minWidth: '240px'
        }}>
          {/* Tooltip Header (Date) */}
          <div style={{ 
            fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', 
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px',
            borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px'
          }}>
            {label}
          </div>

          {/* Tooltip Body (Stacked Metrics) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {payload.map((entry, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: entry.color, boxShadow: `0 0 8px ${entry.color}80` }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '700' }}>
                    {entry.name}
                  </span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  {formatCurrency(entry.value, activeCurrency, exchangeRate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // ========================================================================
  // 3. RENDER ENGINE
  // ========================================================================
  return (
    <div className="citadel-card" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '24px', // Upgraded to Sovereign Standard
      padding: '32px',      // Upgraded to Sovereign Standard
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '460px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
    }}>
      
      {/* === A. CHART HEADER & CONTROLS === */}
      {/* FLUID UPGRADE: flex-wrap ensures title and legend don't collide */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
            <Activity size={20} color="var(--brand-primary)" />
            Revenue Velocity
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Time-series analysis of processed volume vs realized yield.
          </p>
        </div>

        {/* Interactive Legend (Toggles) */}
        {/* FLUID UPGRADE: flex-wrap ensures pills stack smoothly if container shrinks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <LegendPill 
            label="Gross Volume" 
            color={REVENUE_TRANCHES.GROSS_VOLUME.color} 
            isActive={activeMetrics.gross} 
            onClick={() => toggleMetric('gross')} 
          />
          <LegendPill 
            label="Operator Payout" 
            color={REVENUE_TRANCHES.PARTNER_PAYOUT.color} 
            isActive={activeMetrics.payout} 
            onClick={() => toggleMetric('payout')} 
          />
          <LegendPill 
            label="Platform Yield" 
            color={REVENUE_TRANCHES.PLATFORM_YIELD.color} 
            isActive={activeMetrics.yield} 
            onClick={() => toggleMetric('yield')} 
          />
        </div>
      </div>

      {/* === B. THE KINETIC CHART === */}
      <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
        
        {/* State: Loading Skeleton */}
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'flex-end', gap: '2%' }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ 
                flex: 1, background: 'var(--bg-input)', borderRadius: '6px 6px 0 0',
                height: `${Math.max(20, Math.random() * 100)}%`, opacity: 0.6 
              }} />
            ))}
          </div>
        )}

        {/* State: Empty Data */}
        {!isLoading && data.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700' }}>
            No revenue data available for this timeframe.
          </div>
        )}

        {/* The Recharts Engine */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
            
            {/* Gradient Definitions (Glassmorphism Underlays) */}
            <defs>
              <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_TRANCHES.GROSS_VOLUME.color} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={REVENUE_TRANCHES.GROSS_VOLUME.color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_TRANCHES.PARTNER_PAYOUT.color} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={REVENUE_TRANCHES.PARTNER_PAYOUT.color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_TRANCHES.PLATFORM_YIELD.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={REVENUE_TRANCHES.PLATFORM_YIELD.color} stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* Axes & Grid */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}
              dy={15}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}
              tickFormatter={(val) => formatCompactCurrency(val, activeCurrency, exchangeRate)}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-subtle)', strokeWidth: 1, strokeDasharray: '4 4' }} />

            {/* The Data Layers (Z-Indexed by order: Gross back, Yield front) */}
            {activeMetrics.gross && (
              <Area 
                type="monotone" dataKey="gross" name="Gross Volume" 
                stroke={REVENUE_TRANCHES.GROSS_VOLUME.color} strokeWidth={2} 
                fillOpacity={1} fill="url(#colorGross)" 
              />
            )}
            
            {activeMetrics.payout && (
              <Area 
                type="monotone" dataKey="payout" name="Operator Payout" 
                stroke={REVENUE_TRANCHES.PARTNER_PAYOUT.color} strokeWidth={2} 
                fillOpacity={1} fill="url(#colorPayout)" 
              />
            )}
            
            {activeMetrics.yield && (
              <Area 
                type="monotone" dataKey="yield" name="Platform Yield" 
                stroke={REVENUE_TRANCHES.PLATFORM_YIELD.color} strokeWidth={3} 
                fillOpacity={1} fill="url(#colorYield)" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: INTERACTIVE LEGEND PILL ---
const LegendPill = ({ label, color, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '6px 14px', borderRadius: '100px',
      background: isActive ? 'var(--bg-hover)' : 'transparent',
      border: `1px solid ${isActive ? 'var(--border-subtle)' : 'transparent'}`,
      cursor: 'pointer', transition: 'all 0.2s ease',
      opacity: isActive ? 1 : 0.5,
      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
    }}
  >
    <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: color, transition: 'all 0.2s' }} />
    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-main)' }}>{label}</span>
  </button>
);

export default RevenueChart;