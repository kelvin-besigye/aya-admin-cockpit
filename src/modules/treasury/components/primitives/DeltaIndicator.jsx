import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculateVariance } from '../../data/treasury.utils';

/**
 * DELTA INDICATOR (Level 2: UI Primitive)
 * ------------------------------------------------------------------
 * A high-precision variance pill. 
 * Automatically calculates the % change between two periods and renders
 * the strict financial color coding (Green = Favorable, Red = Bleed).
 */

const DeltaIndicator = ({ 
  current = 0, 
  previous = 0, 
  inverseLogic = false, 
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabel = false, 
  labelString = "vs prior period"
}) => {

  // 1. MATHEMATICAL RESOLUTION (Wire to Level 1 Core)
  const { raw, trend, isFavorable, formatted } = useMemo(() => {
    return calculateVariance(current, previous, inverseLogic);
  }, [current, previous, inverseLogic]);

  // 2. STATE: HOVER TOOLTIP
  const [isHovered, setIsHovered] = useState(false);

  // 3. VISUAL THEME ENGINE
  // Maps the mathematical outcome to strict Citadel color variables
  const getTheme = () => {
    if (trend === 'NEUTRAL' || raw === 0) {
      return {
        color: 'var(--text-muted)',
        background: 'var(--bg-input)',
        borderColor: 'var(--border-subtle)',
        Icon: Minus
      };
    }
    if (isFavorable) {
      return {
        color: 'var(--status-success)', // Citadel Green
        background: 'rgba(16, 185, 129, 0.1)', // Emerald tinted bg
        borderColor: 'rgba(16, 185, 129, 0.2)',
        Icon: trend === 'UP' ? TrendingUp : TrendingDown
      };
    }
    // Unfavorable (Red)
    return {
      color: 'var(--status-danger)', // Citadel Red
      background: 'rgba(239, 68, 68, 0.1)', // Red tinted bg
      borderColor: 'rgba(239, 68, 68, 0.2)',
      Icon: trend === 'UP' ? TrendingUp : TrendingDown
    };
  };

  const theme = getTheme();
  const Icon = theme.Icon;

  // 4. DYNAMIC SIZING ENGINE
  const sizes = {
    sm: { padding: '2px 6px', fontSize: '10px', iconSize: 12 },
    md: { padding: '4px 8px', fontSize: '12px', iconSize: 14 },
    lg: { padding: '6px 12px', fontSize: '14px', iconSize: 16 }
  };
  const currentSize = sizes[size];

  return (
    <div 
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* A. THE VARIANCE PILL */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: currentSize.padding,
        borderRadius: '6px',
        background: theme.background,
        color: theme.color,
        border: `1px solid ${theme.borderColor}`,
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}>
        <Icon size={currentSize.iconSize} strokeWidth={2.5} />
        <span style={{ 
          fontSize: currentSize.fontSize, 
          fontWeight: '800', 
          fontFamily: 'monospace', // Monospace keeps numbers from shifting
          letterSpacing: '0.5px' 
        }}>
          {formatted}
        </span>
      </div>

      {/* B. OPTIONAL CONTEXT LABEL */}
      {showLabel && (
        <span style={{ 
          fontSize: `calc(${currentSize.fontSize} - 1px)`, 
          color: 'var(--text-muted)', 
          fontWeight: '500' 
        }}>
          {labelString}
        </span>
      )}

      {/* C. FINANCIAL TOOLTIP (Hover State) */}
      {isHovered && (
        <div 
          className="animate-in fade-in zoom-in-95 duration-200"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '8px 12px',
            background: 'var(--text-main)', // Inverted for high contrast
            color: 'var(--bg-canvas)',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {trend === 'NEUTRAL' ? 'No change from prior period' : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>Current vs Previous</span>
              <span>{Math.abs(current - previous).toLocaleString()} absolute difference</span>
            </div>
          )}
          {/* Tooltip Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            background: 'var(--text-main)'
          }} />
        </div>
      )}
    </div>
  );
};

export default DeltaIndicator;