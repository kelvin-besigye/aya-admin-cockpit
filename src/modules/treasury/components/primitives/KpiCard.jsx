import React, { useState } from 'react';
import { Info } from 'lucide-react';
import DeltaIndicator from './DeltaIndicator';

/**
 * KPI CARD (Level 2: UI Primitive)
 * RE-ENGINEERED FOR ZERO CLIPPING & WORLD-CLASS PRECISION
 */

const KpiCard = ({
  title = 'Metric Name',
  value = '0.00',
  icon: Icon,
  accentColor = 'var(--brand-primary)',
  tooltipDescription = '',
  varianceData = null,
  isLoading = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // TACTILE PHYSICS (Subtle & Professional)
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--bg-surface)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '180px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default',
        position: 'relative'
      }}
    >
      {/* A. HEADER AREA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '900', 
            color: 'var(--text-muted)', 
            textTransform: 'uppercase', 
            letterSpacing: '1px' 
          }}>
            {title}
          </span>
          <div 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ cursor: 'help', display: 'flex', color: 'var(--text-muted)', opacity: 0.6 }}
          >
            <Info size={14} />
          </div>
        </div>

        {Icon && (
          <div style={{ 
            width: '38px', height: '38px', borderRadius: '10px', 
            background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accentColor
          }}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* B. THE PRIMARY METRIC (The Fix Zone) */}
      <div style={{ 
        fontSize: '30px', 
        fontWeight: '900', 
        color: 'var(--text-main)', 
        fontFamily: 'Inter, system-ui, sans-serif',
        letterSpacing: '-1px',
        
        // --- THE SENSORY FIXES ---
        lineHeight: '1.2',           // 1. Prevents top/bottom clipping
        paddingBottom: '4px',        // 2. Air for the descenders
        display: 'flex',             // 3. Align USh and digits
        alignItems: 'baseline',      // 4. Optical baseline lock
        overflow: 'visible',         // 5. No guillotine
        WebkitFontSmoothing: 'antialiased' // 6. Windows clarity
      }}>
        {isLoading ? (
          <div style={{ height: '36px', width: '120px', background: 'var(--bg-input)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
        ) : (
          value
        )}
      </div>

      {/* C. THE DELTA / FOOTER */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        {varianceData && !isLoading && (
          <DeltaIndicator 
            current={varianceData.current}
            previous={varianceData.previous}
            inverseLogic={varianceData.inverseLogic}
          />
        )}
      </div>

      {/* TOOLTIP POPUP */}
      {showTooltip && tooltipDescription && (
        <div style={{
          position: 'absolute', top: '55px', left: '24px', right: '24px',
          background: 'var(--bg-surface)', color: 'var(--text-main)', padding: '14px',
          borderRadius: '12px', fontSize: '12px', fontWeight: '600', zIndex: 100,
          border: '1px solid var(--brand-primary)', boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
          lineHeight: '1.4'
        }}>
          {tooltipDescription}
        </div>
      )}
    </div>
  );
};

export default KpiCard;