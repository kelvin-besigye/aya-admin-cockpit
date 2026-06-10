import React, { useState } from 'react';

// IMPORT SUB-COMPONENTS
import ApprovalList from './components/inbox/ApprovalList';
import InspectorContainer from './components/inspector/InspectorContainer';

/**
 * APPROVALS MODULE (The Entry Point)
 * ------------------------------------------------------------------
 * The specialized workspace for vetting pending entities.
 * * * LAYOUT:
 * - LEFT PANEL (380px): The "Inbox" queue.
 * - RIGHT PANEL (Flex): The "Inspector" work area.
 */

const ApprovalsModule = () => {
  
  // 1. STATE: SELECTION
  // Tracks which task is currently on the "operating table"
  const [selectedTask, setSelectedTask] = useState(null);

  // 2. HANDLER: OPEN TASK
  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  // 3. HANDLER: CLEAR WORKSPACE
  // Called when a decision is made (Approve/Reject) or user cancels
  const handleClearSelection = () => {
    setSelectedTask(null);
  };

  return (
    <div className="citadel-viewport" style={{ height: '100%', width: '100%' }}>
      
      {/* LAYOUT GRID 
         We use a fixed width for the list to ensure readability of cards,
         while the inspector takes all remaining space.
      */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '380px 1fr', 
        height: '100%', 
        overflow: 'hidden' 
      }}>
        
        {/* === LEFT PANEL: INBOX === */}
        <div style={{ 
          borderRight: '1px solid var(--border-subtle)', 
          background: 'var(--bg-canvas)',
          overflow: 'hidden',
          zIndex: 2 
        }}>
          <ApprovalList 
            onSelectItem={handleSelectTask} 
            selectedId={selectedTask?.id} 
          />
        </div>

        {/* === RIGHT PANEL: INSPECTOR === */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          position: 'relative', 
          overflow: 'hidden',
          zIndex: 1
        }}>
          <InspectorContainer 
            selectedTask={selectedTask} 
            onClearSelection={handleClearSelection} 
          />
        </div>

      </div>
    </div>
  );
};

export default ApprovalsModule;