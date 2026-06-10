import React from 'react';
import { Bus, MapPin, CreditCard, Clock, Check } from 'lucide-react';

/**
 * ROUTE WIZARD PROGRESS (The Navigator)
 * ------------------------------------------------------------------
 * Visual indicator for the 4-step creation process.
 * * * FEATURES:
 * 1. VISUAL CLARITY: Active step is bold/colored. Completed steps show checks.
 * 2. ICONOGRAPHY: Uses intuitive icons for each stage (Bus, Map, Money, Time).
 * 3. RESPONSIVE: Designed to fit cleanly in the wizard header.
 */

const STEPS = [
  { id: 1, label: 'Identity', icon: Bus },        // Partner & Class
  { id: 2, label: 'Geography', icon: MapPin },    // Origin, Dest, Park
  { id: 3, label: 'Financials', icon: CreditCard }, // Price & Tax
  { id: 4, label: 'Schedule', icon: Clock }       // Time & Duration
];

const RouteWizardProgress = ({ currentStep }) => {

  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '20px 40px', background: 'var(--bg-surface)', 
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      
      {/* PROGRESS TRACK (Background Line) */}
      <div style={{ 
        position: 'absolute', left: '60px', right: '60px', top: '45px', 
        height: '2px', background: 'var(--bg-input)', zIndex: 0 
      }}>
        {/* Active Progress Fill */}
        <div style={{ 
          height: '100%', background: 'var(--brand-primary)', transition: 'width 0.3s ease',
          width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` 
        }} />
      </div>

      {STEPS.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const Icon = isCompleted ? Check : step.icon;

        return (
          <div key={step.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            
            {/* THE CIRCLE INDICATOR */}
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isActive || isCompleted ? 'var(--brand-primary)' : 'var(--bg-surface)',
              border: isActive || isCompleted ? 'none' : '2px solid var(--border-subtle)',
              color: isActive || isCompleted ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none'
            }}>
              <Icon size={18} strokeWidth={isCompleted ? 3 : 2} />
            </div>

            {/* THE LABEL */}
            <span style={{ 
              fontSize: '12px', fontWeight: isActive ? '700' : '500', 
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
              transition: 'color 0.3s ease'
            }}>
              {step.label}
            </span>

          </div>
        );
      })}

    </div>
  );
};

export default RouteWizardProgress;