import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, Inbox } from 'lucide-react';
import { approvalsService } from '../../data/approvals.service';

// SUB-COMPONENTS
import InboxHeader from './InboxHeader';
import ApprovalCard from './ApprovalCard';

/**
 * 👑 AYABUS APPROVAL LIST (Sovereign Edition)
 * ------------------------------------------------------------------
 * Manages the "To-Do" Queue for the Admin.
 * * * UPGRADES:
 * 1. RECONCILIATION INTEGRATION: Added `fetchPendingRefunds` to the 
 * parallel execution block to stream financial clawbacks into the queue.
 * 2. FAULT TOLERANCE: Uses Promise.allSettled so that if one module 
 * (like Treasury) is down, the others (like Fleet) still load perfectly.
 */

const ApprovalList = ({ onSelectItem, selectedId }) => {
  
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('PARTNERS');

  // ========================================================================
  // CORE DATA ENGINE
  // ========================================================================
  const loadInbox = async () => {
    try {
      setLoading(true);
      setError(null);

      // A. EXECUTE PARALLEL FETCH (Safety Mode)
      // Retrieves all data streams simultaneously. 
      const results = await Promise.allSettled([
        approvalsService.fetchPendingPartners(),
        approvalsService.fetchPendingBuses(),
        approvalsService.fetchPendingRoutes(),
        approvalsService.fetchPendingSchedules(),
        approvalsService.fetchPendingRefunds() // NEW: Financial Payloads
      ]);

      // B. UNPACK RESULTS
      const [partnersRes, busesRes, routesRes, schedulesRes, refundsRes] = results;

      // C. ISOLATION LOGGING (For Debugging, doesn't crash the UI)
      if (partnersRes.status === 'rejected') console.error("❌ Partners Offline:", partnersRes.reason);
      if (busesRes.status === 'rejected') console.warn("⚠️ Vehicles Offline:", busesRes.reason);
      if (routesRes.status === 'rejected') console.warn("⚠️ Routes Offline:", routesRes.reason);
      if (schedulesRes.status === 'rejected') console.warn("⚠️ Schedules Offline:", schedulesRes.reason);
      if (refundsRes.status === 'rejected') console.error("❌ Treasury Offline:", refundsRes.reason); // NEW

      // D. MERGE SUCCESSFUL STREAMS
      const allTasks = [
        ...(partnersRes.status === 'fulfilled' ? partnersRes.value : []),
        ...(busesRes.status === 'fulfilled' ? busesRes.value : []),
        ...(routesRes.status === 'fulfilled' ? routesRes.value : []),
        ...(schedulesRes.status === 'fulfilled' ? schedulesRes.value : []),
        ...(refundsRes.status === 'fulfilled' ? refundsRes.value : []) // NEW
      ];
      
      // E. CRITICAL FAILURE CHECK
      // If EVERYTHING failed, then throw a global error to the user
      if (results.every(r => r.status === 'rejected')) {
        throw new Error("All database services are currently unreachable.");
      }

      // F. SORT BY URGENCY (Oldest requests at the top)
      allTasks.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

      setTasks(allTasks);

    } catch (err) {
      console.error("Inbox Critical Failure:", err);
      setError("System outage. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // LIFECYCLE & EVENT LISTENERS
  // ========================================================================
  useEffect(() => {
    loadInbox();
    const handleRefresh = () => loadInbox();
    // Listens for successful actions in the Inspector to clear the queue
    window.addEventListener('citadel-approvals-refresh', handleRefresh);
    return () => window.removeEventListener('citadel-approvals-refresh', handleRefresh);
  }, []);

  // ========================================================================
  // DYNAMIC COUNTERS & ROUTERS
  // ========================================================================
  const counts = useMemo(() => ({
    PARTNERS: tasks.filter(t => t.type === 'PARTNER').length,
    VEHICLES: tasks.filter(t => t.type === 'VEHICLE').length,
    ROUTES: tasks.filter(t => t.type === 'ROUTE').length,
    SCHEDULES: tasks.filter(t => t.type === 'SCHEDULE').length,
    REFUNDS: tasks.filter(t => t.type === 'REFUND').length, // NEW
  }), [tasks]);

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'PARTNERS') return t.type === 'PARTNER';
    if (activeTab === 'VEHICLES') return t.type === 'VEHICLE';
    if (activeTab === 'ROUTES') return t.type === 'ROUTE';
    if (activeTab === 'SCHEDULES') return t.type === 'SCHEDULE';
    if (activeTab === 'REFUNDS') return t.type === 'REFUND'; // NEW
    return false;
  });

  // ========================================================================
  // RENDER UI
  // ========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
      
      {/* 1. SCROLLABLE TABS */}
      <InboxHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        counts={counts}
      />

      {/* 2. THE QUEUE AREA */}
      <div className="citadel-scroll-area" style={{ flex: 1, padding: '20px', paddingBottom: '100px' }}>
        
        {/* STATE A: LOADING SKELETON */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '80px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: 0.6 }} className="animate-pulse" />
            ))}
          </div>
        )}

        {/* STATE B: ERROR BLOCK */}
        {!loading && error && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--status-danger)' }}>
            <AlertCircle size={24} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '13px', fontWeight: '700' }}>{error}</div>
            <button onClick={loadInbox} style={{ marginTop: '12px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}>Retry Sync</button>
          </div>
        )}

        {/* STATE C: EMPTY INBOX */}
        {!loading && !error && filteredTasks.length === 0 && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px dashed var(--border-subtle)' }}>
              <Inbox size={32} color="var(--text-muted)" style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{ margin: '0', fontSize: '16px', color: 'var(--text-main)' }}>Queue is Clear</h3>
            <p style={{ fontSize: '12px', maxWidth: '200px', textAlign: 'center', marginTop: '8px' }}>
              There are no pending actions in this category.
            </p>
            <button 
              onClick={loadInbox}
              style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-main)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            >
              <RefreshCw size={12} /> Force Sync
            </button>
          </div>
        )}

        {/* STATE D: THE TASK CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTasks.map((task) => (
            <ApprovalCard 
              key={`${task.type}-${task.id}`} 
              item={task} 
              isSelected={selectedId === task.id}
              onClick={() => onSelectItem(task)} 
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ApprovalList;