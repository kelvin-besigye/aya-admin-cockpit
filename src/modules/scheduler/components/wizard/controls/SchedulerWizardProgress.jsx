import React from 'react';
import { Check, MapPin, CalendarClock, Zap } from 'lucide-react';

/**
 * SCHEDULER WIZARD PROGRESS (The Tactile Engine)
 * ------------------------------------------------------------------
 * A high-fidelity, standalone progress tracker.
 * * * ELITE FEATURES:
 * 1. STEP SLOTS: Visualized with distinct icons (MapPin for route, Clock for frequency).
 * 2. DYNAMIC PHYSICS: Transitions between "Active", "Complete", and "Pending" states.
 * 3. SUB-TEXT: Provides instant context for what each step achieves.
 */

const SchedulerWizardProgress = ({ currentStep = 1 }) => {
  
  const STEPS = [
    { 
      id: 1, 
      label: 'Route Selection', 
      desc: 'Target Operator & Path', 
      icon: MapPin 
    },
    { 
      id: 2, 
      label: 'Automation Rhythm', 
      desc: 'Frequency & Logic', 
      icon: CalendarClock 
    }
  ];

  return (
    <div style={{ 
      padding: '24px 32px', 
      background: 'white', 
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px'
    }}>
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            {/* THE STEP MODULE */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              opacity: isActive || isCompleted ? 1 : 0.4,
              transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}>
              {/* CIRCLE ICON */}
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: isCompleted ? 'var(--status-success)' : (isActive ? 'var(--brand-primary)' : 'var(--bg-input)'),
                color: (isActive || isCompleted) ? 'white' : 'var(--text-muted)',
                boxShadow: isActive ? '0 8px 16px -4px rgba(59, 130, 246, 0.4)' : 'none',
                transition: 'all 0.5s ease'
              }}>
                {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                
                {/* ACTIVE GLOW BEACON */}
                {isActive && (
                  <div style={{ 
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '16px',
                    border: '2px solid var(--brand-primary)',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </div>

              {/* LABEL BLOCK */}
              <div>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: '900', 
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-main)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {step.label}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  color: 'var(--text-muted)',
                  marginTop: '1px'
                }}>
                  {step.desc}
                </div>
              </div>
            </div>

            {/* THE CONNECTOR LINE */}
            {index < STEPS.length - 1 && (
              <div style={{ 
                width: '60px', 
                height: '2px', 
                background: isCompleted ? 'var(--status-success)' : 'var(--border-subtle)',
                borderRadius: '1px',
                margin: '0 8px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {isActive && (
                  <div style={{ 
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--brand-primary)',
                    animation: 'slideProgress 2s infinite linear'
                  }} />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes slideProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SchedulerWizardProgress;