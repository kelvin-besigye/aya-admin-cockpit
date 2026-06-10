import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Globe, ChevronDown, Check, RefreshCw, Activity } from 'lucide-react';
import { SUPPORTED_CURRENCIES, DEFAULT_BASE_CURRENCY } from '../../data/treasury.constants';
import { fxService } from '../../data/fx.service';

/**
 * GLOBAL CURRENCY ENGINE (Level 3: Omni-Filter Control)
 * ------------------------------------------------------------------
 * The interactive control panel for switching active display currencies
 * and manually syncing live exchange rates from the global market.
 */

const GlobalCurrencyEngine = ({ 
  activeCurrency = DEFAULT_BASE_CURRENCY, 
  onCurrencyChange 
}) => {
  
  // 1. STATE MANAGEMENT
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(Date.now());
  const [timeAgoStr, setTimeAgoStr] = useState('Just now');
  
  const dropdownRef = useRef(null);

  // 2. LIFECYCLE: CLICK OUTSIDE TO CLOSE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. LIFECYCLE: RELATIVE TIME TICKER
  // Updates the "Updated 2m ago" text every 60 seconds
  useEffect(() => {
    const updateTicker = () => {
      const diffMs = Date.now() - lastSynced;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) setTimeAgoStr('Just now');
      else if (diffMins < 60) setTimeAgoStr(`${diffMins}m ago`);
      else setTimeAgoStr(`${Math.floor(diffMins / 60)}h ago`);
    };

    updateTicker(); // Initial calculation
    const interval = setInterval(updateTicker, 60000);
    return () => clearInterval(interval);
  }, [lastSynced]);

  // 4. HANDLERS
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force bypass cache to get live market rates
      const { timestamp } = await fxService.getRates('USD', true);
      setLastSynced(timestamp);
      setTimeAgoStr('Just now');
      
      // Optional: Dispatch event if other components need to know rates changed independently
      window.dispatchEvent(new Event('citadel-fx-updated'));
    } catch (err) {
      console.error("Manual FX Sync Failed:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Minimum spin time for visual feedback
    }
  };

  const handleSelect = (code) => {
    onCurrencyChange(code);
    setIsOpen(false);
  };

  // 5. CURRENT CURRENCY RESOLUTION
  const activeDef = SUPPORTED_CURRENCIES[activeCurrency] || SUPPORTED_CURRENCIES[DEFAULT_BASE_CURRENCY];
  const currencyList = Object.values(SUPPORTED_CURRENCIES);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      
      {/* === A. THE DROPDOWN ENGINE === */}
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        
        {/* Trigger Button */}
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
          <Globe size={16} color="var(--brand-primary)" opacity={0.8} />
          <span>{activeDef.code}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: '500', marginLeft: '4px' }}>{activeDef.symbol}</span>
          <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', marginLeft: '4px' }} />
        </button>

        {/* Dropdown Menu (Absolute) */}
        {isOpen && (
          <div 
            className="animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              minWidth: '220px', background: 'var(--bg-surface)',
              borderRadius: '12px', border: '1px solid var(--border-subtle)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              zIndex: 100, padding: '8px', overflow: 'hidden'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 12px 4px' }}>
              Select Currency
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              {currencyList.map((curr) => {
                const isSelected = activeCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    onClick={() => handleSelect(curr.code)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '10px 12px', borderRadius: '8px',
                      background: isSelected ? 'var(--bg-hover)' : 'transparent',
                      border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Native vs Global Indicator */}
                      <div style={{ 
                        width: '6px', height: '6px', borderRadius: '50%', 
                        background: curr.isNative ? 'var(--status-success)' : 'var(--text-muted)',
                        boxShadow: curr.isNative ? '0 0 0 2px rgba(16, 185, 129, 0.15)' : 'none'
                      }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                          {curr.code} <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>({curr.symbol})</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{curr.label}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={16} color="var(--brand-primary)" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* === B. THE SYNC CONTROLLER === */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', borderLeft: '1px solid var(--border-subtle)' }}>
        
        {/* Sync Status Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={10} color={isRefreshing ? 'var(--brand-primary)' : 'var(--status-success)'} />
            FX Rates
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-main)', fontWeight: '500' }}>
            {timeAgoStr}
          </div>
        </div>

        {/* Refresh Action */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Force Sync Live Rates"
          style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
            borderRadius: '8px', padding: '6px', cursor: isRefreshing ? 'wait' : 'pointer',
            color: 'var(--text-main)', transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseEnter={(e) => { if(!isRefreshing) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
          onMouseLeave={(e) => { if(!isRefreshing) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} style={{ opacity: isRefreshing ? 0.5 : 1 }} />
        </button>

      </div>

    </div>
  );
};

export default GlobalCurrencyEngine;