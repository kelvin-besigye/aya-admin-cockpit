import React from 'react';
import { Search, SlidersHorizontal, Bus } from 'lucide-react';

/**
 * REGISTRY HEADER
 * ------------------------------------------------------------------
 * The Control Bar for the Bus Configuration List.
 * * FEATURES:
 * 1. SEARCH: Real-time text filter.
 * 2. STATS: Live count of total configurations.
 * 3. STYLE: Matches the "Citadel" aesthetic (Clean, Bordered, Surface).
 */

const RegistryHeader = ({ totalAssets = 0, searchQuery, onSearchChange }) => {
  return (
    <div style={{ 
      padding: '20px 24px', 
      borderBottom: '1px solid var(--border-subtle)', 
      background: 'var(--bg-surface)',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px' 
    }}>
      
      {/* 1. TITLE & STATS ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="text-heading" style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          BUS CONFIGURATIONS
          <span style={{ 
            fontSize: '11px', fontWeight: '700', 
            background: 'var(--bg-input)', color: 'var(--text-muted)',
            padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-subtle)'
          }}>
            {totalAssets}
          </span>
        </h2>
        
        {/* Optional Filter Button (Visual placeholder for future advanced filters) */}
        <button className="citadel-btn-icon" style={{ color: 'var(--text-muted)' }}>
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* 2. SEARCH BAR ROW */}
      <div style={{ position: 'relative' }}>
        <Search 
          size={16} 
          color="var(--text-muted)" 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input 
          type="text" 
          placeholder="Search by Company or Class..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px 12px 10px 36px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-subtle)', 
            background: 'var(--bg-input)',
            fontSize: '13px', 
            outline: 'none',
            color: 'var(--text-main)',
            transition: 'border 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
        />
      </div>

    </div>
  );
};

export default RegistryHeader;