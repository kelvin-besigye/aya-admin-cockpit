import React from 'react';
import { 
  Repeat, CalendarClock, MousePointerClick, CalendarDays, 
  CheckCircle2, Zap, ShieldCheck, Info
} from 'lucide-react';
import { WEEK_DAYS } from '../../../data/scheduler.constants';
import DaySelector from '../controls/DaySelector';
import CalendarPicker from '../controls/CalendarPicker';

/**
 * ELITE STEP 2: FREQUENCY LOGIC (Clean Stack Edition)
 * ------------------------------------------------------------------
 * A robust, unbreakable timing engine.
 * * * FEATURES:
 * 1. CLEAR MODES: 4 Distinct, large-target toggle cards.
 * 2. LOGIC SAFETY: Auto-clears conflicting data when switching modes.
 * 3. VISUAL FEEDBACK: Explains the schedule impact in plain English.
 */

const Step2_Frequency = ({ formData, onChange }) => {
  
  const { frequencyType, frequencyData } = formData;

  // --- HANDLERS ---
  const handleTypeChange = (type) => {
    // CRITICAL: Clean state transition to prevent database artifacts
    onChange({ 
      frequencyType: type,
      frequencyData: { days: [], dates: [] } 
    });
  };

  const handleDataChange = (key, value) => {
    onChange({
      frequencyData: { ...frequencyData, [key]: value }
    });
  };

  // --- COMPONENT RENDERERS ---
  const renderConfiguration = () => {
    switch (frequencyType) {
      case 'DAILY':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div style={{ 
              padding: '32px', textAlign: 'center', 
              background: 'var(--brand-surface)', 
              borderRadius: '20px', 
              border: '1px dashed var(--brand-primary)' 
            }}>
              <div style={{ 
                width: '56px', height: '56px', margin: '0 auto 16px',
                background: 'white', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
              }}>
                <Zap size={28} color="var(--brand-primary)" fill="var(--brand-primary)" fillOpacity={0.2} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--brand-primary)', marginBottom: '8px' }}>
                Full-Cycle Automation
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
                This route will be automatically generated for <strong>every single calendar day</strong> at the specified time.
              </p>
            </div>
          </div>
        );
      
      case 'WEEKLY':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Recurring Day</span>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '12px' }}>
                {WEEK_DAYS.map(d => {
                  const isActive = frequencyData.days?.[0] === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleDataChange('days', [d.id])}
                      style={{
                        padding: '16px 8px', borderRadius: '14px', border: '2px solid',
                        borderColor: isActive ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        background: isActive ? 'var(--brand-primary)' : 'white',
                        color: isActive ? 'white' : 'var(--text-main)',
                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                      }}
                    >
                      {d.full}
                    </button>
                  );
                })}
             </div>
          </div>
        );

      case 'CUSTOM':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Multi-Day Selection</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Toggle the days this route should run.</p>
             </div>
             
             {/* Uses the DaySelector Component */}
             <DaySelector 
                selectedDays={frequencyData.days || []} 
                onChange={(days) => handleDataChange('days', days)} 
             />

             {frequencyData.days?.length > 0 && (
               <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--brand-primary)', background: 'var(--brand-surface)', padding: '6px 16px', borderRadius: '20px', textTransform: 'uppercase' }}>
                    {frequencyData.days.length} Active Days / Week
                  </span>
               </div>
             )}
          </div>
        );

      case 'SUPER_CUSTOM':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Specific Date Calendar</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Select individual dates for irregular schedules.</p>
             </div>
            <CalendarPicker 
              selectedDates={frequencyData.dates || []} 
              onChange={(dates) => handleDataChange('dates', dates)} 
            />
          </div>
        );
      
      default: return null;
    }
  };

  // --- CONFIG OPTIONS ---
  const OPTIONS = [
    { id: 'DAILY', label: 'Daily', icon: Repeat, desc: 'Every Day' },
    { id: 'WEEKLY', label: 'Weekly', icon: CalendarClock, desc: '1 Day/Wk' },
    { id: 'CUSTOM', label: 'Custom', icon: MousePointerClick, desc: 'Multi-Day' },
    { id: 'SUPER_CUSTOM', label: 'Specific', icon: CalendarDays, desc: 'By Date' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h3 className="text-heading" style={{ fontSize: '24px', marginBottom: '8px' }}>Automation Rhythm</h3>
        <p className="text-muted" style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
          Define how often the system should generate trips for this route.
        </p>
      </div>

      {/* 1. MODE SELECTOR (Grid) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '12px', 
        marginBottom: '32px' 
      }}>
        {OPTIONS.map(opt => {
          const isActive = frequencyType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleTypeChange(opt.id)}
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center', padding: '20px 8px', 
                borderRadius: '16px', border: '2px solid',
                borderColor: isActive ? 'var(--brand-primary)' : 'var(--border-subtle)',
                background: isActive ? 'white' : 'var(--bg-canvas)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 8px 16px -4px rgba(59, 130, 246, 0.15)' : 'none'
              }}
            >
              <div style={{ marginBottom: '8px', color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                <opt.icon size={22} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '900', color: isActive ? 'var(--text-main)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                {opt.label}
              </span>
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>
                {opt.desc}
              </span>
              
              {isActive && (
                <div style={{ position: 'absolute', top: '6px', right: '6px', color: 'var(--brand-primary)' }}>
                  <CheckCircle2 size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. DYNAMIC CONFIGURATION AREA */}
      <div className="citadel-card" style={{ 
        padding: '32px', 
        background: 'white', 
        minHeight: '280px', // Prevents layout jump
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
         {renderConfiguration()}
      </div>

      {/* 3. VALIDATION PASS */}
      {frequencyType && (
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-500" style={{ marginTop: '24px', padding: '16px 20px', borderRadius: '14px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <ShieldCheck size={20} color="#16A34A" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#166534' }}>Logic Verified</div>
            <p style={{ fontSize: '12px', color: '#15803D', margin: '2px 0 0 0' }}>Automation ready to be finalized.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Step2_Frequency;