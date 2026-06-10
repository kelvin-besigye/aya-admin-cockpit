import React from 'react';
import { 
  CalendarClock, MapPin, Repeat, Zap, CalendarDays, 
  ArrowRight, Building2, ShieldCheck, AlertCircle 
} from 'lucide-react';

/**
 * VERIFY SCHEDULE (The Automation Inspector)
 * ------------------------------------------------------------------
 * Read-only display of a Schedule Automation request.
 * * * WORLD CLASS FEATURES:
 * 1. LOGIC VISUALIZER: Renders the active days (M T W T F S S) for quick scanning.
 * 2. ROUTE CONTEXT: Shows exactly which path and bus class is being automated.
 * 3. IMPACT ANALYSIS: Explains the operational result (e.g. "Generates 365 trips/year").
 */

const VerifySchedule = ({ data }) => {
  if (!data) return null;

  // 1. SAFE DATA ACCESS
  const route = data.route || {};
  const partner = route.partners || {};
  const config = route.bus_configs || {};
  const freqType = data.frequency_type;
  const freqData = data.frequency_data || {};

  // 2. HELPER: DAY VISUALIZER
  // Maps IDs (1-7) to Visual Blocks
  const renderDayRow = () => {
    const DAYS = [
      { id: 1, label: 'M' }, { id: 2, label: 'T' }, { id: 3, label: 'W' },
      { id: 4, label: 'T' }, { id: 5, label: 'F' }, { id: 6, label: 'S' },
      { id: 7, label: 'S' } // Assuming 7 is Sunday, adjust based on your DB standard
    ];

    return (
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {DAYS.map(day => {
          // Check if day is active (Daily = All, Custom = Array Check)
          const isActive = freqType === 'DAILY' || freqData.days?.includes(day.id);
          
          return (
            <div key={day.id} style={{
              width: '32px', height: '32px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '900',
              background: isActive ? 'var(--brand-primary)' : 'var(--bg-input)',
              color: isActive ? 'white' : 'var(--text-muted)',
              border: isActive ? 'none' : '1px solid var(--border-subtle)'
            }}>
              {day.label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ padding: '0 32px 100px 32px' }}>
      
      {/* === SECTION A: THE AUTOMATION LOGIC === */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ 
          background: 'white', borderRadius: '16px', 
          border: '1px solid var(--border-subtle)', overflow: 'hidden',
          boxShadow: '0 4px 6px -2px rgba(0,0,0,0.02)'
        }}>
          
          {/* Header */}
          <div style={{ 
            padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <CalendarClock size={20} className="text-brand" />
            <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Automation Rules
            </h3>
          </div>

          {/* Logic Content */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Frequency Mode
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {freqType === 'DAILY' && <><Repeat size={18} /> Daily Cycle</>}
                  {freqType === 'WEEKLY' && <><CalendarDays size={18} /> Weekly Recurring</>}
                  {freqType === 'CUSTOM' && <><Zap size={18} /> Custom Pattern</>}
                  {freqType === 'SUPER_CUSTOM' && <><CalendarDays size={18} /> Specific Dates</>}
                </div>
                
                {/* Impact Description */}
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '300px', lineHeight: '1.5' }}>
                  {freqType === 'DAILY' && "System will generate a trip for this route every single day at the designated time."}
                  {freqType !== 'DAILY' && "System will only generate trips on the highlighted days below."}
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ 
                padding: '6px 12px', borderRadius: '20px', 
                background: 'rgba(245, 158, 11, 0.1)', color: '#D97706',
                fontSize: '11px', fontWeight: '800', border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                PENDING APPROVAL
              </div>
            </div>

            {/* The Visualizer */}
            {(freqType === 'DAILY' || freqType === 'WEEKLY' || freqType === 'CUSTOM') && (
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Active Operational Days
                </span>
                {renderDayRow()}
              </div>
            )}

            {/* Specific Dates List (For Super Custom) */}
            {freqType === 'SUPER_CUSTOM' && freqData.dates?.length > 0 && (
              <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {freqData.dates.map(date => (
                  <span key={date} style={{ 
                    padding: '6px 10px', borderRadius: '6px', background: 'var(--bg-input)', 
                    fontSize: '12px', fontWeight: '600', color: 'var(--text-main)'
                  }}>
                    {date}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* === SECTION B: TARGET CONTEXT (What are we automating?) === */}
      <section>
        <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', paddingLeft: '12px' }}>
          Target Configuration
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* 1. ROUTE CARD */}
          <div className="citadel-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--brand-primary)' }}>
              <MapPin size={18} />
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Route Path</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
              {route.origin_city} <ArrowRight size={16} className="text-muted" /> {route.destination_city}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Departs: {route.departure_time?.slice(0, 5) || '--:--'}
            </div>
          </div>

          {/* 2. OPERATOR CARD */}
          <div className="citadel-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--brand-primary)' }}>
              <Building2 size={18} />
              <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Operator</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
              {partner.company_name}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} /> {config.bus_class || 'Standard'} Class
            </div>
          </div>

        </div>
      </section>

      {/* === WARNING FOOTER === */}
      <div style={{ marginTop: '32px', padding: '16px', background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'start' }}>
        <AlertCircle size={20} color="#D97706" style={{ marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#9A3412' }}>Operational Warning</div>
          <p style={{ fontSize: '12px', color: '#C2410C', margin: '4px 0 0 0', lineHeight: '1.4' }}>
            Approving this schedule will immediately instruct the system to begin generating trips for the next 30-day window based on these rules. Ensure the partner has capacity.
          </p>
        </div>
      </div>

    </div>
  );
};

export default VerifySchedule;