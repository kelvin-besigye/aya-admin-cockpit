import React, { useState, useEffect } from 'react';
import { Plus, FileText, Clock, Trash2 } from 'lucide-react';

// IMPORT SUB-MODULES
import RegistryList from './components/registry/RegistryList';
import WizardContainer from './components/wizard/WizardContainer';
import PartnerDetailView from './components/registry/PartnerDetailView';

// IMPORT SERVICE (The Cloud Connector)
import { fleetService } from './data/fleet.service';

const FleetModule = () => {
  // --- STATE MANAGEMENT ---
  
  // 1. LAYOUT MODES: 'IDLE' (Dashboard), 'CREATING' (Wizard), 'VIEWING' (Detail Slide-Over)
  const [viewMode, setViewMode] = useState('IDLE');
  
  // 2. DATA SELECTION
  const [selectedPartner, setSelectedPartner] = useState(null); // For Detail View
  const [wizardInitialState, setWizardInitialState] = useState(null); // For Wizard (Edit/Resume)
  
  // 3. DRAFTS DASHBOARD (Cloud Powered)
  const [activeDrafts, setActiveDrafts] = useState([]);

  // 4. SIGNALING (To refresh the list when data changes)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- DRAFT ENGINE (CLOUD VERSION) ---
  useEffect(() => {
    if (viewMode === 'IDLE') {
      const loadDrafts = async () => {
        try {
          // Fetch directly from Supabase via Service
          const drafts = await fleetService.fetchDrafts();
          setActiveDrafts(drafts || []);
        } catch (e) { 
          console.error("Draft Load Error", e); 
        }
      };
      
      // Load immediately on mount/return to idle
      loadDrafts();
      
      // Listen for real-time updates from Wizard (it emits this event on Save)
      window.addEventListener('citadel-draft-update', loadDrafts);
      return () => window.removeEventListener('citadel-draft-update', loadDrafts);
    }
  }, [viewMode]);

  const handleDeleteDraft = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Discard this draft?")) {
      await fleetService.deleteDraft(id);
      // Refresh list manually
      const drafts = await fleetService.fetchDrafts();
      setActiveDrafts(drafts || []);
    }
  };

  // --- INTERACTION HANDLERS ---

  // 1. VIEW: Click a row in Registry -> Open Detail View
  const handlePartnerSelect = (partner) => {
    if (viewMode === 'CREATING') return; // Prevent distraction while editing
    setSelectedPartner(partner);
    setViewMode('VIEWING');
  };

  // 2. CREATE: Click "Register New" -> Open Empty Wizard
  const handleCreateNew = () => {
    setSelectedPartner(null);
    setWizardInitialState(null); // Ensure clean slate (Factory will trigger createDefaultPartner)
    setViewMode('CREATING');
  };

  // 3. RESUME: Click a Draft -> Open Wizard with Cloud Data
  const handleResumeDraft = (draft) => {
    setSelectedPartner(null);
    setWizardInitialState(draft); // Hydrate Wizard with Cloud Data
    setViewMode('CREATING');
  };

  // 4. EDIT: Click "Modify" in Registry -> Open Wizard with Live Data
  const handleEditPartner = (partner) => {
    // CRITICAL CORRECTION: 
    // We pass the FULL partner object directly (Snake Case). 
    // The WizardContainer's hydration logic (dbToForm) handles the translation to CamelCase.
    const editState = {
      id: partner.id,
      status: 'ACTIVE', // Triggers "Edit Mode" features (jumping steps, context header)
      data: partner     // PASS THE FULL RAW OBJECT HERE
    };
    
    setSelectedPartner(null);
    setWizardInitialState(editState);
    setViewMode('CREATING');
  };

  // 5. CLOSE: Return to Dashboard
  const handleCloseRightPanel = () => {
    setViewMode('IDLE');
    setSelectedPartner(null);
    setWizardInitialState(null);
    
    // Trigger a list refresh to show any new/updated records in RegistryList
    setRefreshTrigger(prev => prev + 1);
  };

  // --- KINETIC LAYOUT ENGINE ---
  // Adjusts panel widths based on what the user is doing
  const getGridColumns = () => {
    switch (viewMode) {
      case 'CREATING': return '0.6fr 3fr'; // Focus on Wizard (Shrink List)
      case 'VIEWING': return '1fr 1.5fr';  // Balanced View (Details)
      default: return '3fr 1fr';           // Dashboard Mode (Wide List)
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: getGridColumns(),
    height: '100%',
    width: '100%',
    transition: 'grid-template-columns 0.5s var(--ease-spring)',
    overflow: 'hidden',
    position: 'relative'
  };

  // --- RENDER COMPONENT: IDLE DOCK ---
  const renderIdleDock = () => (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Primary Action Button */}
      <div 
        className="citadel-card"
        onClick={handleCreateNew}
        style={{ 
          padding: '32px', textAlign: 'center', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          border: '2px dashed var(--border-subtle)', background: 'var(--bg-surface)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px var(--brand-primary-subtle)' }}>
        <Plus size={32} color="var(--bg-canvas)" strokeWidth={3} />
        </div>
        <div>
          <h3 className="text-heading" style={{ fontSize: '16px', marginBottom: '6px' }}>REGISTER NEW FLEET</h3>
          <p className="text-muted" style={{ fontSize: '13px' }}>Onboard a new operator to the network.</p>
        </div>
      </div>

      {/* Saved Cloud Drafts List */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h4 className="text-muted" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} /> Resume Progress ({activeDrafts.length})
        </h4>
        
        <div className="citadel-scroll-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
          {activeDrafts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
              No cloud drafts found.
            </div>
          ) : (
            activeDrafts.map(draft => (
              <div 
                key={draft.id} 
                className="citadel-card"
                onClick={() => handleResumeDraft(draft)} 
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '3px solid var(--status-warning)' }}
              >
                <div style={{ background: 'var(--bg-canvas)', padding: '8px', borderRadius: '6px' }}>
                  <FileText size={16} color="var(--text-muted)" />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {draft.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Step {draft.currentStep} • {new Date(draft.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDeleteDraft(e, draft.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Discard Draft"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="citadel-viewport">
      <div style={gridStyle}>
        
        {/* === LEFT PANEL: REGISTRY LIST === */}
        <div style={{ 
          borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', 
          opacity: viewMode === 'CREATING' ? 0.3 : 1, 
          pointerEvents: viewMode === 'CREATING' ? 'none' : 'auto',
          transition: 'opacity 0.5s ease', overflow: 'hidden' 
        }}>
          {/* RefreshTrigger forces list to reload when we finish a registration */}
          <RegistryList 
            key={refreshTrigger}
            onSelectPartner={handlePartnerSelect} 
            onEditPartner={handleEditPartner} 
          />
        </div>

        {/* === RIGHT PANEL: MULTI-MODE DOCK === */}
        <div style={{ 
          background: 'var(--bg-canvas)', position: 'relative', overflow: 'hidden',
          boxShadow: viewMode !== 'IDLE' ? '-10px 0 40px rgba(0,0,0,0.1)' : 'none',
          zIndex: 10
        }}>
          
          {/* MODE 1: IDLE DASHBOARD */}
          {viewMode === 'IDLE' && renderIdleDock()}

          {/* MODE 2: WIZARD (CREATE / EDIT / RESUME) */}
          {viewMode === 'CREATING' && (
            <WizardContainer 
              onClose={handleCloseRightPanel}
              initialState={wizardInitialState} 
            />
          )}

          {/* MODE 3: DETAIL VIEW (SLIDE-OVER) */}
          {viewMode === 'VIEWING' && (
            <PartnerDetailView 
              partner={selectedPartner} 
              onClose={handleCloseRightPanel} 
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default FleetModule;