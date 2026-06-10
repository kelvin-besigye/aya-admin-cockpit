import React, { useState, useEffect } from 'react';
import { Plus, Map, Clock, Trash2, FileText } from 'lucide-react';

// IMPORT SUB-COMPONENTS
import RouteRegistry from './components/registry/RouteRegistry';
import RouteWizardContainer from './components/wizard/RouteWizardContainer';
import RouteDetail from './components/registry/RouteDetail';

// IMPORT DATA LAYER
import { routesService } from './data/routes.service';

/**
 * 👑 AYABUS ROUTES MODULE (Sovereign Orchestrator)
 * ------------------------------------------------------------------
 * Strict Kinetic Layout Physics:
 * 1. IDLE: 80% Registry / 20% Command Dock
 * 2. CREATING: 30% Registry / 70% Wizard
 * 3. VIEWING: 40% Registry / 60% Inspector
 */

const RoutesModule = () => {
  
  // --- STATE MANAGEMENT ---
  const [viewMode, setViewMode] = useState('IDLE'); 
  const [selectedRoute, setSelectedRoute] = useState(null); 
  const [wizardInitialState, setWizardInitialState] = useState(null); 
  const [activeDrafts, setActiveDrafts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // --- DRAFT ENGINE ---
  useEffect(() => {
    if (viewMode === 'IDLE') {
      const loadDrafts = async () => {
        try {
          const drafts = await routesService.fetchDrafts();
          setActiveDrafts(drafts || []);
        } catch (e) {
          console.error("Route Drafts Load Error", e);
        }
      };
      
      loadDrafts();
      window.addEventListener('citadel-draft-update', loadDrafts);
      return () => window.removeEventListener('citadel-draft-update', loadDrafts);
    }
  }, [viewMode]);

  const handleDeleteDraft = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Discard this route draft?")) {
      await routesService.deleteDraft(id);
      const drafts = await routesService.fetchDrafts();
      setActiveDrafts(drafts || []);
    }
  };

  // --- INTERACTION HANDLERS ---
  const handleCreateNew = () => {
    setSelectedRoute(null);
    setWizardInitialState(null);
    setViewMode('CREATING');
  };

  const handleResumeDraft = (draft) => {
    setSelectedRoute(null);
    setWizardInitialState(draft);
    setViewMode('CREATING');
  };

  const onSelectFromRegistry = (route) => {
     if (viewMode === 'CREATING') return;
     setSelectedRoute(route); 
     setViewMode('VIEWING');
  };

  const onEditFromRegistry = (route) => {
     const editState = {
       id: route.id,
       status: 'ACTIVE', 
       data: route 
     };
     setSelectedRoute(null);
     setWizardInitialState(editState);
     setViewMode('CREATING');
  };

  const handleCloseRightPanel = () => {
    setViewMode('IDLE');
    setSelectedRoute(null);
    setWizardInitialState(null);
    setRefreshTrigger(prev => prev + 1); 
  };

  // --- KINETIC LAYOUT ENGINE (EXACT MATH) ---
  const getGridColumns = () => {
    switch (viewMode) {
      case 'CREATING': return '30fr 70fr'; // Exactly 30% / 70%
      case 'VIEWING': return '40fr 60fr';  // Exactly 40% / 60%
      default: return '80fr 20fr';         // Exactly 80% / 20%
    }
  };

  // --- RENDER: IDLE DOCK ---
  const renderIdleDock = () => (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Primary Action */}
      <div 
        onClick={handleCreateNew}
        style={{ 
          padding: '32px', textAlign: 'center', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          border: '2px dashed var(--border-subtle)', background: 'var(--bg-surface)',
          borderRadius: '16px', transition: 'all var(--duration-fast) var(--ease-main)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px var(--brand-subtle)' }}>
          <Plus size={32} color="var(--bg-canvas)" strokeWidth={3} />
        </div>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '6px', letterSpacing: '-0.5px' }}>DEFINE NEW ROUTE</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configure schedule & pricing.</p>
        </div>
      </div>

      {/* Drafts List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} /> Resume Progress ({activeDrafts.length})
        </h4>
        
        <div className="ayabus-scroll-area" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
          {activeDrafts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px', border: '1px solid var(--border-subtle)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
              No saved drafts found.
            </div>
          ) : (
            activeDrafts.map(draft => (
              <div 
                key={draft.id} 
                onClick={() => handleResumeDraft(draft)} 
                style={{ 
                  padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', 
                  borderLeft: '3px solid var(--status-warning)', background: 'var(--bg-surface)',
                  borderRadius: '12px', border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--status-warning)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ background: 'var(--bg-canvas)', padding: '10px', borderRadius: '8px' }}>
                  <Map size={18} color="var(--text-muted)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {draft.label || 'Untitled Route'}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Step {draft.step_number || 1} • {new Date(draft.last_updated).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDeleteDraft(e, draft.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  title="Discard Draft"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="ayabus-viewport">
      <div style={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        height: '100%',
        width: '100%',
        transition: 'grid-template-columns var(--duration-smooth) var(--ease-main)',
        overflow: 'hidden'
      }}>
        
        {/* === LEFT PANEL: REGISTRY === */}
        <div style={{ 
          borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', 
          opacity: viewMode === 'CREATING' ? 0.4 : 1, 
          pointerEvents: viewMode === 'CREATING' ? 'none' : 'auto',
          transition: 'opacity var(--duration-smooth) var(--ease-main)', 
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}>
          <RouteRegistry 
            key={refreshTrigger}
            onSelect={onSelectFromRegistry} 
            onEdit={onEditFromRegistry}
            isCompact={viewMode === 'VIEWING'}
          />
        </div>

        {/* === RIGHT PANEL: DOCK / WIZARD / DETAIL === */}
        <div style={{ 
          background: 'var(--bg-canvas)', position: 'relative', overflow: 'hidden',
          boxShadow: viewMode !== 'IDLE' ? '-20px 0 50px rgba(0,0,0,0.05)' : 'none',
          zIndex: 10,
          display: 'flex', flexDirection: 'column'
        }}>
          
          {/* MODE 1: IDLE */}
          {viewMode === 'IDLE' && renderIdleDock()}

          {/* MODE 2: CREATING */}
          {viewMode === 'CREATING' && (
            <RouteWizardContainer 
              onClose={handleCloseRightPanel}
              initialState={wizardInitialState}
              mode={wizardInitialState?.status === 'ACTIVE' ? 'EDIT' : 'CREATE'}
            />
          )}

          {/* MODE 3: VIEWING */}
          {viewMode === 'VIEWING' && selectedRoute && (
            <RouteDetail 
              route={selectedRoute} 
              onClose={handleCloseRightPanel}
              onEdit={() => onEditFromRegistry(selectedRoute)}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default RoutesModule;