import React from 'react';
import { Inbox, Users, Bus, Map, CalendarClock, Scale } from 'lucide-react';

/**
 * 👑 AYABUS INBOX HEADER (Sovereign Edition)
 * ------------------------------------------------------------------
 * Controls the view of the Pending Approval Queue.
 * * * UPGRADES:
 * 1. RECONCILIATION INTEGRATION: Added the 'Refunds' (Scale) tab to 
 * monitor pending financial clawbacks and customer payouts.
 * 2. FLUID SCROLL: Maintains the 'overflow-x' design to prevent tab-squishing.
 */

const InboxHeader = ({ 
  activeTab = 'PARTNERS', 
  onTabChange, 
  // Added REFUNDS to the default counts object
  counts = { PARTNERS: 0, VEHICLES: 0, ROUTES: 0, SCHEDULES: 0, REFUNDS: 0 } 
}) => {
  
  // The Master Dictionary of Inbox Tabs
  const TABS = [
    { id: 'PARTNERS', label: 'Partners', icon: Users, count: counts.PARTNERS },
    { id: 'VEHICLES', label: 'Vehicles', icon: Bus, count: counts.VEHICLES },
    { id: 'ROUTES', label: 'Routes', icon: Map, count: counts.ROUTES },
    { id: 'SCHEDULES', label: 'Schedules', icon: CalendarClock, count: counts.SCHEDULES },
    { id: 'REFUNDS', label: 'Refunds', icon: Scale, count: counts.REFUNDS } // NEW: Financial Queue
  ];

  // Dynamically aggregates all pending tasks across the entire module
  const totalTasks = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ 
      padding: '20px 0 0 0', 
      borderBottom: '1px solid var(--border-subtle)', 
      background: 'var(--bg-surface)',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      flexShrink: 0
    }}>
      
      {/* =========================================================
          1. TITLE & GLOBAL COUNTER
          ========================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <h2 className="text-heading" style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
          <Inbox size={20} color="var(--brand-primary)" />
          Approvals Inbox
        </h2>
        
        {/* Dynamic Warning Pill (Turns green if inbox is zero) */}
        <div style={{ 
          fontSize: '11px', fontWeight: '800', 
          background: totalTasks > 0 ? 'var(--status-warning)' : 'var(--status-success)', 
          color: totalTasks > 0 ? 'black' : 'white',
          padding: '4px 10px', borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}>
          {totalTasks} PENDING
        </div>
      </div>

      {/* =========================================================
          2. SCROLLABLE TAB NAVIGATION
          ========================================================= */}
      <div 
        className="citadel-hide-scrollbar" 
        style={{ 
          display: 'flex', 
          gap: '24px', 
          position: 'relative',
          overflowX: 'auto', 
          whiteSpace: 'nowrap', 
          padding: '0 24px', 
          scrollBehavior: 'smooth'
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 0 12px 0', position: 'relative',
                display: 'flex', alignItems: 'center', gap: '8px',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                transition: 'color 0.2s ease',
                flexShrink: 0 // Prevents the flexbox from compressing the buttons
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: '13px', fontWeight: isActive ? '900' : '600' }}>
                {tab.label}
              </span>
              
              {/* Individual Tab Counter (Only shows if > 0) */}
              {tab.count > 0 && (
                <span style={{ 
                  fontSize: '10px', fontWeight: '800',
                  background: isActive ? 'var(--brand-primary)' : 'var(--bg-input)',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  padding: '2px 6px', borderRadius: '8px', minWidth: '18px', textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  {tab.count}
                </span>
              )}

              {/* Active Underline Indicator */}
              {isActive && (
                <div style={{ 
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', 
                  background: 'var(--brand-primary)', borderRadius: '3px 3px 0 0',
                  boxShadow: '0 -2px 6px rgba(59, 130, 246, 0.4)',
                  animation: 'slideUp 0.2s ease-out'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* INJECTED CSS: Hides the ugly native scrollbar while retaining scroll function */}
      <style>{`
        .citadel-hide-scrollbar::-webkit-scrollbar { display: none; }
        .citadel-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { transform: translateY(2px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

    </div>
  );
};

export default InboxHeader;