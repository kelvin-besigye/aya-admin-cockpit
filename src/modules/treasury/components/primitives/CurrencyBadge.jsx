import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_CURRENCIES, DEFAULT_BASE_CURRENCY } from '../level1_core/treasury.constants';

/**
 * CURRENCY BADGE (Level 2: UI Primitive)
 * ------------------------------------------------------------------
 * A sleek, high-contrast visual pill displaying the active currency.
 * Functions as a read-only indicator OR an interactive trigger button
 * when an onClick handler is provided.
 */

const CurrencyBadge = ({ 
  currencyCode = DEFAULT_BASE_CURRENCY, 
  onClick, 
  disabled = false,
  size = 'md' // 'sm' | 'md' | 'lg'
}) => {
  
  // 1. DATA RESOLUTION (Wire to Level 1 Core)
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES[DEFAULT_BASE_CURRENCY];
  const isInteractive = !!onClick && !disabled;

  // 2. DYNAMIC SIZING ENGINE
  const sizes = {
    sm: { padding: '4px 10px', fontSize: '11px', iconSize: 12 },
    md: { padding: '6px 14px', fontSize: '13px', iconSize: 14 },
    lg: { padding: '8px 18px', fontSize: '15px', iconSize: 16 }
  };
  const currentSize = sizes[size];

  // 3. TACTILE HOVER HANDLERS
  const handleMouseEnter = (e) => {
    if (!isInteractive) return;
    e.currentTarget.style.background = 'var(--bg-hover)';
    e.currentTarget.style.borderColor = 'var(--brand-primary)';
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
  };

  const handleMouseLeave = (e) => {
    if (!isInteractive) return;
    e.currentTarget.style.background = 'var(--bg-surface)';
    e.currentTarget.style.borderColor = 'var(--border-subtle)';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
  };

  return (
    <button 
      onClick={isInteractive ? onClick : undefined}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: currentSize.padding,
        borderRadius: '100px', // Perfect pill radius
        background: isInteractive ? 'var(--bg-surface)' : 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.6 : 1,
        boxShadow: isInteractive ? '0 2px 4px rgba(0,0,0,0.02)' : 'none',
        outline: 'none',
        fontFamily: 'inherit'
      }}
    >
      {/* A. LIQUIDITY INDICATOR */}
      {currency.isNative ? (
        <div style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          background: 'var(--status-success)',
          boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.15)' 
        }} />
      ) : (
        <Globe size={currentSize.iconSize} color="var(--brand-primary)" opacity={0.8} />
      )}

      {/* B. CURRENCY IDENTIFIER */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ 
          fontWeight: '900', 
          fontSize: currentSize.fontSize, 
          color: 'var(--text-main)',
          letterSpacing: '0.5px'
        }}>
          {currency.code}
        </span>
        <span style={{ 
          fontWeight: '600', 
          fontSize: `calc(${currentSize.fontSize} - 2px)`, 
          color: 'var(--text-muted)' 
        }}>
          {currency.symbol}
        </span>
      </div>

      {/* C. INTERACTIVE AFFORDANCE */}
      {isInteractive && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          paddingLeft: '4px',
          borderLeft: '1px solid var(--border-subtle)',
          marginLeft: '2px'
        }}>
          <ChevronDown 
            size={currentSize.iconSize} 
            color="var(--text-muted)" 
            style={{ opacity: 0.8 }} 
          />
        </div>
      )}
    </button>
  );
};

export default CurrencyBadge;