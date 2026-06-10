import React, { useState, useMemo } from 'react';
import { 
  X, ArrowRight, Save, CheckCircle, ArrowLeft, AlertCircle, Loader, Edit3, FileText 
} from 'lucide-react'; 

import { ONBOARDING_STEPS } from '../../data/fleet.constants';
import { createDefaultPartner } from '../../data/fleet.models';
import { fleetService } from '../../data/fleet.service';
import { dbToForm } from '../../data/fleet.adapters';

import Step1_Credentials from './steps/Step1_Credentials';
import Step2_Parks from './steps/Step2_Parks';
import Step3_Financials from './steps/Step3_Financials';
import Step4_Contacts from './steps/Step4_Contacts';

const SAFE_STEPS = ONBOARDING_STEPS || [
  { id: 1, label: 'Company Identity' }, 
  { id: 2, label: 'Operations' }, 
  { id: 3, label: 'Financials' }, 
  { id: 4, label: 'Contacts' }
];

const WizardContainer = ({ onClose, initialState }) => {
  
  // 1. MODE DETECTION
  const isEditMode = useMemo(() => {
    return initialState && initialState.status === 'ACTIVE';
  }, [initialState]);

  // 2. HYDRATION ENGINE
  const [formData, setFormData] = useState(() => {
    const defaults = createDefaultPartner();
    if (!initialState) return defaults;
    
    try {
      if (isEditMode) {
        const adapted = dbToForm(initialState.data);
        return adapted ? { ...defaults, ...adapted } : defaults;
      }
      return { ...defaults, ...initialState.data };
    } catch (err) {
      console.error("CRITICAL: Hydration Failed", err);
      return defaults; 
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState('IDLE'); 
  const [error, setError] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // === THE NEW STATE ===
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 3. SAFE STATE UPDATER
  const handleDataChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    if (saveStatus === 'SUCCESS') setSaveStatus('IDLE');
    if (error) setError(null); 
  };

  // 4. THE COMMIT ENGINE
  const executeCommit = async (shouldClose) => {
    if (!validateCurrentStep()) {
      setError("Please fill in all required fields before saving.");
      return;
    }

    setSaveStatus('SAVING');
    setError(null);

    try {
      let result;
      // B. EXECUTE WRITE
      if (isEditMode) {
        result = await fleetService.updatePartner(formData);
      } else {
        result = await fleetService.createPartner(formData);
      }

      if (!result.success) {
        throw new Error(result.error || "Database operation failed.");
      }

      // C. DRAFT CLEANUP
      if (!isEditMode && initialState?.id && initialState.id.startsWith('draft_')) {
        try {
          await fleetService.deleteDraft(initialState.id);
          window.dispatchEvent(new Event('citadel-draft-update')); 
        } catch (cleanupErr) {
          console.warn("Draft auto-cleanup failed (non-critical):", cleanupErr);
        }
      }

      // D. SUCCESS PATH
      window.dispatchEvent(new Event('citadel-fleet-update')); 
      
      if (shouldClose) {
        // === SHOW MODAL INSTEAD OF CLOSING ===
        setSaveStatus('SUCCESS');
        setShowSuccessModal(true);
      } else {
        setSaveStatus('SUCCESS');
        setTimeout(() => setSaveStatus('IDLE'), 2000);
      }

    } catch (err) {
      console.error("Save Failed:", err);
      setError(err.message || "Could not save changes. Please try again.");
      setSaveStatus('IDLE');
    }
  };

  // 5. DRAFT LOGIC
  const saveDraft = async () => {
    if (isEditMode) return; 
    setSaveStatus('SAVING');
    try {
      const draftId = initialState?.id || `draft_${Date.now()}`;
      await fleetService.saveDraft({
        id: draftId,
        currentStep,
        data: formData,
        label: formData.companyName || "Untitled"
      });
      window.dispatchEvent(new Event('citadel-draft-update'));
      onClose();
    } catch (err) {
      setError("Could not save draft.");
      setSaveStatus('IDLE');
    }
  };

  const handleCloseRequest = () => {
    if (isEditMode) onClose();
    else setShowExitDialog(true);
  };

  // 6. THE FIREWALL
  const safeFormData = useMemo(() => ({
    ...formData,
    parks: Array.isArray(formData.parks) ? formData.parks : [],
    financials: Array.isArray(formData.financials) ? formData.financials : [],
    contacts: Array.isArray(formData.contacts) ? formData.contacts : []
  }), [formData]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1_Credentials data={safeFormData} onChange={handleDataChange} />;
      case 2: return <Step2_Parks data={safeFormData} onChange={handleDataChange} />;
      case 3: return <Step3_Financials data={safeFormData} onChange={handleDataChange} />;
      case 4: return <Step4_Contacts data={safeFormData} onChange={handleDataChange} />;
      default: return <div>Unknown Step</div>;
    }
  };

  // 7. VALIDATION
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: return !!(formData.companyName && formData.partnerId && formData.partnerId.length >= 3);
      case 2: return formData.parks && formData.parks.length > 0;
      case 3: return formData.financials && formData.financials.length > 0;
      case 4: return formData.contacts && formData.contacts.length > 0;
      default: return true;
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(s => Math.min(SAFE_STEPS.length, s + 1));
      setError(null);
    } else {
      setError("Please complete the required fields to proceed.");
    }
  };

  // === SUCCESS MODAL ===
  if (showSuccessModal) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
        <div className="citadel-card" style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={32} color="var(--status-success)" />
          </div>
          <h2 className="text-heading" style={{ fontSize: '20px', marginBottom: '12px' }}>Application Submitted</h2>
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
             {isEditMode 
              ? "Changes saved. This partner is now marked as 'Pending Approval' in the registry."
              : "This application has been submitted and is now Pending Approval."}
          </p>
          <button 
            onClick={onClose} 
            className="citadel-btn citadel-btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg-canvas)', position: 'relative' }}>
      
      {/* HEADER */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 className="text-heading" style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditMode ? <Edit3 size={18} color="var(--brand-primary)" /> : null}
            {isEditMode ? `Editing: ${formData.companyName}` : SAFE_STEPS[currentStep - 1].label}
          </h2>
          <div style={{ display: 'flex', gap: '4px' }}>
             {SAFE_STEPS.map((_, i) => (
               <div key={i} style={{ 
                 width: '20px', height: '4px', borderRadius: '2px', 
                 background: (i + 1) === currentStep ? 'var(--brand-primary)' : 'var(--border-subtle)',
                 opacity: (i + 1) <= currentStep ? 1 : 0.3
               }} />
             ))}
          </div>
        </div>
        <button onClick={handleCloseRequest} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px' }}><X size={24} /></button>
      </div>

      {/* BODY */}
      <div className="citadel-scroll-area" style={{ padding: '32px' }}>
        {error && (
          <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #EF4444', color: '#B91C1C', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {renderStepContent()}
      </div>

      {/* FOOTER */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        
        {/* BACK */}
        <button 
          className="citadel-btn citadel-btn-ghost" 
          onClick={() => setCurrentStep(s => Math.max(1, s - 1))} 
          disabled={currentStep === 1 || saveStatus === 'SAVING'} 
          style={{ opacity: currentStep === 1 ? 0.3 : 1, pointerEvents: currentStep === 1 ? 'none' : 'auto' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: '12px' }}>
          
          {/* === EDIT MODE === */}
          {isEditMode && (
            <>
              {/* SAVE CHANGES (Incremental) */}
              <button 
                className="citadel-btn citadel-btn-ghost" 
                onClick={() => executeCommit(false)} 
                disabled={saveStatus === 'SAVING'}
                style={{ color: saveStatus === 'SUCCESS' ? 'var(--status-success)' : 'var(--text-muted)' }}
              >
                {saveStatus === 'SAVING' ? <Loader className="animate-spin" size={16} /> : (
                  saveStatus === 'SUCCESS' ? <CheckCircle size={16} /> : <Save size={16} />
                )}
                <span style={{ marginLeft: '8px' }}>
                  {saveStatus === 'SAVING' ? 'Saving...' : (saveStatus === 'SUCCESS' ? 'Saved!' : 'Save Changes')}
                </span>
              </button>

              {/* SAVE & CLOSE */}
              <button 
                className="citadel-btn citadel-btn-ghost" 
                onClick={() => executeCommit(true)} 
                disabled={saveStatus === 'SAVING'}
                style={{ border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)' }}
              >
                <CheckCircle size={16} /> <span style={{ marginLeft: '8px' }}>Save & Close</span>
              </button>

              {/* CONTINUE */}
              {currentStep < SAFE_STEPS.length && (
                <button 
                  className="citadel-btn citadel-btn-primary" 
                  onClick={handleNextStep} 
                  disabled={saveStatus === 'SAVING'}
                >
                  Continue <ArrowRight size={18} />
                </button>
              )}
            </>
          )}

          {/* === CREATE MODE === */}
          {!isEditMode && (
            <>
              <button className="citadel-btn citadel-btn-ghost" onClick={saveDraft} disabled={saveStatus === 'SAVING'}>
                {saveStatus === 'SAVING' ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} 
                <span style={{ marginLeft: '8px' }}>Save Draft</span>
              </button>

              {currentStep < SAFE_STEPS.length ? (
                <button className="citadel-btn citadel-btn-primary" onClick={handleNextStep} disabled={saveStatus === 'SAVING'}>
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button className="citadel-btn citadel-btn-primary" onClick={() => executeCommit(true)} disabled={saveStatus === 'SAVING'}>
                  {saveStatus === 'SAVING' ? 'Processing...' : 'Submit Application'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* EXIT DIALOG */}
      {showExitDialog && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="citadel-card" style={{ width: '400px', padding: '0', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--bg-hover)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="var(--brand-primary)" />
              </div>
              <h3 className="text-heading" style={{ fontSize: '18px', marginBottom: '8px' }}>Save Progress?</h3>
              <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.5' }}>You have unsaved changes. Save this draft to the cloud?</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={onClose} style={{ padding: '16px', border: 'none', background: 'var(--bg-surface)', color: 'var(--status-danger)', fontWeight: '600', cursor: 'pointer', borderRight: '1px solid var(--border-subtle)', fontSize: '13px' }}>Discard</button>
              <button onClick={saveDraft} style={{ padding: '16px', border: 'none', background: 'var(--bg-surface)', color: 'var(--brand-primary)', fontWeight: '700', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={saveStatus === 'SAVING'}>
                {saveStatus === 'SAVING' ? <Loader className="animate-spin" size={14} /> : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WizardContainer;