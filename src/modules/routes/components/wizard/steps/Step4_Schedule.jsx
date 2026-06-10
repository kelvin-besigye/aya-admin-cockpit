import React from 'react';
import { 
  Clock, Calendar, AlertCircle, Plus, X, 
  Hourglass, ArrowRight, Split, ShieldAlert 
} from 'lucide-react';
import TimeSelector from '../../shared/TimeSelector'; 

/**
 * STEP 4: SCHEDULE (The Temporal Engine)
 * ------------------------------------------------------------------
 * Configures the timing logic.
 * * * WORLD CLASS FEATURES:
 * 1. THE EXPLOSION UI: Visually shows how 1 form becomes N routes.
 * 2. DURATION LOCK: Ensures journey time applies to all instances.
 * 3. PRECISION EDITING: Adapts UI based on 'isEditMode'.
 */

const Step4_Schedule = ({ formData, onChange, isEditMode = false, errors = {} }) => {

  // --- HANDLERS ---

  // 1. Update Duration (Global)
  const handleDurationChange = (field, value) => {
    // TimeSelector returns specific field/val, we need to merge into the duration object
    // Wait, TimeSelector calls onChange({ hour, minute, period }) full object
    // So we can just set it directly.
    onChange({ ...formData, duration: value });
  };

  // 2. Add Slot (Create Mode)
  const addTimeSlot = () => {
    const currentSlots = formData.timeSlots || [];
    const newSlot = { hour: '07', minute: '00', period: 'AM' };
    onChange({ ...formData, timeSlots: [...currentSlots, newSlot] });
  };

  // 3. Remove Slot (Create Mode)
  const removeTimeSlot = (index) => {
    const currentSlots = formData.timeSlots || [];
    if (currentSlots.length <= 1) return; // Prevent deleting last one
    const updated = currentSlots.filter((_, i) => i !== index);
    onChange({ ...formData, timeSlots: updated });
  };

  // 4. Update Specific Slot (Create Mode)
  const updateTimeSlot = (index, newVal) => {
    const currentSlots = formData.timeSlots || [];
    const updated = [...currentSlots];
    updated[index] = newVal;
    onChange({ ...formData, timeSlots: updated });
  };

  // 5. Update Single Time (Edit Mode)
  const handleSingleTimeChange = (newVal) => {
    onChange({ ...formData, time: newVal });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* 1. HEADER CONTEXT */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          width: '56px', height: '56px', margin: '0 auto 16px', 
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <Calendar size={28} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '24px', marginBottom: '8px' }}>
          Temporal Logistics
        </h3>
        <p className="text-muted" style={{ fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
          {isEditMode 
            ? "Adjust the specific timing for this individual route record."
            : "Define the journey duration and add all daily departure times. The system will generate a separate route for each slot."}
        </p>
      </div>

      {/* 2. MAIN CARD */}
      <div className="citadel-card" style={{ padding: '0', overflow: 'hidden', borderTop: '4px solid var(--brand-primary)' }}>
        
        {/* Header Bar */}
        <div style={{ 
          padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--brand-primary)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <Clock size={16} color="var(--text-inverse)" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)' }}>
              Schedule Configuration
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
             STEP 4 OF 4
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

          {/* --- SECTION A: DURATION (Global) --- */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
               <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase' }}>
                 Estimated Duration
               </label>
               <div style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                 <TimeSelector 
                   label="Journey Time"
                   type="DURATION" 
                   value={formData.duration} 
                   onChange={(val) => handleDurationChange('duration', val)}
                 />
                 <div style={{ height: '40px', width: '1px', background: 'var(--border-subtle)' }} />
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '200px', lineHeight: '1.5' }}>
                   <strong style={{ color: 'var(--text-main)' }}>Standardized Time:</strong><br/>
                   This duration will be applied to all departure slots generated in this batch.
                 </div>
               </div>
               {errors.duration && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--status-danger)', fontWeight: '600' }}>
                    {errors.duration}
                  </div>
               )}
            </div>
          </div>

          <div style={{ height: '1px', width: '100%', background: 'var(--border-subtle)' }} />

          {/* --- SECTION B: DEPARTURE SLOTS --- */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <label className="text-muted" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Split size={14} /> {isEditMode ? 'Departure Time' : 'Daily Departure Slots'}
              </label>
              
              {!isEditMode && (
                <button 
                  onClick={addTimeSlot}
                  className="citadel-btn-ghost"
                  style={{ 
                    color: 'var(--brand-primary)', background: 'rgba(37, 99, 235, 0.1)', 
                    padding: '8px 12px', fontSize: '12px', fontWeight: '700' 
                  }}
                >
                  <Plus size={14} /> Add Slot
                </button>
              )}
            </div>

            {/* SCENARIO 1: EDIT MODE (Single Locked Slot) */}
            {isEditMode && (
               <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid var(--status-warning)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)', fontWeight: '800', color: 'var(--status-warning)' }}>
                   01
                 </div>
                 <TimeSelector 
                   label="Set Off"
                   type="CLOCK" 
                   value={formData.time || { hour: '12', minute: '00', period: 'PM' }} 
                   onChange={handleSingleTimeChange}
                 />
                 <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--status-warning)', fontWeight: '600' }}>
                   <ShieldAlert size={14} /> SINGLE INSTANCE EDIT
                 </div>
               </div>
            )}

            {/* SCENARIO 2: CREATE MODE (The Explosion List) */}
            {!isEditMode && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                
                {(formData.timeSlots || []).map((slot, index) => (
                  <div key={index} className="citadel-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    
                    <TimeSelector 
                      label="Set Off"
                      type="CLOCK" 
                      value={slot} 
                      onChange={(val) => updateTimeSlot(index, val)}
                    />

                    {/* Remove Action */}
                    {(formData.timeSlots || []).length > 1 && (
                      <button 
                        onClick={() => removeTimeSlot(index)}
                        style={{ 
                          position: 'absolute', top: '8px', right: '8px',
                          background: 'transparent', border: 'none', color: 'var(--text-muted)',
                          cursor: 'pointer', padding: '4px', opacity: 0.5,
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--status-danger)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty Error */}
            {!isEditMode && (!formData.timeSlots || formData.timeSlots.length === 0) && (
              <div style={{ padding: '16px', border: '1px dashed var(--status-danger)', borderRadius: '12px', color: 'var(--status-danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> At least one departure time is required.
              </div>
            )}

          </div>

          {/* --- SECTION C: EXPLOSION SUMMARY --- */}
          {!isEditMode && (formData.timeSlots || []).length > 0 && (
             <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ padding: '8px', background: 'var(--brand-primary)', borderRadius: '6px', color: 'white' }}>
                   <Split size={16} />
                 </div>
                 <div>
                   <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Batch Generation</div>
                   <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                     This action will create <strong>{(formData.timeSlots || []).length} independent routes</strong> in the registry.
                   </div>
                 </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Step4_Schedule;