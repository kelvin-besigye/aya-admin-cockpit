import React, { useState, useMemo } from 'react';
import { 
  X, Save, ArrowRight, ArrowLeft, CheckCircle, 
  Loader, CalendarClock, AlertTriangle, Cloud, ShieldCheck, Edit3, MapPin 
} from 'lucide-react';
import { schedulerService } from '../../data/scheduler.service';
import Step1_Selection from './steps/Step1_Selection';
import Step2_Frequency from './steps/Step2_Frequency';

const SchedulerWizard = ({ draft, onClose }) => {
  const isEditMode = useMemo(() => draft?.id && !draft.id.toString().startsWith('draft_'), [draft]);
  const [formData, setFormData] = useState(() => draft?.form_data || {
    partnerId: '', classId: '', routeId: '', frequencyType: 'DAILY', frequencyData: { days: [], dates: [] }
  });
  const [currentStep, setCurrentStep] = useState(draft?.step_number || 1);
  const [status, setStatus] = useState('IDLE'); 
  const [error, setError] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateForm = (updates) => { setFormData(prev => ({ ...prev, ...updates })); if (error) setError(null); };
  
  const isStepValid = () => {
    if (currentStep === 1) return !!(formData.partnerId && formData.classId && formData.routeId);
    if (currentStep === 2) return formData.frequencyType === 'DAILY' || formData.frequencyData?.days?.length > 0 || formData.frequencyData?.dates?.length > 0;
    return false;
  };

  const executeCommit = async ({ isDraft = false, isFinal = false } = {}) => {
    if (!isDraft && !isStepValid()) { setError("Complete required fields."); return; }
    setStatus('SAVING');
    try {
      if (isDraft) {
        await schedulerService.saveDraft({ id: draft?.id || `draft_${Date.now()}`, step: currentStep, data: formData });
        window.dispatchEvent(new Event('citadel-draft-update'));
        if (isFinal) onClose();
      } else {
        const payload = { route_id: formData.routeId, frequency_type: formData.frequencyType, frequency_data: formData.frequencyData };
        const res = isEditMode ? await schedulerService.updateSchedule(draft.id, payload) : await schedulerService.createSchedule(payload);
        if (res && !res.success) throw new Error(res.error);
        if (draft?.id && !isEditMode) { await schedulerService.deleteDraft(draft.id); window.dispatchEvent(new Event('citadel-draft-update')); }
        window.dispatchEvent(new Event('citadel-schedules-update'));
        setShowSuccessModal(true);
      }
      if (!isFinal) setStatus('IDLE');
    } catch (err) { setError(err.message); setStatus('IDLE'); }
  };

  if (showSuccessModal) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
      <div className="citadel-card" style={{ width: '420px', padding: '40px', textAlign: 'center', background: 'white' }}>
        <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 20px' }} />
        <h2 className="text-heading" style={{ fontSize: '20px', marginBottom: '10px' }}>Complete</h2>
        <button onClick={onClose} className="citadel-btn citadel-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Return to Registry</button>
      </div>
    </div>
  );

  const STEPS = [{ id: 1, label: 'Selection', icon: MapPin }, { id: 2, label: 'Frequency', icon: CalendarClock }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
      
      {/* 1. HEADER (Fixed) */}
      <div style={{ flexShrink: 0, height: '72px', padding: '0 24px', background: 'white', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--brand-primary)' }}>{isEditMode ? <Edit3 size={18} /> : <CalendarClock size={18} />}</div>
          <h2 className="text-heading" style={{ fontSize: '14px', margin: 0 }}>{isEditMode ? 'Edit Automation' : 'New Schedule'}</h2>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-canvas)', padding: '4px', borderRadius: '20px' }}>
          {STEPS.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '16px', background: currentStep === s.id ? 'white' : 'transparent', opacity: currentStep === s.id ? 1 : 0.5 }}>
              <s.icon size={14} /> <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowExitDialog(true)} className="citadel-btn-ghost" style={{ border: 'none', padding: '8px' }}><X size={20} /></button>
      </div>

      {/* 2. BODY (Flexible Scroll) */}
      <div className="citadel-scroll-area" style={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', padding: '32px', background: 'var(--bg-canvas)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {error && <div style={{ marginBottom: '20px', padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#B91C1C', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} /> {error}</div>}
          {currentStep === 1 ? <Step1_Selection formData={formData} onChange={updateForm} /> : <Step2_Frequency formData={formData} onChange={updateForm} />}
        </div>
        <div style={{ height: '40px' }} />
      </div>

      {/* 3. FOOTER (Fixed) */}
      <div style={{ flexShrink: 0, height: '80px', padding: '0 32px', background: 'white', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -4px 20px rgba(0,0,0,0.03)' }}>
        <button className="citadel-btn citadel-btn-ghost" onClick={() => executeCommit({ isDraft: true, isFinal: true })} disabled={status === 'SAVING'} style={{ fontSize: '12px', fontWeight: '800' }}><Save size={16} style={{ marginRight: '8px' }} /> SAVE DRAFT</button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentStep === 2 && <button className="citadel-btn citadel-btn-ghost" onClick={() => setCurrentStep(1)} style={{ fontWeight: '800' }}><ArrowLeft size={16} style={{ marginRight: '8px' }} /> BACK</button>}
          {currentStep === 1 ? (
            <button className="citadel-btn-primary" onClick={() => isStepValid() ? setCurrentStep(2) : setError("Selection required.")} style={{ minWidth: '160px', height: '44px', fontSize: '13px', fontWeight: '800' }}>NEXT STEP <ArrowRight size={16} style={{ marginLeft: '8px' }} /></button>
          ) : (
            <button className="citadel-btn-primary" onClick={executeCommit} disabled={status === 'SAVING'} style={{ minWidth: '160px', height: '44px', fontSize: '13px', fontWeight: '800', background: '#10B981', borderColor: '#10B981' }}>{status === 'SAVING' ? <Loader className="animate-spin" size={18} /> : <ShieldCheck size={18} style={{ marginRight: '8px' }} />} {isEditMode ? 'UPDATE' : 'ACTIVATE'}</button>
          )}
        </div>
      </div>

      {/* EXIT DIALOG */}
      {showExitDialog && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="citadel-card" style={{ width: '380px', padding: '32px', textAlign: 'center', background: 'white' }}>
            <h3 className="text-heading" style={{ fontSize: '18px' }}>Save Progress?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
              <button onClick={onClose} style={{ padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '10px', background: 'white', fontWeight: '800', color: '#DC2626' }}>DISCARD</button>
              <button onClick={() => executeCommit({ isDraft: true, isFinal: true })} style={{ padding: '12px', border: 'none', borderRadius: '10px', background: 'var(--brand-primary)', color: 'white', fontWeight: '900' }}>SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulerWizard;