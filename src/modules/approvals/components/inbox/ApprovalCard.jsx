import React from 'react';
import { ChevronRight, Clock, Building2, Bus, Map, CalendarClock, Scale } from 'lucide-react';

/**
 * 👑 AYABUS APPROVAL CARD (Sovereign Edition)
 * ------------------------------------------------------------------
 * Represents a single pending task in the queue.
 * * * UPGRADES:
 * 1. RECONCILIATION SUPPORT: Added 'Scale' icon for financial payloads.
 * 2. CONDITIONAL STYLING: 'REFUND' tasks use a distinct danger/liability 
 * color palette to visually separate money movements from operations.
 */

const ApprovalCard = ({ item, isSelected, onClick }) => {

  // 1. HELPER: DYNAMIC ICON
  const getIcon = () => {
    switch (item.type) {
      case 'PARTNER': return <Building2 size={18} />;
      case 'VEHICLE': return <Bus size={18} />;
      case 'ROUTE': return <Map size={18} />;
      case 'SCHEDULE': return <CalendarClock size={18} />;
      case 'REFUND': return <Scale size={18} />; // <--- NEW: Financial Payload
      default: return <Building2 size={18} />;
    }
  };

  // 2. HELPER: RELATIVE TIME (Urgency Calc)
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // 3. THEME DYNAMICS (Financial vs Operational)
  const isRefund = item.type === 'REFUND';
  const accentColor = isRefund ? 'var(--status-danger)' : 'var(--brand-primary)';
  const accentSubtle = isRefund ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-input)';

  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '16px', 
        cursor: 'pointer',
        borderRadius: '12px',
        // Dynamic Border Logic: Refunds flash red when selected
        border: isSelected ? `1px solid ${accentColor}` : '1px solid var(--border-subtle)',
        borderLeft: isSelected ? `4px solid ${accentColor}` : '1px solid var(--border-subtle)',
        
        background: isSelected ? 'var(--bg-surface)' : 'var(--bg-canvas)',
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        boxShadow: isSelected 
          ? (isRefund ? '0 8px 20px rgba(239, 68, 68, 0.08)' : '0 8px 20px var(--brand-subtle)') 
          : 'none'
      }}
      onMouseEnter={(e) => {
         if (!isSelected) {
             e.currentTarget.style.transform = 'translateY(-2px)';
             e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
         }
      }}
      onMouseLeave={(e) => {
         if (!isSelected) {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = 'none';
         }
      }}
    >
      
      {/* A. THE ICON ANCHOR */}
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '50%', 
        background: isSelected ? accentColor : accentSubtle,
        color: isSelected ? 'white' : accentColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.2s ease'
      }}>
        {getIcon()}
      </div>

      {/* B. THE DETAILS */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h4 style={{ 
            margin: 0, fontSize: '14px', fontWeight: '800', 
            color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            letterSpacing: '-0.3px'
          }}>
            {item.label}
          </h4>
          
          {/* Timestamp Badge */}
          <div style={{ 
            fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '6px'
          }}>
            <Clock size={10} />
            {getRelativeTime(item.submittedAt)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '500' }}>
            {item.subLabel || 'NO ID'}
          </div>
          
          {/* Type Badge (Highlighted for Refunds) */}
          <div style={{ 
            fontSize: '9px', fontWeight: '800', color: accentColor, 
            background: isRefund && !isSelected ? accentSubtle : 'transparent',
            padding: isRefund && !isSelected ? '2px 6px' : '0',
            borderRadius: '4px', opacity: isSelected ? 1 : 0.8,
            letterSpacing: '0.5px'
          }}>
            {item.type}
          </div>
        </div>
      </div>

      {/* C. ACTIVE INDICATOR */}
      {isSelected && (
        <div style={{ position: 'absolute', right: '12px', color: accentColor }}>
          <ChevronRight size={18} strokeWidth={3} />
        </div>
      )}

    </div>
  );
};

export default ApprovalCard;