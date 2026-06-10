import React, { useEffect, useState } from 'react';
import { 
  X, Calendar, MapPin, Bus, Clock, Trash2, Edit3, 
  Repeat, Building2, CheckCircle2, AlertTriangle, 
  ShieldCheck, ArrowRight, Activity, CalendarDays
} from 'lucide-react';

import { schedulerService } from '../../data/scheduler.service';
import { WEEK_DAYS } from '../../data/scheduler.constants';

/**
 * ELITE SCHEDULE DETAIL (The Master Inspector)
 * ------------------------------------------------------------------
 * A world-class deep-dive into an automated route schedule.
 * * * FEATURES:
 * 1. TACTILE METRICS: High-contrast data points for quick reading.
 * 2. DAY VISUALIZER: A kinetic row showing exactly when the route runs.
 * 3. SMART ACTIONS: Deep-linked to the Wizard for seamless editing.
 */

const ScheduleDetail = ({ id, onClose, onEdit }) => {
  
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const all = await schedulerService.fetchSchedules();
        const found = all.find(s => s.id === id);
        setSchedule(found);
      } catch (err) {
        console.error("Master Detail Sync Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadDetail();
  }, [id]);

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-spin text-muted"><Activity size={32} /></div>
    </div>
  );

  if (!schedule) return null;

  const { route, frequency_type, frequency_data, status } = schedule;
  const partner = route?.partners || {};
  const config = route?.bus_configs || {};

  // --- HANDLERS ---
  const handleEdit = () => {
    const editPayload = {
      id: schedule.id,
      step_number: 1,
      form_data: {
        partnerId: partner.id,
        classId: config.id,
        routeId: route.id,
        frequencyType: frequency_type,
        frequencyData: frequency_data
      }
    };
    onEdit(editPayload);
  };

  const handleDelete = async () => {
    if (!window.confirm("PERMANENT ACTION: Stop all future generation for this schedule?")) return;
    setIsDeleting(true);
    try {
      await schedulerService.deleteSchedule(id);
      window.dispatchEvent(new Event('citadel-schedules-update'));
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100%', 
      background: 'var(--bg-canvas)', overflow: 'hidden' 
    }}>
      
      {/* 1. ELITE HEADER */}
      <div style={{ 
        padding: '24px 40px', background: 'white', 
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            padding: '8px 16px', borderRadius: '20px', 
            background: status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
          }}>
            <span style={{ 
              fontSize: '11px', fontWeight: '900', 
              color: status === 'ACTIVE' ? '#059669' : '#D97706',
              textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              {status?.replace('_', ' ')}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '600' }}>
            REF: {id.slice(0, 8)}
          </span>
        </div>
        <button onClick={onClose} className="citadel-btn-ghost" style={{ padding: '8px', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
      </div>

      {/* 2. MAIN SCROLLABLE SURFACE */}
      <div className="citadel-scroll-area" style={{ flex: 1, padding: '40px' }}>
        
        {/* HERO AREA: ROUTE LOGISTICS */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
            <h1 className="text-heading" style={{ fontSize: '32px', margin: 0 }}>{route.origin_city}</h1>
            <ArrowRight size={24} className="text-muted" style={{ opacity: 0.3 }} />
            <h1 className="text-heading" style={{ fontSize: '32px', margin: 0 }}>{route.destination_city}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)' }}>
            <Building2 size={18} />
            <span style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {partner.company_name}
            </span>
          </div>
        </div>

        {/* SECTION A: FREQUENCY DASHBOARD */}
        <div className="citadel-card" style={{ padding: '32px', marginBottom: '32px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Repeat size={14} /> Automation Frequency
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>
                {frequency_type.replace('_', ' ')}
              </div>
              <p className="text-muted" style={{ fontSize: '14px', maxWidth: '300px', lineHeight: '1.5' }}>
                {frequency_type === 'DAILY' && "Generated automatically for every calendar day at the specified time."}
                {frequency_type === 'WEEKLY' && `Standard weekly run occurring every ${WEEK_DAYS.find(d => d.id === frequency_data?.days?.[0])?.full}.`}
                {frequency_type === 'CUSTOM' && `Targeted generation for ${frequency_data?.days?.length} specific days per week.`}
                {frequency_type === 'SUPER_CUSTOM' && "Event-based automation for specifically selected calendar dates."}
              </p>
            </div>

            {/* DAY VISUALIZER */}
            {['DAILY', 'WEEKLY', 'CUSTOM'].includes(frequency_type) && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {WEEK_DAYS.map(day => {
                  const isActive = frequency_type === 'DAILY' || frequency_data?.days?.includes(day.id);
                  return (
                    <div key={day.id} style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '900',
                      background: isActive ? 'var(--brand-primary)' : 'var(--bg-input)',
                      color: isActive ? 'white' : 'var(--text-muted)',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                    }}>
                      {day.label.charAt(0)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: OPERATIONAL SPECS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          
          <div className="citadel-card" style={{ padding: '24px', background: 'white' }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Time & Capacity
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900' }}>{route.departure_time?.slice(0,5)}</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{config.bus_class}</div>
              </div>
            </div>
          </div>

          <div className="citadel-card" style={{ padding: '24px', background: 'white' }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Financial Metadata
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900' }}>
                  {new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(parseFloat(route.price_ticket) + parseFloat(route.price_tax))}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Gross Fare per Seat</div>
              </div>
            </div>
          </div>

        </div>

        {/* WARNING BAR */}
        <div style={{ 
          padding: '20px', borderRadius: '16px', background: '#FFF7ED', 
          border: '1px solid #FFEDD5', display: 'flex', gap: '16px' 
        }}>
          <AlertTriangle size={20} style={{ color: '#D97706', shrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#9A3412' }}>Operational Lifecycle</div>
            <p style={{ fontSize: '12px', color: '#C2410C', margin: '4px 0 0 0', lineHeight: '1.4' }}>
              Modifying or deleting this schedule will not affect trips already generated for the current window. 
              Changes apply to the next batch cycle.
            </p>
          </div>
        </div>

      </div>

      {/* 3. ELITE ACTION FOOTER */}
      <div style={{ 
        padding: '32px 40px', background: 'white', 
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="citadel-btn-ghost"
          style={{ color: '#DC2626', fontWeight: '800', gap: '12px' }}
        >
          <Trash2 size={18} />
          {isDeleting ? "STOPPING..." : "TERMINATE AUTOMATION"}
        </button>

        <button 
          onClick={handleEdit}
          className="citadel-btn-primary"
          style={{ padding: '0 32px', height: '52px', fontWeight: '900', gap: '12px' }}
        >
          <Edit3 size={18} />
          MODIFY CONFIGURATION
        </button>
      </div>

    </div>
  );
};

export default ScheduleDetail;