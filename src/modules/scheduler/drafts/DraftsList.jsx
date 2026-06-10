import React, { useEffect, useState } from 'react';
import { 
  Layers, Clock, Trash2, ArrowRight, Plus, FileText, 
  CalendarClock, Zap, LayoutGrid, ChevronRight, Loader
} from 'lucide-react';
import { schedulerService } from '../data/scheduler.service';

/**
 * ELITE DRAFTS DASHBOARD (The WIP Engine)
 * ------------------------------------------------------------------
 * Rebuilt to 4x Expedia standards.
 * * * FEATURES:
 * 1. PRIMARY ACTION HUB: Features the large "Automate Route" trigger.
 * 2. LIVE FEED: Real-time synchronization with the Wizard.
 * 3. TACTILE CARDS: Uses high-fidelity hover states and brand logic.
 */

const DraftsList = ({ onResume }) => {
  
  // 1. DATA STATE
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. DATA SYNC
  const fetchDrafts = async () => {
    try {
      const data = await schedulerService.fetchDrafts();
      setDrafts(data || []);
    } catch (err) {
      console.error("Drafts Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
    
    // Subscribe to Global Citadel Update Events
    const handleUpdate = () => fetchDrafts();
    window.addEventListener('citadel-draft-update', handleUpdate);
    
    return () => window.removeEventListener('citadel-draft-update', handleUpdate);
  }, []);

  // 3. HANDLERS
  const handleDeleteDraft = async (e, id) => {
    e.stopPropagation(); // Avoid resuming while trying to delete
    if (!window.confirm("Permanently discard this automation draft?")) return;
    
    try {
      await schedulerService.deleteDraft(id);
      fetchDrafts(); // Refresh local state
    } catch (err) {
      alert("Failed to delete draft.");
    }
  };

  const handleCreateNew = () => {
    onResume(null); // Passing null tells the Wizard to start a fresh CREATE session
  };

  // 4. RENDERERS
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      background: 'var(--bg-canvas)',
      borderLeft: '1px solid var(--border-subtle)'
    }}>
      
      {/* SECTION 1: THE PRIMARY HUB (The Big Action) */}
      <div style={{ padding: '32px 24px', background: 'white', borderBottom: '1px solid var(--border-subtle)' }}>
        <button 
          onClick={handleCreateNew}
          className="citadel-card group"
          style={{ 
            width: '100%', 
            padding: '32px 20px', 
            cursor: 'pointer',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            gap: '16px',
            border: '2px dashed var(--border-subtle)',
            background: 'var(--bg-surface)',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.background = 'var(--bg-surface)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'var(--brand-primary)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 24px -6px rgba(59, 130, 246, 0.5)'
          }}>
            <Plus size={32} color="white" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-heading" style={{ fontSize: '15px', marginBottom: '4px' }}>AUTOMATE ROUTE</h3>
            <p className="text-muted" style={{ fontSize: '12px', fontWeight: '600' }}>Build a new recurring schedule</p>
          </div>

          {/* Decorative Corner Icon */}
          <Zap size={40} style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.03, transform: 'rotate(15deg)' }} />
        </button>
      </div>

      {/* SECTION 2: THE WIP FEED (Drafts) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* WIP Header */}
        <div style={{ padding: '24px 24px 12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={14} className="text-muted" />
            <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Pending Configuration ({drafts.length})
            </span>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="citadel-scroll-area" style={{ flex: 1, padding: '0 24px 40px 24px' }}>
          
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <Loader className="animate-spin text-muted" size={20} style={{ margin: '0 auto' }} />
            </div>
          ) : drafts.length === 0 ? (
            <div style={{ 
              padding: '48px 24px', 
              textAlign: 'center', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '16px', 
              background: 'var(--bg-surface)',
              marginTop: '12px'
            }}>
              <LayoutGrid size={32} style={{ margin: '0 auto 16px', opacity: 0.1 }} />
              <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>No active drafts</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.6, marginTop: '4px' }}>Started work will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {drafts.map((draft) => (
                <div 
                  key={draft.id}
                  onClick={() => onResume(draft)}
                  className="citadel-card"
                  style={{ 
                    padding: '16px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    borderLeft: `3px solid ${draft.step_number === 2 ? '#7C3AED' : 'var(--brand-primary)'}`,
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                >
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '10px', 
                    background: 'var(--bg-canvas)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' 
                  }}>
                    <FileText size={18} />
                  </div>
                  
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ 
                      fontSize: '13px', fontWeight: '800', color: 'var(--text-main)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {draft.label || 'Unsaved Schedule'}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase' }}>
                      Step {draft.step_number} • {new Date(draft.last_updated || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions Layer */}
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => handleDeleteDraft(e, draft.id)}
                      style={{ 
                        background: 'none', border: 'none', color: 'var(--text-muted)', 
                        cursor: 'pointer', padding: '6px', borderRadius: '6px' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-muted" style={{ opacity: 0.4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DraftsList;