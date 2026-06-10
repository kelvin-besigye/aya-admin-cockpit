import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { approvalsService } from '../../data/approvals.service';

// SUB-COMPONENTS
import VerifyPartner from './VerifyPartner';
import VerifyBus from './VerifyBus';
import VerifyRoute from './VerifyRoute';
import VerifySchedule from './VerifySchedule';
import VerifyRefund from './VerifyRefund'; // NEW: The Financial Ledger Viewer
import ActionBar from './ActionBar';

/**
 * 👑 AYABUS INSPECTOR CONTAINER (Sovereign Edition)
 * ------------------------------------------------------------------
 * The Master Router for the Right-Panel work area.
 * * * UPGRADES:
 * 1. RECONCILIATION ROUTING: Maps 'REFUND' types to the 'approvals' table.
 * 2. DYNAMIC THEMING: Header badge shifts to Red for financial payloads.
 * 3. GLOBAL SYNC: Dispatches 'citadel-reconciliation-update' upon success.
 */

const InspectorContainer = ({ selectedTask, onClearSelection }) => {
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [outcome, setOutcome] = useState(null);

  const handleDecision = async (decision, reason = '') => {
    setIsProcessing(true);
    try {
      let result;
      
      // A. DETERMINE TARGET TABLE (The Router)
      let table = '';
      if (selectedTask.type === 'PARTNER') table = 'partners';
      if (selectedTask.type === 'VEHICLE') table = 'bus_configs';
      if (selectedTask.type === 'ROUTE') table = 'routes';
      if (selectedTask.type === 'SCHEDULE') table = 'route_schedules'; 
      if (selectedTask.type === 'REFUND') table = 'approvals'; // NEW: Financial Payload Routing

      if (!table) throw new Error("Unknown Task Type");

      // B. EXECUTE SMART SERVICE
      if (decision === 'APPROVE') {
        result = await approvalsService.approveEntity(table, selectedTask.id);
      } else {
        result = await approvalsService.rejectEntity(table, selectedTask.id, reason);
      }

      // C. HANDLE SUCCESS & SYNC
      if (result.success) {
        setOutcome('SUCCESS');
        setTimeout(() => {
          // 1. Clear the Inbox
          window.dispatchEvent(new Event('citadel-approvals-refresh')); 
          
          // 2. Sync specific remote modules
          if (table === 'bus_configs') window.dispatchEvent(new Event('citadel-bus-update'));
          if (table === 'partners') window.dispatchEvent(new Event('citadel-fleet-update'));
          if (table === 'routes') window.dispatchEvent(new Event('citadel-routes-update'));
          if (table === 'route_schedules') window.dispatchEvent(new Event('citadel-schedules-update'));
          if (table === 'approvals') window.dispatchEvent(new Event('citadel-reconciliation-update')); // NEW
          
          onClearSelection();
          setOutcome(null);
        }, 1500);
      } else {
        alert(`Action Failed: ${result.error}`);
        setOutcome('ERROR');
      }

    } catch (err) {
      console.error("Decision Error", err);
      alert("System Error: Could not commit decision.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ========================================================================
  // EMPTY / SUCCESS STATES
  // ========================================================================
  if (!selectedTask) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <ShieldCheck size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
        <div style={{ fontSize: '14px', fontWeight: '600' }}>Select an item from the queue</div>
      </div>
    );
  }
  
  if (outcome === 'SUCCESS') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)' }}>
        <CheckCircle2 size={64} color="var(--status-success)" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}/>
        <h2 style={{ marginTop: '16px', color: 'var(--text-main)', fontSize: '20px', fontWeight: '800' }}>Decision Logged</h2>
      </div>
    );
  }

  // ========================================================================
  // DYNAMIC STYLING (Financial vs Operational)
  // ========================================================================
  const isRefund = selectedTask.type === 'REFUND';
  const badgeColor = isRefund ? 'var(--status-danger)' : 'var(--brand-primary)';
  const badgeLabel = isRefund ? 'FINANCIAL AUTHORIZATION' : `${selectedTask.type} VERIFICATION`;

  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr auto', height: '100%', overflow: 'hidden', background: 'var(--bg-surface)' }}>
      
      <div className="citadel-scroll-area" style={{ padding: '32px' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
          <span style={{ 
            fontSize: '11px', fontWeight: '800', 
            background: badgeColor, color: 'white', 
            padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' 
          }}>
            {badgeLabel}
          </span>
          <h1 className="text-heading" style={{ fontSize: '24px', margin: '8px 0 0 0', letterSpacing: '-0.5px' }}>
            {selectedTask.label}
          </h1>
        </div>

        {/* COMPONENT ROUTER */}
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {selectedTask.type === 'PARTNER' && <VerifyPartner data={selectedTask.data} />}
          {selectedTask.type === 'VEHICLE' && <VerifyBus data={selectedTask.data} />}
          {selectedTask.type === 'ROUTE' && <VerifyRoute data={selectedTask.data} />}
          {selectedTask.type === 'SCHEDULE' && <VerifySchedule data={selectedTask.data} />}
          {selectedTask.type === 'REFUND' && <VerifyRefund data={selectedTask.data} />} {/* NEW */}
        </div>
      </div>

      <ActionBar 
        onApprove={() => handleDecision('APPROVE')} 
        onReject={(r) => handleDecision('REJECT', r)} 
        isProcessing={isProcessing} 
      />
      
      <style>{`
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default InspectorContainer;