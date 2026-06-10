import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building2, PlusCircle } from 'lucide-react';
import BusConfigCard from './BusConfigCard';

/**
 * COMPANY GROUP (The Accordion Parent)
 * ------------------------------------------------------------------
 * Groups bus configurations by their Fleet Operator.
 * * * FEATURES:
 * 1. COLLAPSIBLE: Keeps the registry clean.
 * 2. COUNT BADGE: Shows how many buses this company has.
 * 3. HIERARCHY: Visually separates the "Owner" from the "Assets".
 */

const CompanyGroup = ({ partner, configs = [], onSelectConfig }) => {
  
  // 1. STATE: OPEN/CLOSE TOGGLE
  // Default to closed unless it's the only one in the list (smart UX)
  const [isOpen, setIsOpen] = useState(false);

  // 2. HELPER: HANDLE CLICK
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div style={{ marginBottom: '8px', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-surface)' }}>
      
      {/* A. THE HEADER (Clickable) */}
      <div 
        onClick={toggleOpen}
        style={{ 
          padding: '12px 16px', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: isOpen ? 'var(--bg-input)' : 'var(--bg-surface)',
          transition: 'background 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Toggle Icon */}
          <div style={{ color: 'var(--text-muted)' }}>
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {/* Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} color="var(--brand-primary)" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
              {partner.company_name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              ({partner.partner_id})
            </span>
          </div>
        </div>

        {/* Count Badge */}
        <div style={{ 
          fontSize: '11px', fontWeight: '700', 
          background: 'var(--bg-canvas)', color: 'var(--text-muted)',
          padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-subtle)'
        }}>
          {configs.length}
        </div>
      </div>

      {/* B. THE BODY (The List of Buses) */}
      {isOpen && (
        <div style={{ padding: '12px 12px 12px 0', background: 'var(--bg-canvas)', borderTop: '1px solid var(--border-subtle)' }}>
          
          {configs.length === 0 ? (
            // EMPTY STATE
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginLeft: '24px', borderLeft: '2px dashed var(--border-subtle)' }}>
              No bus profiles configured for this operator yet.
            </div>
          ) : (
            // GRID OF CHILDREN
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {configs.map(config => (
                <BusConfigCard 
                  key={config.id} 
                  config={config} 
                  onClick={() => onSelectConfig(config)} 
                />
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default CompanyGroup;