import React, { useEffect, useState, useMemo } from 'react';
import { Loader, AlertCircle, Inbox, Clock, Calendar, ArrowUpDown, Zap, Activity } from 'lucide-react';
import { schedulerService } from '../../data/scheduler.service';
import RegistryHeader from './RegistryHeader';
import ScheduleCard from './ScheduleCard';

/**
 * ELITE SCHEDULER REGISTRY (High-Density Tabular Edition)
 * ------------------------------------------------------------------
 * Rebuilt to 4x Expedia standards with structural precision.
 */

const SchedulerRegistry = ({ onSelect, selectedId }) => {
  
  // 1. STATE MANAGEMENT
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. FILTER & SORT STATE
  const [filter, setFilter] = useState({ type: 'ALL' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('CREATED_DESC');

  // 3. DATA ENGINE
  const fetchData = async () => {
    try {
      if (schedules.length === 0) setLoading(true);
      const data = await schedulerService.fetchSchedules();
      setSchedules(data || []);
      setError(null);
    } catch (err) {
      console.error("Network Sync Error:", err);
      setError("Network Synchronization Failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleUpdate = () => fetchData();
    window.addEventListener('citadel-schedules-update', handleUpdate);
    return () => window.removeEventListener('citadel-schedules-update', handleUpdate);
  }, []);

  // 4. ELITE FILTER ENGINE (Memoized)
  const filteredData = useMemo(() => {
    return schedules
      .filter(item => {
        // A. Frequency Axis
        if (filter.type !== 'ALL') {
          if (filter.type === 'CUSTOM_GROUP') {
            if (!['CUSTOM', 'SUPER_CUSTOM'].includes(item.frequency_type)) return false;
          } else if (item.frequency_type !== filter.type) return false;
        }
        // B. Search Axis (Origin or Destination)
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const route = item.route || {};
          return route.origin_city?.toLowerCase().includes(q) || route.destination_city?.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        // C. Sort Axis Logic
        const routeA = a.route || {};
        const routeB = b.route || {};
        if (sortOrder.includes('DEPARTURE')) {
          const val = (routeA.departure_time || '').localeCompare(routeB.departure_time || '');
          return sortOrder === 'DEPARTURE_ASC' ? val : -val;
        }
        const dateVal = new Date(b.created_at) - new Date(a.created_at);
        return sortOrder === 'CREATED_DESC' ? dateVal : -dateVal;
      });
  }, [schedules, filter, searchQuery, sortOrder]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
      
      {/* A. COMMAND BAR (Registry Header) */}
      <RegistryHeader 
        filter={filter} 
        setFilter={setFilter}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder} 
        setSortOrder={setSortOrder}
      />

      {/* B. THE GRID CAPTION (Tabular Header Labels) */}
      <div style={{ 
        padding: '16px 32px', 
        display: 'grid', 
        gridTemplateColumns: '1.8fr 1.2fr 1.2fr 0.6fr', 
        gap: '24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        zIndex: 5
      }}>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={12} /> Route Definition
        </span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Frequency Logic</span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule & Class</span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Operational Status</span>
      </div>
      
      {/* C. THE SCROLLABLE LIST */}
      <div className="citadel-scroll-area" style={{ flex: 1, padding: '16px 24px 100px 24px' }}>
        
        {loading && schedules.length === 0 && (
          <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader className="animate-spin" size={32} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <p style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '1px' }}>SYNCING NETWORK...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <AlertCircle size={48} className="text-red-500" style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Connection Failed</p>
            <button onClick={fetchData} className="citadel-btn-ghost" style={{ marginTop: '16px', color: 'var(--brand-primary)' }}>Retry Sync</button>
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Inbox size={56} style={{ marginBottom: '24px', opacity: 0.05 }} />
            <p style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>No Active Automations</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Refine your command search or build a new schedule.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredData.map(item => (
            <ScheduleCard 
              key={item.id} 
              schedule={item} 
              isSelected={selectedId === item.id}
              onClick={() => onSelect(item.id)} 
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default SchedulerRegistry;