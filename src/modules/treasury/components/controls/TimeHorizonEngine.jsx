import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CalendarDays, ChevronDown, Check, Clock, History, CalendarRange } from 'lucide-react';
import { TIME_EPOCHS } from '../../data/treasury.constants';

/**
 * TIME HORIZON ENGINE (Level 3: Omni-Filter Control)
 * ------------------------------------------------------------------
 * A high-precision epoch selector.
 * Automatically calculates exact ISO date ranges based on the selected enum,
 * passing strictly formatted timestamps back to the database engine.
 */

const TimeHorizonEngine = ({ 
  activeEpochId = 'TODAY', 
  onEpochChange // Passes back: { id, startDate, endDate }
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 1. CHRONOLOGY ENGINE (Calculates exact dates dynamically)
  const calculateDateRange = (epochId) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    let startDate = new Date(now);
    let endDate = new Date(now);

    // Helper: Set to very start of day
    const setStartOfDay = (d) => { d.setHours(0, 0, 0, 0); return d; };
    // Helper: Set to very end of day
    const setEndOfDay = (d) => { d.setHours(23, 59, 59, 999); return d; };

    switch (epochId) {
      case 'TODAY':
        startDate = setStartOfDay(new Date());
        endDate = setEndOfDay(new Date());
        break;
      case 'YESTERDAY':
        startDate = setStartOfDay(new Date(now.setDate(currentDate - 1)));
        endDate = setEndOfDay(new Date(startDate));
        break;
      case 'LAST_7D':
        startDate = setStartOfDay(new Date(now.setDate(currentDate - 7)));
        endDate = setEndOfDay(new Date());
        break;
      case 'LAST_30D':
        startDate = setStartOfDay(new Date(now.setDate(currentDate - 30)));
        endDate = setEndOfDay(new Date());
        break;
      case 'YTD':
        startDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);
        endDate = setEndOfDay(new Date());
        break;
      case 'Q1':
        startDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);
        endDate = new Date(currentYear, 2, 31, 23, 59, 59, 999);
        break;
      case 'Q2':
        startDate = new Date(currentYear, 3, 1, 0, 0, 0, 0);
        endDate = new Date(currentYear, 5, 30, 23, 59, 59, 999);
        break;
      case 'Q3':
        startDate = new Date(currentYear, 6, 1, 0, 0, 0, 0);
        endDate = new Date(currentYear, 8, 30, 23, 59, 59, 999);
        break;
      case 'Q4':
        startDate = new Date(currentYear, 9, 1, 0, 0, 0, 0);
        endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
        break;
      case 'LAST_YEAR':
        startDate = new Date(currentYear - 1, 0, 1, 0, 0, 0, 0);
        endDate = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);
        break;
      case 'ALL_TIME':
        return { startDate: null, endDate: null }; // Null signals DB to skip date filters
      default:
        return { startDate: null, endDate: null };
    }

    return { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString() 
    };
  };

  // 2. LIFECYCLE: CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. HANDLERS
  const handleSelect = (epochId) => {
    const dates = calculateDateRange(epochId);
    onEpochChange({
      id: epochId,
      startDate: dates.startDate,
      endDate: dates.endDate
    });
    setIsOpen(false);
  };

  // 4. DATA PARTITIONING
  const activeEpoch = TIME_EPOCHS[activeEpochId] || TIME_EPOCHS.TODAY;
  const epochs = Object.values(TIME_EPOCHS);
  const microEpochs = epochs.filter(e => e.type === 'MICRO');
  const macroEpochs = epochs.filter(e => e.type === 'MACRO');

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      
      {/* === A. TRIGGER BUTTON === */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '8px',
          background: isOpen ? 'var(--bg-hover)' : 'var(--bg-surface)',
          border: `1px solid ${isOpen ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
          color: 'var(--text-main)',
          fontSize: '13px', fontWeight: '700',
          cursor: 'pointer', transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
        }}
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
      >
        <CalendarDays size={16} color={activeEpochId === 'ALL_TIME' ? 'var(--status-warning)' : 'var(--brand-primary)'} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Time Horizon
          </span>
          <span>{activeEpoch.label}</span>
        </div>
        <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', marginLeft: '8px' }} />
      </button>

      {/* === B. MATRIX DROPDOWN POPUP === */}
      {isOpen && (
        <div 
          className="animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            width: '420px', // Wide Matrix Layout
            background: 'var(--bg-surface)',
            borderRadius: '12px', border: '1px solid var(--border-subtle)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 100, overflow: 'hidden',
            display: 'grid', gridTemplateColumns: '1fr 1fr' // Dual Column Split
          }}
        >
          
          {/* COLUMN 1: MICRO HORIZONS (Immediate Liquidity) */}
          <div style={{ padding: '16px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              <Clock size={14} /> Immediate
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {microEpochs.map(epoch => (
                <EpochOption 
                  key={epoch.id} 
                  epoch={epoch} 
                  isActive={activeEpochId === epoch.id} 
                  onClick={() => handleSelect(epoch.id)} 
                />
              ))}
            </div>
          </div>

          {/* COLUMN 2: MACRO HORIZONS (Historical Context) */}
          <div style={{ padding: '16px', background: 'var(--bg-surface)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              <History size={14} /> Historical
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {macroEpochs.map(epoch => (
                <EpochOption 
                  key={epoch.id} 
                  epoch={epoch} 
                  isActive={activeEpochId === epoch.id} 
                  onClick={() => handleSelect(epoch.id)} 
                />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: REUSABLE OPTION BUTTON ---
const EpochOption = ({ epoch, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '10px 12px', borderRadius: '8px',
        background: isActive ? 'var(--bg-hover)' : 'transparent',
        border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
        textAlign: 'left',
        color: isActive ? 'var(--brand-primary)' : 'var(--text-main)',
        fontWeight: isActive ? '700' : '500',
        fontSize: '13px'
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {epoch.id === 'ALL_TIME' ? <CalendarRange size={14} color="var(--status-warning)" /> : null}
        {epoch.label}
      </span>
      {isActive && <Check size={16} color="var(--brand-primary)" />}
    </button>
  );
};

export default TimeHorizonEngine;