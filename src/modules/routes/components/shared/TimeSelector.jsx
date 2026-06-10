import React from 'react';
import { Clock, Hourglass } from 'lucide-react';

/**
 * TIME SELECTOR (The Precision Instrument)
 * ------------------------------------------------------------------
 * A reusable, strict input component for handling time data.
 * * * FEATURES:
 * 1. ZERO TYPING: All inputs are dropdowns to prevent format errors.
 * 2. DUAL MODE: Handles both 'CLOCK' (Departure) and 'DURATION' (Journey Time).
 * 3. STANDARDIZED MINUTES: Locks minutes to 00, 15, 30, 45 to keep schedules clean.
 */

const TimeSelector = ({ 
  label, 
  value = {}, // Expects { hour, minute, period }
  onChange, 
  type = 'CLOCK', // 'CLOCK' or 'DURATION'
  error 
}) => {

  // === DATA GENERATORS ===
  
  // Hours: 01-12 for Clock, 00-23 for Duration
  const hours = type === 'CLOCK' 
    ? Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  // Minutes: 15-minute intervals (Standard Operations)
  const minutes = ['00', '15', '30', '45'];

  // Periods: AM/PM
  const periods = ['AM', 'PM'];

  // === HANDLERS ===
  
  const handleChange = (field, val) => {
    // Notify parent with updated object
    onChange({
      ...value,
      [field]: val
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      
      {/* 1. LABEL & ERROR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ 
          fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', 
          textTransform: 'uppercase', letterSpacing: '0.5px',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          {type === 'CLOCK' ? <Clock size={12} /> : <Hourglass size={12} />}
          {label}
        </label>
        {error && <span style={{ fontSize: '11px', color: 'var(--status-danger)', fontWeight: '600' }}>{error}</span>}
      </div>

      {/* 2. THE CONTROL SURFACE */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '8px', 
        background: 'var(--bg-input)', border: error ? '1px solid var(--status-danger)' : '1px solid var(--border-subtle)',
        borderRadius: '8px', padding: '4px', width: 'fit-content'
      }}>

        {/* --- INPUT A: HOURS --- */}
        <div style={{ position: 'relative' }}>
          <select
            value={value.hour || ''}
            onChange={(e) => handleChange('hour', e.target.value)}
            style={{
              appearance: 'none', border: 'none', background: 'transparent',
              fontSize: '14px', fontWeight: '600', color: 'var(--text-main)',
              padding: '8px 12px', cursor: 'pointer', textAlign: 'center',
              minWidth: '60px', outline: 'none'
            }}
          >
            <option value="" disabled>--</option>
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          {/* Unit Label for Duration Mode */}
          {type === 'DURATION' && (
            <span style={{ position: 'absolute', right: '4px', top: '10px', fontSize: '10px', color: 'var(--text-muted)', pointerEvents: 'none' }}>HR</span>
          )}
        </div>

        <span style={{ color: 'var(--border-subtle)', fontWeight: '300', fontSize: '18px' }}>:</span>

        {/* --- INPUT B: MINUTES --- */}
        <div style={{ position: 'relative' }}>
          <select
            value={value.minute || ''}
            onChange={(e) => handleChange('minute', e.target.value)}
            style={{
              appearance: 'none', border: 'none', background: 'transparent',
              fontSize: '14px', fontWeight: '600', color: 'var(--text-main)',
              padding: '8px 12px', cursor: 'pointer', textAlign: 'center',
              minWidth: '60px', outline: 'none'
            }}
          >
            <option value="" disabled>--</option>
            {minutes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {/* Unit Label for Duration Mode */}
          {type === 'DURATION' && (
            <span style={{ position: 'absolute', right: '4px', top: '10px', fontSize: '10px', color: 'var(--text-muted)', pointerEvents: 'none' }}>MIN</span>
          )}
        </div>

        {/* --- INPUT C: PERIOD (Clock Only) --- */}
        {type === 'CLOCK' && (
          <>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
            <select
              value={value.period || ''}
              onChange={(e) => handleChange('period', e.target.value)}
              style={{
                appearance: 'none', border: 'none', background: 'transparent',
                fontSize: '12px', fontWeight: '800', color: 'var(--brand-primary)',
                padding: '8px 12px', cursor: 'pointer', textAlign: 'center',
                minWidth: '60px', outline: 'none', textTransform: 'uppercase'
              }}
            >
              <option value="" disabled>--</option>
              {periods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </>
        )}

      </div>
      
      {/* HELPER TEXT */}
      {type === 'DURATION' && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Approximate journey time
        </div>
      )}

    </div>
  );
};

export default TimeSelector;