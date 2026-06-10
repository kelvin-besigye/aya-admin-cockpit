import React from 'react';
import { CONFIG_WIZARD_STEPS } from '../../data/bus.constants';

/**
 * BUS WIZARD PROGRESS
 * ------------------------------------------------------------------
 * The visual "GPS" for the creation flow.
 * * * DESIGN NOTES:
 * 1. PURE UI: Receives 'currentStep' prop and renders the bar.
 * 2. CONSISTENCY: Matches the Fleet Module's progress style exactly.
 * 3. DYNAMIC: Reads steps from 'bus.constants.js' to avoid hardcoding.
 */

const BusWizardProgress = ({ currentStep }) => {
  return (
    <div style={{ width: '100%', background: 'var(--bg-muted)', display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
      {CONFIG_WIZARD_STEPS.map((step) => {
        // Logic: Is this step finished or currently active?
        const isActive = step.id <= currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div 
            key={step.id} 
            style={{ 
              flex: 1,
              position: 'relative',
              // Use brand-primary to match the rest of the Bus Module styles
              background: isActive ? 'var(--brand-primary)' : 'transparent',
              opacity: isActive ? 1 : 0.2,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              // The "Glow" effect for the current step
              boxShadow: isCurrent ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
              zIndex: isCurrent ? 1 : 0
            }} 
            title={`${step.label}: ${step.description}`}
          />
        );
      })}
    </div>
  );
};

export default BusWizardProgress;