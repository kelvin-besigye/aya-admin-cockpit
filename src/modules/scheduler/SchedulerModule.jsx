import React, { useState } from 'react';
import './styles/scheduler.animations.css'; 

// --- COMPONENTS ---
import SchedulerRegistry from './components/registry/SchedulerRegistry';
import SchedulerWizard from './components/wizard/SchedulerWizard';
import ScheduleDetail from './components/details/ScheduleDetail';
import DraftsList from './drafts/DraftsList';

const SchedulerModule = () => {
  const [viewMode, setViewMode] = useState('IDLE');
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [wizardData, setWizardData] = useState(null);

  const getGridColumns = () => {
    switch (viewMode) {
      case 'CREATING': return '0.4fr 0.6fr'; 
      case 'VIEWING':  return '0.3fr 0.7fr';
      default:         return '0.8fr 0.2fr';
    }
  };

  // HANDLERS
  const handleOpenWizard = (draft = null) => {
    setWizardData(draft);
    setSelectedScheduleId(null);
    setViewMode('CREATING');
  };

  const handleSelectSchedule = (id) => {
    setSelectedScheduleId(id);
    setWizardData(null);
    setViewMode('VIEWING');
  };

  const handleEditSchedule = (editPayload) => {
    setWizardData(editPayload); 
    setViewMode('CREATING');   
  };

  const handleCloseRightPanel = () => {
    setViewMode('IDLE');
    setTimeout(() => {
      setSelectedScheduleId(null);
      setWizardData(null);
    }, 400);
  };

  return (
    <div className="citadel-viewport" style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        height: '100%', // FORCE HEIGHT
        width: '100%',
        transition: 'grid-template-columns 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        background: 'var(--bg-canvas)'
      }}>
        
        {/* === LEFT PANEL === */}
        <div style={{ 
            height: '100%', 
            borderRight: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Locks the registry list
          }}>
          <SchedulerRegistry 
            onSelect={handleSelectSchedule} 
            selectedId={selectedScheduleId}
          />
        </div>

        {/* === RIGHT PANEL === */}
        <div style={{ 
            height: '100%', // FORCE HEIGHT
            position: 'relative',
            zIndex: 20,
            background: viewMode === 'IDLE' ? 'var(--bg-canvas)' : 'white',
            overflow: 'hidden', // CRITICAL: Prevents expansion
            boxShadow: viewMode !== 'IDLE' ? '-10px 0 40px rgba(0,0,0,0.08)' : 'none'
          }}>
          
          {/* IDLE STATE */}
          {viewMode === 'IDLE' && (
            <div className="animate-in fade-in" style={{ height: '100%', overflow: 'hidden' }}>
              <DraftsList onResume={handleOpenWizard} />
            </div>
          )}

          {/* WIZARD STATE - THE FIX IS HERE */}
          {viewMode === 'CREATING' && (
            <div className="animate-in slide-in-from-right-4" style={{ 
              height: '100%', // HARD CODED 100%
              width: '100%', 
              overflow: 'hidden', // PREVENTS PUSHING
              display: 'flex',    // ENSURES CHILD FILLS SPACE
              flexDirection: 'column'
            }}>
              <SchedulerWizard 
                draft={wizardData} 
                onClose={handleCloseRightPanel} 
              />
            </div>
          )}

          {/* DETAIL STATE */}
          {viewMode === 'VIEWING' && selectedScheduleId && (
            <div className="animate-in slide-in-from-right-4" style={{ height: '100%', overflow: 'hidden' }}>
              <ScheduleDetail 
                id={selectedScheduleId} 
                onClose={handleCloseRightPanel}
                onEdit={handleEditSchedule}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SchedulerModule;