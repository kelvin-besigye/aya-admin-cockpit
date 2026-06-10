import React, { useState, useMemo } from 'react';
import { Trophy, Building2, Map, Medal } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { formatCompactCurrency, formatCurrency } from '../../data/treasury.utils';

/**
 * 👑 PERFORMANCE LEADERBOARD (Level 4: Dashboard Visual - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: PerformanceLeaderboard.jsx
 * * DESCRIPTION:
 * A ranked, high-contrast list of top-earning entities (Operators & Routes).
 * Features relative-scale background bars and dynamic podium color coding.
 * * UPGRADES (Phase 3.5):
 * - Text Integrity Lock: Uses minWidth: 0 and flexShrink: 0 to prevent long names from squashing financial data.
 * - Fluid Header Wrap: Prevents UI collision on narrow screens.
 * - Theme-Aware Podium: Swapped hardcoded hexes for dynamic color-mix to support Dark Mode.
 */

const PerformanceLeaderboard = ({ 
  activeTab = 'PARTNER', // 'PARTNER' | 'ROUTE'
  onTabChange,           // Let the Level 8 parent know to fetch different data
  data = [],             // Expected: [{ id, name, subtitle, value }]
  isLoading = false,
  activeCurrency = 'UGX',
  exchangeRate = 1
}) => {

  const [hoveredId, setHoveredId] = useState(null);

  // ========================================================================
  // 1. MATHEMATICAL SCALE ENGINE
  // Find the highest value so we can scale the background bars relative to #1
  // ========================================================================
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(item => Number(item.value || 0)));
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
      
      {/* === A. MASTER HEADER & CONTROLS === */}
      {/* FLUID UPGRADE: flex-wrap ensures toggle doesn't crush the title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <Trophy size={20} color="#F59E0B" />
            Top Performers
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Ranked by total Gross Volume.
          </p>
        </div>

        {/* The Toggle Switch */}
        <div style={{ 
          display: 'flex', background: 'var(--bg-input)', borderRadius: '10px', 
          padding: '4px', border: '1px solid var(--border-subtle)' 
        }}>
          <TabButton 
            isActive={activeTab === 'PARTNER'} 
            onClick={() => onTabChange('PARTNER')} 
            icon={Building2} label="Operators" 
          />
          <TabButton 
            isActive={activeTab === 'ROUTE'} 
            onClick={() => onTabChange('ROUTE')} 
            icon={Map} label="Routes" 
          />
        </div>

      </div>

      {/* === B. THE RANKED LIST === */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* State: Loading */}
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse" style={{ height: '64px', borderRadius: '12px', background: 'var(--bg-input)', opacity: 1 - (i * 0.15) }} />
            ))}
          </div>
        )}

        {/* State: Empty */}
        {!isLoading && data.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
            No ranking data available for this timeframe.
          </div>
        )}

        {/* Active Rows */}
        {!isLoading && data.map((item, index) => {
          const rank = index + 1;
          const isHovered = hoveredId === item.id;
          const isFaded = hoveredId && hoveredId !== item.id;
          
          // Calculate relative width (e.g., if max is 100, and value is 80, width is 80%)
          const relativePct = maxValue > 0 ? (Number(item.value) / maxValue) * 100 : 0;

          return (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', padding: '16px 20px',
                borderRadius: '12px', border: '1px solid transparent',
                cursor: 'default', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: isFaded ? 0.4 : 1,
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                background: isHovered ? 'var(--bg-hover)' : 'var(--bg-canvas)',
                borderColor: isHovered ? 'var(--border-subtle)' : 'transparent',
                zIndex: isHovered ? 2 : 1
              }}
            >
              
              {/* The Relative Background Bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${relativePct}%`,
                background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', // Theme safe
                transition: 'width 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
                zIndex: 0
              }} />

              {/* 1. Rank Badge (The Podium Logic) */}
              <div style={{ zIndex: 1, marginRight: '20px', flexShrink: 0 }}>
                <RankBadge rank={rank} />
              </div>

              {/* 2. Entity Details (THE SQUISH FIX) */}
              {/* minWidth: 0 forces truncation instead of expanding and crushing the financial numbers */}
              <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '24px' }}>
                <span style={{ 
                  fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', 
                  display: 'flex', alignItems: 'center', gap: '8px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {item.name}
                  {rank === 1 && <Medal size={14} color="#F59E0B" style={{ flexShrink: 0 }} />}
                </span>
                <span style={{ 
                  fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {item.subtitle}
                </span>
              </div>

              {/* 3. Financial Value */}
              {/* flexShrink: 0 completely immunizes this column from being compressed by long names */}
              <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  {formatCompactCurrency(item.value, activeCurrency, exchangeRate)}
                </span>
                {/* Reveal full exact value on hover */}
                <div style={{ height: '14px', marginTop: '2px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', fontFamily: 'monospace',
                    opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease', transform: isHovered ? 'translateY(0)' : 'translateY(-4px)'
                  }}>
                    {formatCurrency(item.value, activeCurrency, exchangeRate)}
                  </span>
                </div>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

// --- SUB-COMPONENT: TAB TOGGLE ---
const TabButton = ({ isActive, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
      background: isActive ? 'var(--bg-surface)' : 'transparent',
      color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
      fontWeight: isActive ? '800' : '600', fontSize: '12px', letterSpacing: '0.5px',
      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
      transition: 'all 0.2s ease'
    }}
  >
    <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
    {label}
  </button>
);

// --- SUB-COMPONENT: RANK BADGE (THEME-SAFE PODIUM LOGIC) ---
const RankBadge = ({ rank }) => {
  // We use color-mix to ensure perfect contrast in both Light and Dark mode
  let baseColor = 'var(--text-muted)';
  
  if (rank === 1) baseColor = '#F59E0B'; // Gold
  else if (rank === 2) baseColor = '#94A3B8'; // Silver
  else if (rank === 3) baseColor = '#D97706'; // Bronze

  const isPodium = rank <= 3;

  return (
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: isPodium ? `color-mix(in srgb, ${baseColor} 15%, transparent)` : 'var(--bg-input)',
      color: isPodium ? baseColor : 'var(--text-muted)', 
      border: isPodium ? `1px solid color-mix(in srgb, ${baseColor} 30%, transparent)` : '1px solid var(--border-subtle)',
      fontSize: '13px', fontWeight: '900', fontFamily: 'monospace',
      boxShadow: isPodium ? `0 4px 12px color-mix(in srgb, ${baseColor} 20%, transparent)` : 'none'
    }}>
      {rank}
    </div>
  );
};

export default PerformanceLeaderboard;