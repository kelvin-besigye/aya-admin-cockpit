import React, { useEffect, useState } from 'react';
import { Bus, AlertCircle } from 'lucide-react';
import { fleetService } from '../../data/fleet.service';

// IMPORT THE SUB-COMPONENTS (Inside Out Assembly)
import RegistryHeader from './RegistryHeader';
import RegistryCard from './RegistryCard';

/**
 * REGISTRY LIST CONTAINER
 * The "3/4 Screen" Master View.
 * * "Twice as Good" Rule:
 * - It is now an "Orchestrator". It fetches data and passes it down.
 * - It doesn't care about how a card looks (RegistryCard handles that).
 * - It doesn't care about how the search bar looks (RegistryHeader handles that).
 */

const RegistryList = ({ onSelectPartner }) => {
  
  // 1. STATE MANAGEMENT
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 2. FETCH DATA
  const loadRegistry = async () => {
    try {
      setLoading(true);
      const data = await fleetService.fetchPartners();
      setPartners(data || []);
    } catch (err) {
      console.error("Failed to load registry:", err);
      setError("Could not synchronize with Fleet Database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  // 3. FILTER LOGIC
  const filteredPartners = partners.filter(p => 
    p.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.partner_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* A. THE HEADER (Search & Stats) */}
      <RegistryHeader 
        totalAssets={partners.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* B. THE SCROLLABLE LIST AREA */}
      <div className="registryListArea">
        
        {/* STATE 1: LOADING */}
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            <Bus className="animate-pulse" size={24} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>SYNCHRONIZING FLEET DATA...</p>
          </div>
        )}

        {/* STATE 2: ERROR */}
        {!loading && error && (
          <div style={{ margin: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={16} /> {error}
            <button onClick={loadRegistry} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>RETRY</button>
          </div>
        )}

        {/* STATE 3: EMPTY */}
        {!loading && !error && filteredPartners.length === 0 && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '300px' }}>
            <Bus size={48} style={{ marginBottom: '10px', opacity: 0.1 }} />
            <p style={{ fontSize: '14px' }}>NO PARTNERS FOUND</p>
            <p style={{ fontSize: '11px' }}>Register a new fleet operator to begin.</p>
          </div>
        )}

        {/* STATE 4: THE CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredPartners.map((partner) => (
            <RegistryCard 
              key={partner.id} 
              partner={partner} 
              onClick={() => onSelectPartner(partner)} 
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default RegistryList;