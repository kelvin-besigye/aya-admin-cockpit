import React, { useState, useEffect } from 'react';
import { Plus, FileText, Clock, Trash2, Bus } from 'lucide-react';

// IMPORT SUB-COMPONENTS
import BusRegistry from './components/registry/BusRegistry';
import BusWizardContainer from './components/wizard/BusWizardContainer';
// Note: We will build this detail view next to complete the loop
import BusDetailView from './components/registry/BusDetailView'; 

// IMPORT SERVICE (The Cloud Connector)
import { busService } from './data/bus.service';

/**
 * BUS CONFIGURATION MODULE (The Master Controller)
 * ------------------------------------------------------------------
 * The Entry Point for the Bus Detailing Centre.
 * * * ARCHITECTURE:
 * 1. LEFT PANEL: The Registry (List of Buses).
 * 2. RIGHT PANEL: The Multi-Mode Dock (Dashboard / Wizard / Details).
 * 3. STATE MACHINE: Manages transitions between 'IDLE', 'CREATING', and 'VIEWING'.
 */

const BusConfigModule = () => {
  // --- STATE MANAGEMENT ---
  
  // 1. MODES: 'IDLE' (Dashboard), 'CREATING' (Wizard), 'VIEWING' (Detail Slide-Over)
  const [viewMode, setViewMode] = useState('IDLE');
  
  // 2. SELECTION DATA
  const [selectedConfig, setSelectedConfig] = useState(null); // For Detail View
  const [wizardInitialState, setWizardInitialState] = useState(null); // For Wizard (Edit/Resume)
  
  // 3. DRAFTS DASHBOARD
  const [activeDrafts, setActiveDrafts] = useState([]);

  // 4. SIGNALING (Forces Registry to reload after a Save)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- DRAFT ENGINE (CLOUD POWERED) ---
  useEffect(() => {
    if (viewMode === 'IDLE') {
      const loadDrafts = async () => {
        try {
          const drafts = await busService.fetchDrafts();
          setActiveDrafts(drafts || []);
        } catch (e) { 
          console.error("Draft Load Error", e); 
        }
      };
      
      loadDrafts();
      
      // Listen for updates from the Wizard
      window.addEventListener('citadel-bus-draft-update', loadDrafts);
      return () => window.removeEventListener('citadel-bus-draft-update', loadDrafts);
    }
  }, [viewMode]);

  const handleDeleteDraft = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Discard this configuration draft?")) {
      await busService.deleteDraft(id);
      // Refresh list manually
      const drafts = await busService.fetchDrafts();
      setActiveDrafts(drafts || []);
    }
  };

  // --- INTERACTION HANDLERS ---

  // 1. VIEW: Click a bus in Registry -> Open Detail View
  const handleConfigSelect = (config) => {
    if (viewMode === 'CREATING') return; // Focus lock
    setSelectedConfig(config);
    setViewMode('VIEWING');
  };

  // 2. CREATE: Click "New Config" -> Open Empty Wizard
  const handleCreateNew = () => {
    setSelectedConfig(null);
    setWizardInitialState(null); // Clean slate
    setViewMode('CREATING');
  };

  // 3. RESUME: Click a Draft -> Open Wizard with Cloud Data
  const handleResumeDraft = (draft) => {
    setSelectedConfig(null);
    setWizardInitialState(draft); // Hydrate Wizard
    setViewMode('CREATING');
  };

  // 4. EDIT: Click "Modify" in Detail View (Passed down later)
  const handleEditConfig = (config) => {
    // Map DB Model to Wizard Model if necessary
    const editState = {
      id: config.id, // Keep ID to update existing record instead of creating new
      currentStep: 1, 
      data: {
        ...config, // Load existing data
        // Ensure complex objects like 'layout' are correctly passed
        layout: config.layout_config || config.layout 
      }
    };
    
    setSelectedConfig(null);
    setWizardInitialState(editState);
    setViewMode('CREATING');
  };

  // 5. CLOSE: Return to Dashboard
  const handleCloseRightPanel = () => {
    setViewMode('IDLE');
    setSelectedConfig(null);
    setWizardInitialState(null);
    
    // Refresh the Left Panel in case we just added a new bus
    setRefreshTrigger(prev => prev + 1);
  };

  // --- KINETIC LAYOUT ENGINE ---
  // Calculates the width of the Left/Right panels based on mode
  const getGridColumns = () => {
    switch (viewMode) {
      case 'CREATING': return '0.6fr 3fr'; // Focus on Wizard (15% List / 85% Wizard)
      case 'VIEWING': return '1fr 1.5fr';  // Balanced View (40% List / 60% Details)
      default: return '3fr 1fr';           // Dashboard Mode (75% List / 25% Dock)
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: getGridColumns(),
    height: '100%',
    width: '100%',
    transition: 'grid-template-columns 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)', // Smooth Spring
    overflow: 'hidden',
    position: 'relative'
  };

  // --- RENDER COMPONENT: IDLE DOCK ---
  const renderIdleDock = () => (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* A. PRIMARY ACTION */}
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
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)' }}>
          <Plus size={32} color="white" strokeWidth={3} />
        </div>
        <div>
          <h3 className="text-heading" style={{ fontSize: '16px', marginBottom: '6px' }}>CONFIGURE NEW BUS</h3>
          <p className="text-muted" style={{ fontSize: '13px' }}>Design a seating layout and profile.</p>
        </div>
      </div>

      {/* B. DRAFTS LIST */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h4 className="text-muted" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} /> Resume Work ({activeDrafts.length})
        </h4>
        
        <div className="citadel-scroll-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
          {activeDrafts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
              No active drafts.
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
                  <Bus size={16} color="var(--text-muted)" />
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
    <div className="citadel-viewport" style={{ height: '100vh', width: '100%' }}>
      <div style={gridStyle}>
        
        {/* === LEFT PANEL: REGISTRY LIST === */}
        <div style={{ 
          borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', 
          opacity: viewMode === 'CREATING' ? 0.3 : 1, 
          pointerEvents: viewMode === 'CREATING' ? 'none' : 'auto',
          transition: 'opacity 0.5s ease', overflow: 'hidden' 
        }}>
          {/* We use a key to force re-render when refreshTrigger changes */}
          <BusRegistry 
            key={refreshTrigger}
            onSelectConfig={handleConfigSelect} 
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
            <BusWizardContainer 
              onClose={handleCloseRightPanel}
              initialState={wizardInitialState} 
            />
          )}

          {/* MODE 3: DETAIL VIEW (SLIDE-OVER) */}
          {viewMode === 'VIEWING' && (
            // Placeholder for the file we haven't created yet, but imported
            <BusDetailView 
              config={selectedConfig} 
              onClose={handleCloseRightPanel} 
              onEdit={() => handleEditConfig(selectedConfig)}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default BusConfigModule;