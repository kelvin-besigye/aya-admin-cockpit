import React, { useRef } from 'react';
import { Calendar, X, Plus, AlertCircle } from 'lucide-react';

/**
 * CALENDAR PICKER (Super Custom Engine)
 * ------------------------------------------------------------------
 * Allows selecting specific, non-recurring dates for the schedule.
 * * * FEATURES:
 * 1. CHRONOLOGICAL SORTING: Auto-sorts dates as you add them.
 * 2. DUPLICATE GUARD: Prevents adding the same date twice.
 * 3. SMART CHIPS: Visual tags for selected dates with removal logic.
 */

const CalendarPicker = ({ selectedDates = [], onChange }) => {
  const inputRef = useRef(null);

  // --- HANDLERS ---
  const handleAddDate = (e) => {
    const dateStr = e.target.value;
    if (!dateStr) return;

    // 1. Check for Duplicates
    if (selectedDates.includes(dateStr)) {
      // Optional: Shake animation or toast could go here
      // For now, we just clear the input to show it was acknowledged but rejected
      e.target.value = '';
      return;
    }

    // 2. Add and Sort
    const newDates = [...selectedDates, dateStr].sort((a, b) => new Date(a) - new Date(b));
    onChange(newDates);

    // 3. Reset Input
    e.target.value = '';
  };

  const handleRemoveDate = (dateToRemove) => {
    const newDates = selectedDates.filter(d => d !== dateToRemove);
    onChange(newDates);
  };

  const triggerDatePicker = () => {
    if (inputRef.current) inputRef.current.showPicker();
  };

  // --- FORMATTER ---
  const formatDateChip = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // --- STYLES ---
  const wrapperStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const inputContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '60px',
    background: 'white',
    border: '1px solid var(--border-subtle)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    cursor: 'pointer',
    transition: 'border 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };

  const nativeInputStyle = {
    position: 'absolute',
    inset: 0,
    opacity: 0, // Hide native input but keep it clickable
    cursor: 'pointer',
    width: '100%',
    height: '100%'
  };

  const chipContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    minHeight: '60px',
    padding: '16px',
    background: 'var(--bg-surface)',
    border: '1px dashed var(--border-subtle)',
    borderRadius: '16px',
    alignContent: 'flex-start'
  };

  const chipStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'white',
    border: '1px solid var(--border-subtle)',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-main)',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={wrapperStyle}>
      
      {/* 1. THE TRIGGER INPUT */}
      <div 
        style={inputContainerStyle} 
        onClick={triggerDatePicker}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', color: 'var(--brand-primary)' }}>
          <Plus size={18} />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Add Specific Date</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Click to open calendar...</div>
        </div>

        <Calendar size={20} color="var(--text-muted)" />
        
        {/* Invisible Native Input */}
        <input 
          ref={inputRef}
          type="date" 
          onChange={handleAddDate}
          style={nativeInputStyle}
        />
      </div>

      {/* 2. THE CHIP DISPLAY */}
      <div style={chipContainerStyle}>
        
        {selectedDates.length === 0 && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', opacity: 0.6 }}>
            <Calendar size={18} />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>No dates selected yet.</span>
          </div>
        )}

        {selectedDates.map((date) => (
          <div 
            key={date} 
            style={chipStyle}
            className="group hover:border-red-200 hover:bg-red-50"
          >
            <span style={{ color: 'var(--text-main)' }}>{formatDateChip(date)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveDate(date);
              }}
              style={{ 
                border: 'none', background: 'transparent', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2px', borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={14} color="var(--text-muted)" className="group-hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {/* 3. SUMMARY FOOTER */}
      {selectedDates.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '4px' }}>
          <AlertCircle size={14} />
          <span>{selectedDates.length} active running dates scheduled.</span>
        </div>
      )}

    </div>
  );
};

export default CalendarPicker;