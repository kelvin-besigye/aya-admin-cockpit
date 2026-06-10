import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

/**
 * EMPTY STATE (Level 2: UI Primitive)
 * ------------------------------------------------------------------
 * A premium placeholder for when financial data yields zero results.
 * Built to handle "Filter Zero" (no matches) or "Absolute Zero" (new account).
 * Completely respects Light/Dark mode CSS variables.
 */

const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No Records Found',
  description = 'There is no data matching your current filters.',
  actionLabel = null, // e.g., 'Clear Filters' or 'Retry Connection'
  onAction = null,
  actionIcon: ActionIcon = RefreshCw,
  layout = 'standard' // 'compact' | 'standard' | 'expansive'
}) => {

  // 1. DYNAMIC LAYOUT ENGINE
  const layoutStyles = {
    compact: {
      containerPadding: '32px 16px',
      iconBoxSize: '48px',
      iconSize: 24,
      titleSize: '14px',
      descSize: '12px',
      gap: '12px'
    },
    standard: {
      containerPadding: '64px 24px',
      iconBoxSize: '64px',
      iconSize: 32,
      titleSize: '16px',
      descSize: '13px',
      gap: '16px'
    },
    expansive: {
      containerPadding: '100px 24px',
      iconBoxSize: '80px',
      iconSize: 40,
      titleSize: '18px',
      descSize: '14px',
      gap: '20px'
    }
  };

  const style = layoutStyles[layout] || layoutStyles.standard;

  return (
    <div 
      className="animate-in fade-in zoom-in-95 duration-500"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: style.containerPadding,
        textAlign: 'center',
        background: 'var(--bg-canvas)', // Recedes into the background
        borderRadius: '16px',
        border: '1px dashed var(--border-subtle)', // Dashed border indicates 'empty space'
        height: '100%',
        width: '100%'
      }}
    >
      {/* A. THE ORBITAL ICON CONTAINER */}
      <div style={{
        width: style.iconBoxSize,
        height: style.iconBoxSize,
        borderRadius: '50%',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: style.gap,
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        border: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        {/* Subtle decorative ring */}
        <div style={{
          position: 'absolute',
          inset: '-6px',
          borderRadius: '50%',
          border: '1px dashed var(--border-subtle)',
          opacity: 0.5
        }} />
        
        <Icon size={style.iconSize} color="var(--text-muted)" opacity={0.7} />
      </div>

      {/* B. TYPOGRAPHY */}
      <h3 style={{ 
        margin: 0, 
        fontSize: style.titleSize, 
        fontWeight: '800', 
        color: 'var(--text-main)',
        letterSpacing: '-0.3px'
      }}>
        {title}
      </h3>
      
      <p style={{ 
        margin: '8px 0 0 0', 
        fontSize: style.descSize, 
        color: 'var(--text-muted)', 
        maxWidth: '320px',
        lineHeight: '1.5'
      }}>
        {description}
      </p>

      {/* C. CONTEXTUAL ACTION BUTTON */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '100px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
            e.currentTarget.style.color = 'var(--brand-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-main)';
          }}
        >
          {ActionIcon && <ActionIcon size={14} />}
          {actionLabel}
        </button>
      )}

    </div>
  );
};

export default EmptyState;