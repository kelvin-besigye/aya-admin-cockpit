import React from 'react';
import { 
  Clock, ChevronRight, Building2, 
  ShieldCheck, Repeat, CalendarDays, MousePointerClick 
} from 'lucide-react';
import { WEEK_DAYS } from '../../data/scheduler.constants';

/**
 * ELITE SCHEDULE CARD (High-Density Row Edition)
 * ------------------------------------------------------------------
 * Rebuilt as a high-fidelity data row to match Elite Registry specs.
 * * * FEATURES:
 * 1. GRID PRECISION: Perfectly aligns with the 1.8fr 1.2fr 1.2fr 0.6fr registry layout.
 * 2. TACTILE DEPTH: Features an active-state transform and frequency-coded borders.
 * 3. ENTERPRISE TYPOGRAPHY: Uses 14px/11px hierarchy for maximum legibility.
 */

const ScheduleCard = ({ schedule, onClick, isSelected }) => {
  
  // 1. DATA SAFETY
  const route = schedule.route || {};
  const partner = route.partners || {};
  const config = route.bus_configs || {};

  // 2. FREQUENCY DESIGN ENGINE
  const getFreqInfo = () => {
    const type = schedule.frequency_type;
    const data = schedule.frequency_data || {};

    switch (type) {
      case 'DAILY':
        return { label: 'Daily Service', icon: Repeat, color: 'var(--brand-primary)', bg: 'rgba(59, 130, 246, 0.08)' };
      case 'WEEKLY':
        const dayName = WEEK_DAYS.find(d => d.id === data.days?.[0])?.label || 'Day';
        return { label: `Weekly (${dayName})`, icon: Clock, color: '#7C3AED', bg: '#F5F3FF' };
      case 'CUSTOM':
        return { label: 'Customised', icon: MousePointerClick, color: '#D97706', bg: '#FFFBEB' };
      case 'SUPER_CUSTOM':
        return { label: 'Specific Dates', icon: CalendarDays, color: '#DB2777', bg: '#FDF2F8' };
      default:
        return { label: 'Standard', icon: CalendarDays, color: 'var(--text-muted)', bg: 'var(--bg-canvas)' };
    }
  };

  const freq = getFreqInfo();
  const FreqIcon = freq.icon;

  return (
    <div 
      onClick={onClick}
      className="citadel-card animate-in slide-in-from-bottom-2"
      style={{ 
        padding: '16px 32px', 
        cursor: 'pointer', 
        display: 'grid',
        gridTemplateColumns: '1.8fr 1.2fr 1.2fr 0.6fr', // Matches Registry Header
        alignItems: 'center',
        gap: '24px',
        borderLeft: `4px solid ${isSelected ? 'var(--brand-primary)' : freq.color}`,
        background: isSelected ? 'var(--bg-hover)' : 'var(--bg-surface)',
        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        position: 'relative',
        minHeight: '80px',
        zIndex: isSelected ? 10 : 1,
        borderRadius: '16px',
        boxShadow: isSelected ? '0 12px 24px -8px rgba(0,0,0,0.1)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 20px -10px rgba(0,0,0,0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      
      {/* 1. ROUTE & OPERATOR */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="text-heading" style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
            {route.origin_city}
          </span>
          <ChevronRight size={14} className="text-muted" style={{ opacity: 0.3 }} />
          <span className="text-heading" style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
            {route.destination_city}
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={12} style={{ opacity: 0.6 }} /> 
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {partner.company_name || 'Fleet Operator'}
          </span>
        </div>
      </div>

      {/* 2. FREQUENCY LOGIC */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '36px', height: '36px', borderRadius: '10px', 
          background: freq.bg, color: freq.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 10px -4px ${freq.color}44`
        }}>
          <FreqIcon size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: '900', color: freq.color, letterSpacing: '-0.2px' }}>
          {freq.label}
        </span>
      </div>

      {/* 3. SCHEDULE & CLASS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} color="var(--brand-primary)" strokeWidth={2.5} />
          <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-main)' }}>
            {route.departure_time?.slice(0, 5) || '--:--'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <ShieldCheck size={12} className="text-muted" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {config.bus_class || 'Standard'}
          </span>
        </div>
      </div>

      {/* 4. OPERATIONAL STATUS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '20px',
          background: schedule.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          border: `1px solid ${schedule.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
        }}>
          <div style={{ 
            width: '6px', height: '6px', borderRadius: '50%', 
            background: schedule.status === 'ACTIVE' ? '#10B981' : '#F59E0B',
            boxShadow: `0 0 6px ${schedule.status === 'ACTIVE' ? '#10B981' : '#F59E0B'}`
          }} />
          <span style={{ fontSize: '11px', fontWeight: '900', color: schedule.status === 'ACTIVE' ? '#059669' : '#D97706', textTransform: 'uppercase' }}>
            {schedule.status}
          </span>
        </div>
      </div>

    </div>
  );
};

export default ScheduleCard;