import React, { useState, useEffect } from 'react';
import { MapPin, User, Plus, Trash2, Search, Navigation, Globe, Map as MapIcon } from 'lucide-react';
import { createDefaultPark } from '../../../data/fleet.models';
import LocationPicker from '../../shared/LocationPicker';

// IMPORT DYNAMIC CONTEXT (For East Africa Search)
import { COUNTRY_MAP_CONFIG, ACTIVE_CONTEXT, REGIONAL_PHONE_CODES } from '../../../data/country.constants';

const Step2_Parks = ({ data, onChange }) => {
  // STATE: The park currently being edited
  // Note: We use a local state for the form inputs, then "commit" to the main list
  const [currentPark, setCurrentPark] = useState(createDefaultPark());
  
  // STATE: Search Logic
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 1. LIVE SEARCH ENGINE (Nominatim)
  // Biased towards the ACTIVE_CONTEXT (Uganda, Kenya, etc.)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery || searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=${ACTIVE_CONTEXT.isoCode}&addressdetails=1&limit=5`;
        
        const response = await fetch(url);
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error("Map Error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // 2. HANDLER: Select Search Result
  const handleSelectLocation = (result) => {
    // Standardize Coordinates (6 decimal places)
    const lat = parseFloat(result.lat).toFixed(6);
    const lon = parseFloat(result.lon).toFixed(6);

    updateGps('lat', lat);
    updateGps('lng', lon);
    
    // Auto-fill Name/Address
    const cleanName = result.address?.city || result.address?.town || result.address?.village || result.display_name.split(',')[0];
    updateCurrent('address', result.display_name); 
    
    if (!currentPark.name) {
       updateCurrent('name', cleanName);
    }

    setSearchQuery('');
    setSearchResults([]);
  };

  // 3. UPDATERS
  const updateCurrent = (field, value) => setCurrentPark(prev => ({ ...prev, [field]: value }));
  
  // Safe GPS updater handling the nested object
  const updateGps = (field, value) => setCurrentPark(prev => ({ 
    ...prev, 
    gps: { ...(prev.gps || {}), [field]: value } 
  }));

  // 4. ACTION: Add to List (Commit)
  const commitPark = () => {
    if (!currentPark.name || !currentPark.gps?.lat) return;
    
    const newEntry = { 
      ...currentPark, 
      id: Date.now() // Temporary ID for UI key
    };
    
    // CRITICAL FIX: The "White Screen" prevention. 
    // We default to [] if parks is undefined.
    const updatedList = [...(data.parks || []), newEntry];
    onChange({ parks: updatedList }); // Merge update
    
    // Reset Form
    setCurrentPark(createDefaultPark()); 
    setSearchQuery('');
  };

  // 5. ACTION: Remove from List
  const removePark = (parkId) => {
    const updatedList = (data.parks || []).filter(p => p.id !== parkId);
    onChange({ parks: updatedList });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          width: '56px', height: '56px', margin: '0 auto 16px', 
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <Globe size={28} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '24px', marginBottom: '8px' }}>
          Bus Park Network
        </h3>
        <p className="text-muted" style={{ fontSize: '14px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
          Map out the physical stages using OpenStreetMap.
        </p>
      </div>

      {/* ACTIVE STAGES LIST (The Safe Render) */}
      {data.parks && data.parks.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h4 className="text-muted" style={{ fontSize: '12px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Registered Stages ({data.parks.length})
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {data.parks.map((park) => (
              <div key={park.id} className="citadel-card" style={{ padding: '20px', position: 'relative', borderLeft: '4px solid var(--brand-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ background: 'var(--bg-canvas)', padding: '8px', borderRadius: '50%' }}>
                    <MapIcon size={16} color="var(--brand-primary)" />
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>
                    {park.name}
                  </div>
                </div>
                
                <div className="text-muted" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <MapPin size={14} /> {park.address || 'Pinned Location'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                   <div style={{ background: 'var(--bg-canvas)', padding: '6px 10px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                     LAT: <strong style={{ color: 'var(--text-main)' }}>{park.gps?.lat || 'N/A'}</strong>
                   </div>
                   <div style={{ background: 'var(--bg-canvas)', padding: '6px 10px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                     LNG: <strong style={{ color: 'var(--text-main)' }}>{park.gps?.lng || 'N/A'}</strong>
                   </div>
                </div>

                <button 
                  onClick={() => removePark(park.id)} 
                  style={{ 
                    position: 'absolute', top: '16px', right: '16px', 
                    border: 'none', background: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: '4px'
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE CARD */}
      <div className="citadel-card" style={{ borderTop: '4px solid var(--brand-primary)', padding: '0', overflow: 'hidden' }}>
        
        {/* Workspace Header */}
        <div style={{ 
          padding: '24px', display: 'flex', alignItems: 'center', gap: '12px',
          borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)'
        }}>
          <div style={{ background: 'var(--brand-primary)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
            <Plus size={16} color="var(--text-inverse)" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)' }}>
            {data.parks?.length === 0 ? "Add Main Office / Headquarters" : "Add Branch / Stage"}
          </span>
        </div>

        {/* Workspace Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0' }}>
          
          {/* LEFT: FORM INPUTS */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Stage Name */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Stage Name
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input"
                  placeholder="e.g. City Square Stage" 
                  value={currentPark.name} 
                  onChange={(e) => updateCurrent('name', e.target.value)} 
                  style={{ fontWeight: '600' }}
                />
                <Navigation size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Live Search */}
            <div style={{ position: 'relative' }}>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Search Location
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input"
                  placeholder={`Search ${ACTIVE_CONTEXT.name}...`}
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  style={{ borderColor: isSearching ? 'var(--brand-primary)' : '' }}
                />
                <Search size={18} color={isSearching ? "var(--brand-primary)" : "var(--text-muted)"} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div style={{ 
                  position: 'absolute', top: '100%', left: 0, right: 0, 
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                  borderRadius: '0 0 8px 8px', zIndex: 100, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
                }}>
                  {searchResults.map((res, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleSelectLocation(res)}
                      style={{ 
                        padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', 
                        cursor: 'pointer', fontSize: '13px', color: 'var(--text-main)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <MapPin size={14} className="text-muted" />
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                         {res.display_name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coordinates */}
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
              <div style={{ flex: 1 }}>
                <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Latitude</label>
                <input type="text" className="citadel-input" value={currentPark.gps?.lat || ''} onChange={(e) => updateGps('lat', e.target.value)} style={{ fontFamily: 'monospace' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Longitude</label>
                <input type="text" className="citadel-input" value={currentPark.gps?.lng || ''} onChange={(e) => updateGps('lng', e.target.value)} style={{ fontFamily: 'monospace' }} />
              </div>
            </div>

            {/* Manager Contact */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Manager Name
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input"
                  placeholder="Full Name" 
                  value={currentPark.contactName} 
                  onChange={(e) => updateCurrent('contactName', e.target.value)} 
                />
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Manager Phone
              </label>
              <div style={{ display: 'flex', height: '50px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)' }}>
                <select 
                   style={{ 
                     width: '90px', border: 'none', height: '100%', background: 'transparent', 
                     fontSize: '13px', paddingLeft: '12px', borderRight: '1px solid var(--border-subtle)', 
                     color: 'var(--text-main)', outline: 'none', fontWeight: '600'
                   }}
                   value={currentPark.contactPhoneCode} 
                   onChange={(e) => updateCurrent('contactPhoneCode', e.target.value)}
                >
                  {REGIONAL_PHONE_CODES.map(c => (
                    <option key={c.country} value={c.code}>
                      {c.country} ({c.code})
                    </option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="770..." 
                  value={currentPark.contactPhone} 
                  onChange={(e) => updateCurrent('contactPhone', e.target.value)} 
                  style={{ border: 'none', background: 'transparent', width: '100%', paddingLeft: '12px', outline: 'none', color: 'var(--text-main)', fontSize: '14px' }} 
                />
              </div>
            </div>

            {/* Add Button */}
            <button 
              className="citadel-btn citadel-btn-primary"
              onClick={commitPark}
              disabled={!currentPark.name || !currentPark.gps?.lat}
              style={{ width: '100%', marginTop: '10px', height: '56px' }}
            >
              <Plus size={20} /> ADD STAGE TO NETWORK
            </button>
          </div>

          {/* RIGHT: MAP VISUALIZATION */}
          <div style={{ 
            height: '100%', minHeight: '600px', 
            borderLeft: '1px solid var(--border-subtle)',
            position: 'relative', background: 'var(--bg-canvas)' 
          }}>
            <LocationPicker 
              lat={currentPark.gps?.lat} 
              lng={currentPark.gps?.lng} 
              onChange={(lat, lng) => {
                 updateGps('lat', parseFloat(lat).toFixed(6));
                 updateGps('lng', parseFloat(lng).toFixed(6));
              }} 
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Step2_Parks;