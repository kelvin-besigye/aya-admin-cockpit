import React from 'react';
import { ONBOARDING_STEPS } from '../../data/fleet.constants';

/**
 * WIZARD PROGRESS COMPONENT
 * The visual indicator of where the user is in the registration flow.
 * "Twice as Good" Rule:
 * - Pure dumb component (UI only).
 * - Animates the transition between steps.
 */

const WizardProgress = ({ currentStep }) => {
  return (
    <div style={{ width: '100%', background: 'var(--bg-muted)', display: 'flex', height: '4px' }}>
      {ONBOARDING_STEPS.map((step) => {
        const isActive = step.id <= currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <div 
            key={step.id} 
            style={{ 
              flex: 1,
              position: 'relative',
              background: isActive ? 'var(--brand-main)' : 'transparent',
              opacity: isActive ? 1 : 0.3,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              // Add a subtle glow to the active tip
              boxShadow: isCurrent ? '0 0 10px var(--brand-main)' : 'none',
              zIndex: isCurrent ? 1 : 0
            }} 
            title={step.label}
          />
        );
      })}
    </div>
  );
};

export default WizardProgress;