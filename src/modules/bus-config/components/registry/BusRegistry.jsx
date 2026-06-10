import React, { useEffect, useState, useMemo } from 'react';
import { Bus, AlertCircle, RefreshCw } from 'lucide-react';
import { busService } from '../../data/bus.service';

// SUB-COMPONENTS
import RegistryHeader from './RegistryHeader';
import CompanyGroup from './CompanyGroup';

/**
 * BUS REGISTRY LIST (The Controller)
 * ------------------------------------------------------------------
 * Manages the display of the bus fleet.
 * * * WORLD CLASS UPDATES:
 * 1. EVENT LISTENER: Now listens for 'citadel-bus-update' (The "Go Live" signal).
 * 2. REFRESH LOGIC: Automatically reloads when a manager approves a bus.
 */

const BusRegistry = ({ onSelectConfig }) => {
  
  // 1. STATE MANAGEMENT
  const [rawConfigs, setRawConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 2. FETCH DATA
  const loadRegistry = async () => {
    try {
      setLoading(true);
      // Fetches ONLY 'ACTIVE' buses (Thanks to the Service update)
      const data = await busService.fetchBusConfigs();
      setRawConfigs(data || []);
      setError(null);
    } catch (err) {
      console.error("Bus Registry Load Error:", err);
      setError("Could not synchronize with Bus Database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  // 3. LISTEN FOR UPDATES (The Fix)
  // We now listen for the "Official Update" event, not the "Draft" event.
  useEffect(() => {
    const handleUpdate = () => {
      console.log("Registry: Detected update, refreshing...");
      loadRegistry();
    };

    // Listen for Approval Actions AND Wizard Updates
    window.addEventListener('citadel-bus-update', handleUpdate);
    
    return () => window.removeEventListener('citadel-bus-update', handleUpdate);
  }, []);

  // 4. THE GROUPER ENGINE (Memoized)
  const groupedData = useMemo(() => {
    
    // A. Filter
    const filtered = rawConfigs.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchCompany = item.partners?.company_name?.toLowerCase().includes(q);
      const matchModel = item.model_name?.toLowerCase().includes(q);
      const matchClass = item.bus_class?.toLowerCase().includes(q);
      return matchCompany || matchModel || matchClass;
    });

    // B. Group by Partner ID
    const groups = {};
    filtered.forEach(config => {
      if (!config.partners) return;
      const pId = config.partner_id;
      
      if (!groups[pId]) {
        groups[pId] = {
          partner: config.partners, 
          configs: []
        };
      }
      groups[pId].configs.push(config);
    });

    return Object.values(groups);

  }, [rawConfigs, searchQuery]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
      
      {/* A. HEADER */}
      <RegistryHeader 
        totalAssets={rawConfigs.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* B. SCROLLABLE BODY */}
      <div className="citadel-scroll-area" style={{ flex: 1, padding: '20px', paddingBottom: '100px' }}>
        
        {/* STATE 1: LOADING */}
        {loading && rawConfigs.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>
            <Bus className="animate-pulse" size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>LOADING LIVE FLEET...</p>
          </div>
        )}

        {/* STATE 2: ERROR */}
        {!loading && error && (
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--status-error)', borderRadius: '8px', color: 'var(--status-error)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
            <AlertCircle size={18} /> {error}
            <button onClick={loadRegistry} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontWeight: '700' }}>RETRY</button>
          </div>
        )}

        {/* STATE 3: EMPTY (No Results) */}
        {!loading && !error && groupedData.length === 0 && (
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '50%', marginBottom: '16px' }}>
              <Bus size={32} color="var(--text-muted)" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>NO ACTIVE BUSES</p>
            <p style={{ fontSize: '12px', textAlign: 'center', maxWidth: '250px', lineHeight: '1.5' }}>
              New configurations must be approved in the <strong>Approvals Module</strong> before they appear here.
            </p>
          </div>
        )}

        {/* STATE 4: THE ACCORDION LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {groupedData.map((group) => (
            <CompanyGroup 
              key={group.partner.id} 
              partner={group.partner}
              configs={group.configs}
              onSelectConfig={onSelectConfig}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default BusRegistry;