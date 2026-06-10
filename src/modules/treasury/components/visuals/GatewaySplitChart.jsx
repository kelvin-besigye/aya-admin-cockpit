import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { PieChart as PieChartIcon, Activity } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { PAYMENT_GATEWAYS } from '../../data/treasury.constants';
import { formatCurrency, formatCompactCurrency } from '../../data/treasury.utils';

/**
 * 👑 GATEWAY SPLIT CHART (Level 4: Dashboard Visual - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: GatewaySplitChart.jsx
 * * DESCRIPTION:
 * A high-precision Donut Chart visualizing liquidity distribution.
 * * UPGRADES (Phase 3):
 * - Responsive Flex-Wrap: Gracefully stacks the legend vertically on small screens.
 * - Bi-Directional Hover: Syncs the chart 'pop' effect with the legend row highlight.
 * - Sovereign UI: Matches the 24px radius and 32px padding OS standard.
 */

// Custom render for the hover "pop" effect on the Donut slices
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // The physical expansion "pop"
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 4px 16px ${fill}80)` }} // Glowing shadow
      />
    </g>
  );
};

const GatewaySplitChart = ({ 
  data = [], 
  isLoading = false,
  activeCurrency = 'UGX',
  exchangeRate = 1
}) => {

  const [activeIndex, setActiveIndex] = useState(null);

  // ========================================================================
  // 1. DATA ENRICHMENT & MATH ENGINE
  // ========================================================================
  const { enrichedData, totalVolume } = useMemo(() => {
    let total = 0;
    
    // Map raw DB strings to our DNA Constants for strict brand coloring
    const mapped = data.map(item => {
      const gwConfig = PAYMENT_GATEWAYS[item.gateway] || { label: item.gateway, color: 'var(--text-muted)' };
      total += Number(item.value || 0);
      
      return {
        id: item.gateway,
        name: gwConfig.label,
        value: Number(item.value || 0),
        color: gwConfig.color
      };
    }).filter(item => item.value > 0); // Hide zero-value slices

    // Sort largest to smallest for better visual weight (largest slice starts at top)
    mapped.sort((a, b) => b.value - a.value);

    return { enrichedData: mapped, totalVolume: total };
  }, [data]);

  // ========================================================================
  // 2. CUSTOM FORENSIC TOOLTIP
  // ========================================================================
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      const percentage = totalVolume > 0 ? ((p.value / totalVolume) * 100).toFixed(1) : 0;
      
      return (
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '12px', padding: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(12px)',
          minWidth: '180px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.name}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {formatCurrency(p.value, activeCurrency, exchangeRate)}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: p.color }}>
              {percentage}% of Total Volume
            </span>
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
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: '24px', padding: '32px', // Upgraded Sovereign Padding
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: '400px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
    }}>
      
      {/* === A. MASTER HEADER === */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChartIcon size={18} color="var(--brand-primary)" />
            Gateway Distribution
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Liquidity breakdown across processors.
          </p>
        </div>
      </div>

      {/* === B. RESPONSIVE BODY (CHART + LEGEND) === */}
      {/* The flexWrap here is the core upgrade. It prevents the legend from being crushed. */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '32px', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* State: Loading */}
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-pulse" style={{ width: '220px', height: '220px', borderRadius: '50%', border: '24px solid var(--bg-input)', opacity: 0.6 }} />
          </div>
        )}

        {/* State: Empty */}
        {!isLoading && enrichedData.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px' }}>
            <Activity size={32} style={{ opacity: 0.3 }} />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>No gateway data available.</span>
          </div>
        )}

        {/* 1. THE DONUT CHART */}
        <div style={{ width: '240px', height: '240px', position: 'relative', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enrichedData}
                cx="50%" cy="50%"
                innerRadius={80} // Thinner ring for a more premium look
                outerRadius={100}
                paddingAngle={4} // Gap between slices
                dataKey="value"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                stroke="none"
              >
                {enrichedData.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>

          {/* The Hollow Core Totalizer */}
          {!isLoading && enrichedData.length > 0 && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Processed
              </span>
              <span style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', marginTop: '2px', letterSpacing: '-0.5px' }}>
                {formatCompactCurrency(totalVolume, activeCurrency, exchangeRate)}
              </span>
            </div>
          )}
        </div>

        {/* 2. THE BI-DIRECTIONAL LEGEND */}
        {/* flex: '1 1 250px' forces it to take available space, but wrap if < 250px */}
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '260px', overflowY: 'auto', paddingRight: '8px' }} className="ayabus-scroll-area">
          {!isLoading && enrichedData.map((gw, index) => {
            const percentage = totalVolume > 0 ? ((gw.value / totalVolume) * 100).toFixed(1) : 0;
            const isHovered = activeIndex === index;
            const isFaded = activeIndex !== null && activeIndex !== index;

            return (
              <div 
                key={gw.id}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '12px 16px', borderRadius: '12px',
                  background: isHovered ? 'var(--bg-hover)' : 'var(--bg-canvas)',
                  border: `1px solid ${isHovered ? 'var(--border-subtle)' : 'transparent'}`,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  opacity: isFaded ? 0.4 : 1, // Focus effect
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)' // Tactile physical movement
                }}
              >
                {/* Gateway Name & Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: gw.color, boxShadow: isHovered ? `0 0 10px ${gw.color}` : `0 2px 4px ${gw.color}40`, transition: 'all 0.2s' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{gw.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: gw.color }}>{percentage}%</span>
                  </div>
                </div>

                {/* Exact Value */}
                <span style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                  {formatCompactCurrency(gw.value, activeCurrency, exchangeRate)}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default GatewaySplitChart;