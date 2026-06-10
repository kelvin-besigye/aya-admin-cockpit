import React from 'react';
import { WEEK_DAYS } from '../../../data/scheduler.constants';

/**
 * DAY SELECTOR (Tactile Edition)
 * ------------------------------------------------------------------
 * A premium multi-select toggle for days of the week.
 * Used in "Custom" frequency mode.
 * * * FEATURES:
 * 1. TACTILE UI: Buttons pop and glow when selected.
 * 2. DATA HYGIENE: Auto-sorts days for clean DB storage.
 * 3. THEME AWARE: Uses system variables for colors.
 */

const DaySelector = ({ selectedDays = [], onChange }) => {

  // --- LOGIC ---
  const toggleDay = (dayId) => {
    let newSelection;

    if (selectedDays.includes(dayId)) {
      // Remove
      newSelection = selectedDays.filter(d => d !== dayId);
    } else {
      // Add
      newSelection = [...selectedDays, dayId];
    }

    // Sort: Ensure Mon(1) comes before Sun(0) in display logic if needed, 
    // but for ID consistency we usually sort numeric. 
    // However, if 0 is Sunday, it often looks better at the end or start.
    // We will standard sort them numerically for the DB.
    newSelection.sort((a, b) => a - b);

    onChange(newSelection);
  };

  // --- STYLES ---
  const containerStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    padding: '10px 0'
  };

  const getButtonStyle = (isSelected) => ({
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    
    // Active State
    background: isSelected ? 'var(--brand-primary)' : 'var(--bg-input)',
    color: isSelected ? 'white' : 'var(--text-muted)',
    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
    boxShadow: isSelected ? '0 8px 16px rgba(0,0,0,0.15)' : 'none'
  });

  return (
    <div style={containerStyle}>
      {WEEK_DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.id);
        
        return (
          <button
            key={day.id}
            type="button" // Prevent form submit
            onClick={() => toggleDay(day.id)}
            title={day.full}
            style={getButtonStyle(isSelected)}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'var(--bg-surface-hover, #F3F4F6)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'var(--bg-input)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {day.label.charAt(0)}
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;