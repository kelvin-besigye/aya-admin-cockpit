import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader, X, AlertTriangle } from 'lucide-react';

/**
 * ACTION BAR (The Trigger)
 * ------------------------------------------------------------------
 * The decision control surface.
 * * * FEATURES:
 * 1. SAFETY MODE: 'Reject' requires a reason input.
 * 2. LOADING STATES: Prevents double-clicks.
 * 3. VISUAL HIERARCHY: Success (Right) vs Danger (Left).
 */

const ActionBar = ({ onApprove, onReject, isProcessing }) => {
  
  // 1. STATE: REJECTION MODE
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // 2. HANDLER: CONFIRM REJECT
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    onReject(rejectReason);
    // Reset local state handled by parent unmount usually, but good practice:
    // setIsRejecting(false); 
  };

  // --- RENDER: REJECTION INPUT MODE ---
  if (isRejecting) {
    return (
      <div style={{ 
        padding: '24px', background: 'var(--bg-surface)', borderTop: '1px solid var(--status-danger)',
        animation: 'slideUp 0.2s ease', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--status-danger)' }}>
          <AlertTriangle size={16} />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Reason for Rejection</span>
        </div>
        
        <textarea 
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. The TIN number provided does not match the scanned document..."
          disabled={isProcessing}
          style={{ 
            width: '100%', height: '80px', padding: '12px', borderRadius: '8px', 
            border: '1px solid var(--border-subtle)', background: 'var(--bg-input)',
            fontSize: '13px', resize: 'none', marginBottom: '16px', outline: 'none'
          }}
          autoFocus
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={() => setIsRejecting(false)}
            disabled={isProcessing}
            className="citadel-btn citadel-btn-ghost"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmReject}
            disabled={isProcessing}
            className="citadel-btn"
            style={{ background: 'var(--status-danger)', color: 'white', border: 'none' }}
          >
            {isProcessing ? <Loader className="animate-spin" size={16} /> : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: DEFAULT MODE ---
  return (
    <div style={{ 
      padding: '24px 32px', 
      borderTop: '1px solid var(--border-subtle)', 
      background: 'var(--bg-surface)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
    }}>
      
      {/* LEFT: REJECT */}
      <button 
        onClick={() => setIsRejecting(true)}
        disabled={isProcessing}
        style={{ 
          background: 'transparent', border: '1px solid var(--status-danger)', 
          color: 'var(--status-danger)', padding: '12px 24px', borderRadius: '8px',
          fontSize: '13px', fontWeight: '700', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          opacity: isProcessing ? 0.5 : 1, transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <XCircle size={18} />
        Reject Application
      </button>

      {/* RIGHT: APPROVE */}
      <button 
        onClick={onApprove}
        disabled={isProcessing}
        style={{ 
          background: 'var(--status-success)', border: 'none', 
          color: 'white', padding: '12px 32px', borderRadius: '8px',
          fontSize: '13px', fontWeight: '700', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
          opacity: isProcessing ? 0.7 : 1, transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {isProcessing ? (
          <>
            <Loader className="animate-spin" size={18} /> Processing...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} /> Approve & Activate
          </>
        )}
      </button>

    </div>
  );
};

export default ActionBar;