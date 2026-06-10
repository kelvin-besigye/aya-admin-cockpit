import React, { useState, useMemo } from 'react';
import { 
  X, ArrowRight, Save, ArrowLeft, Loader, CheckCircle, 
  FileText, Bus, MapPin, CreditCard, Clock, Edit3, ShieldAlert, Cloud, AlertTriangle
} from 'lucide-react';

// DATA LAYER
import { routesService } from '../../data/routes.service';
import { dbToForm } from '../../data/routes.adapters';

// STEPS
import Step1_Identity from './steps/Step1_Identity';
import Step2_Geography from './steps/Step2_Geography';
import Step3_Financials from './steps/Step3_Financials';
import Step4_Schedule from './steps/Step4_Schedule';

const STEPS = [
  { id: 1, label: 'Identity', icon: Bus },
  { id: 2, label: 'Geography', icon: MapPin },
  { id: 3, label: 'Financials', icon: CreditCard },
  { id: 4, label: 'Schedule', icon: Clock }
];

const RouteWizardContainer = ({ onClose, initialState, mode = 'CREATE' }) => {

  // 1. DETECT MODE
  const isEditMode = useMemo(() => {
    if (mode === 'EDIT') return true;
    if (initialState?.id && !initialState.id.includes('-')) return false; 
    if (initialState?.id && mode !== 'CREATE') return true;
    return false;
  }, [mode, initialState]);

  // 2. INITIALIZE STATE
  const [formData, setFormData] = useState(() => {
    const base = {
      partnerId: '', busConfigId: '',
      origin: '', destination: '', park: '',
      ticketPrice: '', serviceTax: '',
      duration: { hour: '00', minute: '00' },
      timeSlots: [], time: null
    };

    if (!initialState) return base;

    try {
      if (isEditMode) return { ...base, ...dbToForm(initialState.data || initialState) };
      return { ...base, ...(initialState.data || initialState) };
    } catch (err) {
      return base;
    }
  });

  const [currentStep, setCurrentStep] = useState(initialState?.step_number || 1);
  const [status, setStatus] = useState('IDLE');
  const [error, setError] = useState(null);
  
  // Dialogs
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Draft Identity
  const [draftId, setDraftId] = useState(initialState?.id || null);

  // 3. HANDLERS
  const handleDataChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    if (error) setError(null);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!(formData.partnerId && formData.busConfigId);
      case 2: return !!(formData.origin && formData.destination && formData.park);
      case 3: return formData.ticketPrice !== '' && formData.serviceTax !== '';
      case 4: 
        const hasDuration = formData.duration?.hour && formData.duration?.minute;
        if (!hasDuration) return false;
        return isEditMode ? !!formData.time : (formData.timeSlots && formData.timeSlots.length > 0);
      default: return false;
    }
  };

  // === DRAFT ENGINE ===
  const handleSaveDraft = async (closeAfter = false) => {
    setStatus('SAVING_DRAFT');
    setError(null);

    try {
      let dId = draftId;
      if (!dId) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          dId = crypto.randomUUID();
        } else {
          dId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
      }
      
      const label = (formData.origin && formData.destination) 
        ? `${formData.origin} to ${formData.destination}` 
        : 'Untitled Route Draft';

      const result = await routesService.saveDraft({
        id: dId, step: currentStep, data: formData, label: label
      });

      if (!result.success) throw new Error(result.error || "Database rejected the draft.");

      setDraftId(dId);
      window.dispatchEvent(new Event('citadel-draft-update')); 

      if (closeAfter) {
        onClose();
      } else {
        setStatus('DRAFT_SAVED');
        setShowExitDialog(false);
        setTimeout(() => setStatus('IDLE'), 2000);
      }
    } catch (err) {
      setError(`Save Failed: ${err.message}`);
      setStatus('IDLE');
    }
  };

  // === COMMIT ENGINE ===
  const executeCommit = async () => {
    if (!isStepValid()) {
      setError("Please complete all required fields on this step.");
      return;
    }

    setStatus('SAVING');
    setError(null);

    try {
      let result;
      if (isEditMode) result = await routesService.updateRoute(initialState.id, formData);
      else result = await routesService.createRoutes(formData);

      if (result && !result.success) throw new Error(result.error);

      window.dispatchEvent(new Event('citadel-routes-update')); 
      
      if (draftId) {
        await routesService.deleteDraft(draftId);
        window.dispatchEvent(new Event('citadel-draft-update'));
      }

      setStatus('SUCCESS');
      setShowSuccessModal(true);

    } catch (err) {
      setError(err.message || "Failed to save configuration.");
      setStatus('IDLE');
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(s => s + 1);
      setError(null);
    } else {
      setError("Please complete the required fields.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1_Identity formData={formData} onChange={handleDataChange} errors={{}} />;
      case 2: return <Step2_Geography formData={formData} onChange={handleDataChange} errors={{}} />;
      case 3: return <Step3_Financials formData={formData} onChange={handleDataChange} errors={{}} />;
      case 4: return <Step4_Schedule formData={formData} onChange={handleDataChange} isEditMode={isEditMode} errors={{}} />;
      default: return <div>Unknown Step</div>;
    }
  };

  // --- EMBEDDED SUCCESS VIEW ---
  if (showSuccessModal) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="var(--status-success)" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '12px', letterSpacing: '-0.5px' }}>Route Authorized</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>This route config has been successfully pushed to the central database.</p>
          <button onClick={onClose} style={{ padding: '14px 32px', background: 'var(--brand-primary)', color: 'white', borderRadius: '12px', fontWeight: '800', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px var(--brand-subtle)' }}>
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN EMBEDDED RENDER ---
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)', position: 'relative' }}>
      
      {/* 1. HEADER (Locked & Guaranteed Fit) */}
      <div style={{ height: '76px', padding: '0 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        
        {/* Title Block (minWidth: 0 prevents it from pushing the X button out) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          <div style={{ padding: '10px', background: 'var(--brand-primary)', borderRadius: '12px', color: 'white', boxShadow: '0 4px 12px var(--brand-subtle)', flexShrink: 0 }}>
            {isEditMode ? <Edit3 size={20} /> : <FileText size={20} />}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {isEditMode ? 'Modify Configuration' : 'Route Provisioning'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
              {isEditMode ? 'Editing live route' : `Step ${currentStep} of ${STEPS.length}`}
            </div>
          </div>
        </div>

        {/* The X Button (flexShrink: 0 guarantees it never gets squished or pushed off screen) */}
        <button 
          onClick={() => setShowExitDialog(true)} 
          style={{ padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s ease', flexShrink: 0, marginLeft: '16px' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--status-danger)'; e.currentTarget.style.borderColor = 'var(--status-danger)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          title="Close Panel"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. BODY (Scrollable) */}
      <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: 'var(--bg-canvas)' }}>
        {error && (
          <div style={{ maxWidth: '800px', margin: '0 auto 24px', padding: '16px', background: 'rgba(220, 38, 38, 0.05)', color: 'var(--status-danger)', borderRadius: '12px', border: '1px solid rgba(220, 38, 38, 0.2)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '700' }}>
            <ShieldAlert size={18} /> {error}
          </div>
        )}
        {renderStepContent()}
      </div>

      {/* 3. FOOTER (Locked) */}
      <div style={{ height: '80px', padding: '0 40px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        
        <div style={{ display: 'flex', gap: '12px' }}>
           {/* SECONDARY EXIT: Explicit Cancel Button in the footer */}
           <button 
             onClick={() => setShowExitDialog(true)}
             style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', background: 'transparent', cursor: 'pointer', border: 'none', fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)' }}
           >
             Cancel
           </button>

           {/* SAVE DRAFT BUTTON (Only in Create Mode) */}
           {!isEditMode && (
              <button 
                onClick={() => handleSaveDraft(false)}
                disabled={status === 'SAVING' || status === 'SAVING_DRAFT'}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', 
                  borderRadius: '10px', background: 'var(--bg-input)', cursor: 'pointer',
                  border: '1px solid var(--border-subtle)', fontWeight: '700', fontSize: '13px',
                  color: status === 'DRAFT_SAVED' ? 'var(--status-success)' : 'var(--text-main)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                {status === 'SAVING_DRAFT' ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                <span>{status === 'DRAFT_SAVED' ? 'Saved to Cloud' : 'Save Draft'}</span>
              </button>
           )}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {currentStep > 1 && (
            <button 
              onClick={() => setCurrentStep(s => s - 1)} 
              disabled={status === 'SAVING'}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {currentStep < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={status === 'SAVING'} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', borderRadius: '10px', border: 'none', background: 'var(--brand-primary)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '13px', boxShadow: '0 8px 16px var(--brand-subtle)' }}
            >
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              onClick={executeCommit} 
              disabled={status === 'SAVING'} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', borderRadius: '10px', border: 'none', background: 'var(--status-success)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '13px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}
            >
               {status === 'SAVING' ? <Loader className="animate-spin" size={18} /> : <CheckCircle size={18} />}
               <span>{isEditMode ? 'Update Route' : 'Launch Route'}</span>
            </button>
          )}
        </div>
      </div>

      {/* CONTEXT-AWARE EXIT DIALOG */}
      {showExitDialog && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '400px', padding: '32px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            
            <div style={{ width: '60px', height: '60px', background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid var(--border-subtle)' }}>
               {isEditMode ? <AlertTriangle size={28} color="var(--status-danger)" /> : <Cloud size={28} color="var(--brand-primary)" />}
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>
              {isEditMode ? 'Discard Changes?' : 'Save Progress?'}
            </h3>
            
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.5' }}>
              {isEditMode 
                ? 'Any unsaved modifications to this route will be lost. Are you sure you want to exit?' 
                : 'You have unsaved changes in this session. Save this draft to the cloud to resume later?'}
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Discard always closes the wizard */}
              <button onClick={onClose} style={{ flex: 1, padding: '14px', border: '1px solid var(--border-subtle)', borderRadius: '10px', background: 'var(--bg-canvas)', cursor: 'pointer', fontSize: '13px', fontWeight: '800', color: 'var(--status-danger)' }}>
                {isEditMode ? 'Yes, Discard' : 'Discard'}
              </button>
              
              {/* If Editing, the other button is "Keep Editing" */}
              {isEditMode && (
                <button onClick={() => setShowExitDialog(false)} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: '10px', background: 'var(--text-main)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '800' }}>
                  Keep Editing
                </button>
              )}

              {/* If Creating, the other button is "Save Draft" */}
              {!isEditMode && (
                <button onClick={() => handleSaveDraft(true)} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: '10px', background: 'var(--brand-primary)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={16} /> Save Draft
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RouteWizardContainer;