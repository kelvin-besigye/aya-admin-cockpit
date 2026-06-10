import React, { useState, useMemo } from 'react';
import { 
  X, ArrowRight, Save, ArrowLeft, AlertCircle, Loader, 
  Layout, CheckCircle, Camera, Armchair, Coffee, Edit3, FileText 
} from 'lucide-react';

// DATA & MODELS
import { createDefaultBusConfig } from '../../data/bus.models';
import { busService } from '../../data/bus.service';
import { dbToForm } from '../../data/bus.adapters'; 

// STEPS
import Step1_Class from './steps/Step1_Class';
import Step2_Layout from './steps/Step2_Layout';
import Step3_Visuals from './steps/Step3_Visuals';
import Step4_Amenities from './steps/Step4_Amenities';

const STEPS = [
  { id: 1, label: 'Service Profile', icon: Layout },
  { id: 2, label: 'Seat Layout', icon: Armchair },
  { id: 3, label: 'Visual Profile', icon: Camera },
  { id: 4, label: 'Amenities', icon: Coffee }
];

const BusWizardContainer = ({ onClose, initialState, mode = 'CREATE' }) => {
  
  // 1. ROBUST MODE DETECTION
  const isEditMode = useMemo(() => {
    if (mode === 'EDIT') return true;
    // Fallback: If it has an ID and it's NOT a draft string, it's an edit
    if (initialState?.id && !initialState.id.startsWith('bus_draft_')) return true;
    return false;
  }, [mode, initialState]);

  // 2. HYDRATION ENGINE (The Fix for "Empty Form / Input Required")
  const [formData, setFormData] = useState(() => {
    const base = createDefaultBusConfig();
    if (!initialState) return base;

    try {
      // SMART DATA FINDER:
      const rawData = initialState.data || initialState;
      
      if (isEditMode) {
        const adapted = dbToForm(rawData);
        return adapted ? { ...base, ...adapted } : base;
      }
      
      return rawData ? { ...base, ...rawData } : base;
    } catch (err) {
      console.error("Hydration Failed:", err);
      return base; 
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState('IDLE'); 
  const [error, setError] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 3. STATE MANAGER
  const handleDataChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    if (error) setError(null);
  };

  // 4. VALIDATION ENGINE
  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!(formData.partnerId && formData.busClass);
      case 2: return formData.layout && formData.layout.total_rows >= 5;
      case 3: 
        const hasProfile = !!formData.profile_image;
        const galleryCount = formData.gallery_images?.length || 0;
        return hasProfile && galleryCount >= 3;
      case 4: return true;
      default: return false;
    }
  };

  // 5. THE UNIFIED COMMIT ENGINE
  const executeCommit = async ({ close = false, next = false } = {}) => {
    
    if (!isStepValid()) {
      setError("Please complete all required fields on this step.");
      return;
    }

    setStatus('SAVING');
    setError(null);

    try {
      let result;

      if (isEditMode) {
        // === EDIT PATH ===
        result = await busService.updateBusConfig(initialState.id, formData);
      } else {
        // === CREATE PATH ===
        if (close || next) { 
           result = await busService.createBusConfig(formData);
        }
      }

      if (result && !result.success) throw new Error(result.error);

      // SUCCESS ACTIONS
      window.dispatchEvent(new Event('citadel-bus-update')); 

      // Cleanup Draft (Only in Create Mode)
      if (!isEditMode && initialState?.id && initialState.id.startsWith('bus_draft_')) {
        await busService.deleteDraft(initialState.id);
        window.dispatchEvent(new Event('citadel-draft-update'));
      }

      // Feedback / Navigation
      if (close) {
        if (!isEditMode) {
          setStatus('SUCCESS');
          setShowSuccessModal(true);
        } else {
          onClose();
        }
      } else if (next) {
        setStatus('IDLE');
        setCurrentStep(s => Math.min(STEPS.length, s + 1));
      } else {
        setStatus('SUCCESS');
        setTimeout(() => setStatus('IDLE'), 1500);
      }

    } catch (err) {
      console.error("Commit Failed:", err);
      setError(err.message || "Failed to save configuration.");
      setStatus('IDLE');
    }
  };

  // 6. HANDLER: DRAFT SAVE (Create Mode Only)
  const handleSaveDraft = async (shouldClose = false) => {
    if (isEditMode) return; 

    setStatus('SAVING');
    try {
      const draftId = initialState?.id || `bus_draft_${Date.now()}`;
      await busService.saveDraft({
        id: draftId,
        currentStep,
        data: formData, 
        label: formData.busClass ? `${formData.busClass} Config` : "Untitled"
      });
      window.dispatchEvent(new Event('citadel-draft-update')); 
      
      if (shouldClose) onClose();
      else setStatus('IDLE');
    } catch (err) {
      setError("Could not save draft.");
      setStatus('IDLE');
    }
  };

  // 7. HANDLER: NEXT (Logic Split)
  const handleNext = async () => {
    if (isEditMode) {
      // EDIT MODE: Direct Save -> Move (No Drafts)
      await executeCommit({ next: true });
    } else {
      // CREATE MODE: Save Draft -> Move
      if (isStepValid()) {
        await handleSaveDraft(false);
        setCurrentStep(s => Math.min(STEPS.length, s + 1));
        setError(null);
      } else {
        setError("Please complete the required fields.");
      }
    }
  };

  // 8. RENDERER
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1_Class data={formData} onChange={handleDataChange} />;
      case 2: return <Step2_Layout data={formData} onChange={handleDataChange} />;
      case 3: return <Step3_Visuals data={formData} onChange={handleDataChange} />;
      case 4: return <Step4_Amenities data={formData} onChange={handleDataChange} />;
      default: return <div>Unknown Step</div>;
    }
  };

  const progressPercent = ((currentStep) / STEPS.length) * 100;

  // === SUCCESS MODAL ===
  if (showSuccessModal) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
        <div className="citadel-card" style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={32} color="var(--status-success)" />
          </div>
          <h2 className="text-heading" style={{ fontSize: '20px', marginBottom: '12px' }}>Configuration Submitted</h2>
          
          {/* === THE CORRECTED MESSAGE === */}
          <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
            Changes saved. This bus is now marked as <strong>'Pending Approval'</strong> in the registry.
          </p>

          <button onClick={onClose} className="citadel-btn citadel-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg-canvas)', position: 'relative' }}>
      
      {/* === HEADER === */}
      <div style={{ padding: '0', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="text-heading" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              {isEditMode ? <Edit3 size={20} color="var(--brand-primary)" /> : React.createElement(STEPS[currentStep - 1].icon, { size: 20, color: 'var(--brand-primary)' })}
              {isEditMode ? 'Edit Profile' : STEPS[currentStep - 1].label}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Step {currentStep} of {STEPS.length}
            </div>
          </div>
          <button onClick={() => setShowExitDialog(true)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: '8px' }}>
            <X size={24} />
          </button>
        </div>
        <div style={{ height: '4px', width: '100%', background: 'var(--bg-input)' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--brand-primary)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* === BODY === */}
      <div className="citadel-scroll-area" style={{ padding: '32px' }}>
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#FEF2F2', color: '#B91C1C', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '600', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
        <div style={{ maxWidth: '1000px', margin: '0 auto', height: '100%' }}>
          {renderStepContent()}
        </div>
      </div>

      {/* === FOOTER (STRICTLY SEPARATED) === */}
      <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        
        {/* --- BRANCH A: EDIT MODE --- */}
        {isEditMode ? (
          <>
            <button 
              className="citadel-btn citadel-btn-ghost" 
              onClick={() => executeCommit({ close: true })}
              disabled={status === 'SAVING'}
              style={{ color: 'var(--brand-primary)', fontWeight: '700' }}
            >
               {status === 'SAVING' ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} 
               <span style={{ marginLeft: '8px' }}>Save Changes & Close</span>
            </button>

            <div style={{ display: 'flex', gap: '16px' }}>
              {currentStep > 1 && (
                <button 
                  className="citadel-btn citadel-btn-ghost"
                  onClick={() => setCurrentStep(s => s - 1)}
                  disabled={status === 'SAVING'}
                >
                  <ArrowLeft size={16} /> <span style={{ marginLeft: '8px' }}>Back</span>
                </button>
              )}
              
              {currentStep < STEPS.length ? (
                <button 
                  className="citadel-btn citadel-btn-primary"
                  onClick={handleNext}
                  disabled={status === 'SAVING'}
                >
                  Save & Continue <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              ) : (
                <button 
                  className="citadel-btn citadel-btn-primary"
                  onClick={() => executeCommit({ close: true })}
                  disabled={status === 'SAVING'}
                >
                   {status === 'SAVING' ? <Loader className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                   <span style={{ marginLeft: '8px' }}>Update Profile</span>
                </button>
              )}
            </div>
          </>
        ) : (
          /* --- BRANCH B: CREATE MODE --- */
          <>
             <button 
              className="citadel-btn citadel-btn-ghost" 
              onClick={() => handleSaveDraft(true)}
              disabled={status === 'SAVING'}
              style={{ color: 'var(--text-muted)' }}
            >
              {status === 'SAVING' ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} 
              <span style={{ marginLeft: '8px' }}>Save Draft & Exit</span>
            </button>

            <div style={{ display: 'flex', gap: '16px' }}>
              {currentStep > 1 && (
                <button 
                  className="citadel-btn citadel-btn-ghost"
                  onClick={() => setCurrentStep(s => s - 1)}
                  disabled={status === 'SAVING'}
                >
                  <ArrowLeft size={16} /> <span style={{ marginLeft: '8px' }}>Back</span>
                </button>
              )}

              {currentStep < STEPS.length ? (
                <button 
                  className="citadel-btn citadel-btn-primary"
                  onClick={handleNext}
                  disabled={status === 'SAVING'}
                >
                  Continue <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              ) : (
                <button 
                  className="citadel-btn citadel-btn-primary"
                  onClick={() => executeCommit({ close: true })}
                  disabled={status === 'SAVING'}
                  style={{ background: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                >
                  {status === 'SAVING' ? <Loader className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                  <span style={{ marginLeft: '8px' }}>Submit for Approval</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* === EXIT DIALOG === */}
      {showExitDialog && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="citadel-card" style={{ width: '400px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', borderRadius: '20px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--bg-hover)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="var(--brand-primary)" />
            </div>
            <h3 className="text-heading" style={{ fontSize: '20px', marginBottom: '12px' }}>Close Configuration?</h3>
            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '32px', lineHeight: '1.5' }}>
              {isEditMode 
                ? "Changes made on this step may be lost." 
                : "We can save your progress so you don't lose your work."}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button 
                onClick={onClose} 
                style={{ padding: '14px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'transparent', fontWeight: '700', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                Discard
              </button>
              
              {!isEditMode ? (
                <button 
                  onClick={() => handleSaveDraft(true)} 
                  style={{ padding: '14px', border: 'none', borderRadius: '12px', background: 'var(--brand-primary)', fontWeight: '700', cursor: 'pointer', color: 'white' }}
                >
                  Save & Exit
                </button>
              ) : (
                <button 
                  onClick={() => executeCommit({ close: true })}
                  style={{ padding: '14px', border: 'none', borderRadius: '12px', background: 'var(--brand-primary)', fontWeight: '700', cursor: 'pointer', color: 'white' }}
                >
                  Save & Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusWizardContainer;
