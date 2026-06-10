import React, { useState } from 'react';
import { SlidersHorizontal, Wallet, FileDown, ShieldCheck } from 'lucide-react';

// IMPORT LEVEL 2 CHILDREN
import GlobalCurrencyEngine from './GlobalCurrencyEngine';
import TimeHorizonEngine from './TimeHorizonEngine';
import CascadeSelect from './CascadeSelect';

// IMPORT LEVEL 6 EXPORT TOOLS
import StatementGenerator from '../reports/StatementGenerator';

/**
 * OMNI FILTER BAR (Level 2: The Command Center)
 * ------------------------------------------------------------------
 * The sticky, master control strip. Now updated with Level 6 Export logic.
 * Orchestrates the "View -> Filter -> Export" workflow.
 */

const OmniFilterBar = ({ 
  filters = { 
    epochId: 'TODAY', startDate: null, endDate: null, 
    partnerId: 'ALL', routeId: 'ALL', gateway: 'ALL' 
  }, 
  onFilterChange,
  
  // Data for the Export Engine
  ledgerData = [],
  summary = {},

  // Currency State
  activeCurrency, 
  onCurrencyChange 
}) => {
  // 1. LOCAL STATE: MODAL CONTROL
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // 2. STATE MERGERS
  const handleEpochChange = (epochData) => {
    onFilterChange({
      ...filters,
      epochId: epochData.id,
      startDate: epochData.startDate,
      endDate: epochData.endDate
    });
  };

  const handleCascadeChange = (cascadeData) => {
    onFilterChange({
      ...filters,
      partnerId: cascadeData.partnerId,
      routeId: cascadeData.routeId,
      gateway: cascadeData.gateway
    });
  };

  // 3. ACTIVE FILTER COUNTER
  const activeCount = (() => {
    let count = 0;
    if (filters.partnerId !== 'ALL') count++;
    if (filters.routeId !== 'ALL') count++;
    if (filters.gateway !== 'ALL') count++;
    return count;
  })();

  return (
    <div 
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(var(--bg-canvas-rgb, 248, 250, 252), 0.85)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '24px',
        boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)'
      }}
    >
      
      {/* === LEFT POLARITY: DATA FILTERS === */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Module Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px', borderRight: '1px solid var(--border-subtle)' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px', 
            background: 'var(--brand-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Wallet size={16} strokeWidth={2.5} />
          </div>
          <div style={{ userSelect: 'none' }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.2px' }}>
              Citadel Treasury
            </h2>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Live Operations
            </div>
          </div>
        </div>

        {/* The Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TimeHorizonEngine 
            activeEpochId={filters.epochId} 
            onEpochChange={handleEpochChange} 
          />

          <div style={{ height: '20px', width: '1px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={14} color={activeCount > 0 ? 'var(--brand-primary)' : 'var(--text-muted)'} />
            {activeCount > 0 && (
              <span style={{ fontSize: '10px', fontWeight: '900', background: 'var(--brand-primary)', color: 'white', padding: '2px 6px', borderRadius: '6px' }}>
                {activeCount}
              </span>
            )}
          </div>

          <CascadeSelect 
            filters={filters} 
            onFilterChange={handleCascadeChange} 
          />
        </div>
      </div>

      {/* === RIGHT POLARITY: ACTIONS & FX === */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* PREMIUM EXPORT BUTTON */}
        <button 
          onClick={() => setIsExportModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '8px',
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)', fontSize: '13px', fontWeight: '800',
            cursor: 'pointer', transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        >
          <FileDown size={16} color="var(--brand-primary)" />
          Export Report
        </button>

        <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)' }} />

        <GlobalCurrencyEngine 
          activeCurrency={activeCurrency} 
          onCurrencyChange={onCurrencyChange} 
        />
      </div>

      {/* === THE MODAL PORTAL === */}
      <StatementGenerator 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        ledgerData={ledgerData}
        summary={summary}
        filters={filters}
        activeCurrency={activeCurrency}
      />

    </div>
  );
};

export default OmniFilterBar;