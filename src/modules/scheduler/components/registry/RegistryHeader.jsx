import React from 'react';
import { 
  Search, ArrowUpDown, Clock, Calendar, 
  MapPin, Activity, Zap, Filter 
} from 'lucide-react';
import { FREQUENCY_TYPES } from '../../data/scheduler.constants';

/**
 * REGISTRY HEADER (Elite Command Deck)
 * ------------------------------------------------------------------
 * A high-fidelity, high-density filtration and navigation engine.
 * * * ELITE FEATURES:
 * 1. COMMAND SEARCH: Deep-integrated search with high-contrast states.
 * 2. FLOATING SEGMENTS: Recessed tray for frequency logic toggles.
 * 3. AXIS HIGHLIGHT: Sort button uses brand colors to indicate active logic.
 */

const RegistryHeader = ({ 
  filter, 
  setFilter, 
  searchQuery, 
  setSearchQuery, 
  sortOrder, 
  setSortOrder 
}) => {
  
  // --- HANDLERS ---
  const handleTypeChange = (type) => {
    setFilter(prev => ({ ...prev, type }));
  };

  const cycleSort = () => {
    const map = {
      'CREATED_DESC': 'CREATED_ASC',
      'CREATED_ASC': 'DEPARTURE_ASC',
      'DEPARTURE_ASC': 'DEPARTURE_DESC',
      'DEPARTURE_DESC': 'CREATED_DESC'
    };
    setSortOrder(prev => map[prev] || 'CREATED_DESC');
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'CREATED_DESC': return 'Latest Scheduled';
      case 'CREATED_ASC': return 'Earliest Scheduled';
      case 'DEPARTURE_ASC': return 'Time: Morning First';
      case 'DEPARTURE_DESC': return 'Time: Night First';
      default: return 'Sort Order';
    }
  };

  // --- CONFIG ---
  const TABS = [
    { id: 'ALL', label: 'Global Network' },
    { id: FREQUENCY_TYPES.DAILY, label: 'Daily Run' },
    { id: FREQUENCY_TYPES.WEEKLY, label: 'Weekly Run' },
    { id: 'CUSTOM_GROUP', label: 'Customised' } 
  ];

  return (
    <div className="flex flex-col z-20 relative" 
         style={{ 
           background: 'var(--bg-surface)', 
           borderBottom: '1px solid var(--border-subtle)',
           boxShadow: '0 10px 30px -15px rgba(0,0,0,0.05)'
         }}>
      
      {/* ROW 1: BRANDING & MASTER COMMAND SEARCH */}
      <div style={{ 
        padding: '32px 32px 24px 32px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '60px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '16px', 
            background: 'var(--brand-primary)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 24px -8px rgba(59, 130, 246, 0.5)'
          }}>
            <Activity size={28} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-heading" style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.8px', color: 'var(--text-main)' }}>
              Automated Scheduler
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Operational Live-Sync
              </span>
            </div>
          </div>
        </div>

        {/* MASTER SEARCH: Deep-Milled Aesthetic */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
          <div style={{ 
            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none'
          }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search city, operator or route ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', height: '56px', padding: '0 24px 0 56px', 
              borderRadius: '18px', border: '1px solid var(--border-subtle)',
              background: 'var(--bg-canvas)', color: 'var(--text-main)',
              fontSize: '15px', fontWeight: '700', outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--brand-primary)';
              e.target.style.boxShadow = '0 0 0 5px rgba(59, 130, 246, 0.12)';
              e.target.style.background = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.boxShadow = 'inset 0 2px 6px rgba(0,0,0,0.03)';
              e.target.style.background = 'var(--bg-canvas)';
            }}
          />
        </div>
      </div>

      {/* ROW 2: PRECISION TOOLBAR */}
      <div style={{ 
        padding: '0 32px 32px 32px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        
        {/* RECESSED SEGMENTED CONTROL TRAY */}
        <div style={{ 
          display: 'flex', padding: '5px', borderRadius: '16px', 
          background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          {TABS.map(tab => {
            const isActive = filter.type === tab.id || (tab.id === 'CUSTOM_GROUP' && (filter.type === 'CUSTOM' || filter.type === 'SUPER_CUSTOM'));
            return (
              <button
                key={tab.id}
                onClick={() => handleTypeChange(tab.id)}
                style={{
                  padding: '10px 24px', borderRadius: '12px', 
                  fontSize: '12px', fontWeight: '900', textTransform: 'uppercase',
                  letterSpacing: '0.6px', border: 'none', cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  background: isActive ? 'white' : 'transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 6px 16px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* PRECISION MULTI-AXIS SORT AXIS */}
        <button 
          onClick={cycleSort}
          className="group"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '16px', 
            padding: '12px 24px', borderRadius: '16px', 
            background: 'white', border: '1px solid var(--border-subtle)',
            cursor: 'pointer', transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              background: sortOrder.includes('DEPARTURE') ? 'var(--brand-primary)' : 'var(--bg-input)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: sortOrder.includes('DEPARTURE') ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s ease'
            }}>
              {sortOrder.includes('DEPARTURE') ? <Clock size={16} /> : <Calendar size={16} />}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Filter
              </div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-main)', marginTop: '-1px' }}>
                {getSortLabel()}
              </div>
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
          <ArrowUpDown size={18} className="text-muted group-hover:text-blue-500 transition-colors" />
        </button>

      </div>
    </div>
  );
};

export default RegistryHeader;