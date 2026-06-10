import React, { useState } from 'react';
import { Search, Route, Layers } from 'lucide-react';

/**
 * 👑 AYABUS REGISTRY HEADER (Sovereign OS Edition)
 * ------------------------------------------------------------------
 * UPGRADES:
 * 1. FUNCTIONAL SEARCH: Implemented local state + trigger logic.
 * 2. TACTILE EXECUTION: Search executes on Button Click or Enter Key.
 * 3. ZERO BUBBLING: Strict event handling prevents wizard collisions.
 */

const RegistryHeader = ({ 
  view, 
  setView, 
  stats = { active: 0, drafts: 0 }, 
  onSearchChange // This now acts as the 'Execute' trigger
}) => {
  // Local state for the input field so it doesn't filter until 'Executed'
  const [internalSearch, setInternalSearch] = useState('');

  // EXECUTION LOGIC
  const executeSearch = (e) => {
    if (e) e.stopPropagation();
    onSearchChange(internalSearch); // Pushes the value to the Registry
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch(e);
    }
  };

  return (
    <div style={{ 
      padding: '24px 32px 0 32px', 
      borderBottom: '1px solid var(--border-subtle)', 
      background: 'var(--bg-surface)',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px' 
    }}>
      
      {/* ==========================================
          1. TOP ROW: Title & Search Engine 
          ========================================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        
        {/* Title Block */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
            Route Registry
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0', fontWeight: '700' }}>
            ACTIVE INFRASTRUCTURE: <span style={{ color: 'var(--status-success)' }}>{stats.active} ROUTES</span>
          </p>
        </div>

        {/* Search Block */}
        <div style={{ display: 'flex', gap: '8px' }}>
          
          {/* SEARCH INPUT */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              padding: '0 16px', display: 'flex', alignItems: 'center', gap: '10px', width: '280px', height: '44px',
              background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search origins, destinations..."
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none', fontSize: '13px', fontWeight: '600' }}
            />
          </div>
          
          {/* THE FUNCTIONAL SEARCH BUTTON */}
          <button 
            onClick={executeSearch}
            style={{ 
              height: '44px', padding: '0 24px', borderRadius: '12px', 
              background: 'var(--brand-primary)', color: '#FFF', border: 'none', 
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              fontWeight: '800', fontSize: '13px', boxShadow: '0 8px 20px var(--brand-primary-subtle)',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Execute Search"
          >
            SEARCH
          </button>

        </div>
      </div>

      {/* ==========================================
          2. BOTTOM ROW: Enterprise Segmented Tabs 
          ========================================== */}
      <div style={{ display: 'flex', gap: '16px' }}>
        
        {/* ACTIVE ROUTES TAB */}
        <button 
          onClick={() => setView('ACTIVE')}
          style={{ 
            padding: '12px 16px', background: 'transparent', border: 'none',
            borderBottom: view === 'ACTIVE' ? '3px solid var(--brand-primary)' : '3px solid transparent',
            color: view === 'ACTIVE' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontWeight: '800', fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px',
            transform: 'translateY(1px)', 
            transition: 'all 0.2s ease'
          }}
        >
          <Route size={16} /> LIVE NETWORK
          <span style={{ 
            background: view === 'ACTIVE' ? 'var(--brand-surface)' : 'var(--bg-input)', 
            color: view === 'ACTIVE' ? 'var(--brand-primary)' : 'var(--text-muted)',
            padding: '2px 8px', borderRadius: '12px', fontSize: '11px' 
          }}>
            {stats.active}
          </span>
        </button>

        {/* DRAFTS TAB */}
        <button 
          onClick={() => setView('DRAFTS')}
          style={{ 
            padding: '12px 16px', background: 'transparent', border: 'none',
            borderBottom: view === 'DRAFTS' ? '3px solid var(--status-warning)' : '3px solid transparent',
            color: view === 'DRAFTS' ? 'var(--status-warning)' : 'var(--text-muted)',
            fontWeight: '800', fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px',
            transform: 'translateY(1px)',
            transition: 'all 0.2s ease'
          }}
        >
          <Layers size={16} /> SAVED DRAFTS
          <span style={{ 
            background: view === 'DRAFTS' ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-input)', 
            color: view === 'DRAFTS' ? 'var(--status-warning)' : 'var(--text-muted)',
            padding: '2px 8px', borderRadius: '12px', fontSize: '11px' 
          }}>
            {stats.drafts}
          </span>
        </button>

      </div>
    </div>
  );
};

export default RegistryHeader;