import React, { useEffect, useState } from 'react';
import { 
  MapPin, Navigation, Warehouse, AlertCircle, 
  Map as MapIcon, Compass, CornerDownRight, ArrowDown
} from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { CITY_SUGGESTIONS } from '../../../data/routes.constants';

/**
 * STEP 2: GEOGRAPHY (High Fidelity Edition)
 * ------------------------------------------------------------------
 * Defines the physical path and the logistical starting point.
 * * * VISUAL UPGRADES:
 * 1. HEFTY INPUTS: Increased height to 64px for a modern, tactile feel.
 * 2. VISUAL HIERARCHY: Stronger fonts, clearer labels, and "Ticket" layout.
 * 3. CONNECTED TIMELINE: Visual line connecting Origin -> Park -> Dest.
 */

const Step2_Geography = ({ formData, onChange, errors = {} }) => {

  // 1. LOCAL STATE
  const [parks, setParks] = useState([]);
  const [loadingParks, setLoadingParks] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // 2. SYNC PARKS
  useEffect(() => {
    if (!formData.partnerId) return;

    const fetchParks = async () => {
      setLoadingParks(true);
      setDebugInfo(null);
      
      try {
        const { data, error } = await supabase
          .from('partner_parks')
          .select('*') 
          .eq('partner_id', formData.partnerId);

        if (error) throw error;
        setParks(data || []);
        
        if (!data || data.length === 0) {
           setDebugInfo(`Searched partner_parks for partner_id: ${formData.partnerId}. Result: 0 rows.`);
        }
      } catch (err) {
        console.error("Park Sync Error:", err);
        setDebugInfo(err.message);
      } finally {
        setLoadingParks(false);
      }
    };

    fetchParks();
  }, [formData.partnerId]);

  // 3. HANDLER
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const getParkName = (park) => {
    return park.park_name || park.name || park.terminal_name || 'Unnamed Terminal';
  };

  // --- STYLES ---
  const inputContainerStyle = {
    position: 'relative',
    transition: 'all 0.2s ease'
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    height: '64px', // CHUNKY HEIGHT
    padding: '24px 16px 8px 56px', // PT pushes text down, PL makes room for icon
    background: 'white',
    border: hasError ? '2px solid var(--status-danger)' : '1px solid var(--border-subtle)',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-main)',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease'
  });

  const labelStyle = {
    position: 'absolute',
    left: '56px',
    top: '12px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
    letterSpacing: '0.5px'
  };

  const iconBoxStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-input)',
    borderRadius: '8px',
    color: 'var(--text-muted)'
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      
      {/* 1. HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <Compass size={32} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '800' }}>Route Trajectory</h3>
        <p className="text-muted" style={{ fontSize: '15px' }}>Define the physical path and logistics.</p>
      </div>

      {/* 2. THE MAIN FORM */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ROW 1: ORIGIN (Floating Label) */}
        <div style={inputContainerStyle}>
          <div style={iconBoxStyle}><MapPin size={18} /></div>
          <label style={labelStyle}>Origin City</label>
          <input
            type="text"
            list="city-suggestions"
            value={formData.origin || ''}
            onChange={(e) => handleChange('origin', e.target.value)}
            placeholder="e.g. Kampala"
            style={inputStyle(errors.origin)}
            onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 4px var(--bg-hover)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.origin ? 'var(--status-danger)' : 'var(--border-subtle)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
          />
        </div>

        {/* CONNECTOR (Visual Only) */}
        <div style={{ paddingLeft: '31px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '2px', height: '32px', background: 'var(--border-subtle)' }} />
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-primary)', background: 'var(--bg-hover)', padding: '4px 12px', borderRadius: '12px' }}>
            VIA
          </div>
        </div>

        {/* ROW 2: DEPARTURE PARK (Crucial Middle Step) */}
        <div style={inputContainerStyle}>
          <div style={iconBoxStyle}><Warehouse size={18} /></div>
          <label style={labelStyle}>Departure Terminal</label>
          <select
            value={formData.park || ''}
            onChange={(e) => handleChange('park', e.target.value)}
            disabled={!formData.partnerId || loadingParks}
            style={{ ...inputStyle(errors.park), appearance: 'none', cursor: 'pointer', opacity: !formData.partnerId ? 0.6 : 1 }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 4px var(--bg-hover)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.park ? 'var(--status-danger)' : 'var(--border-subtle)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
          >
            <option value="" disabled>{loadingParks ? 'Loading...' : 'Select Terminal...'}</option>
            {parks.map(p => {
              const pName = getParkName(p);
              return <option key={p.id} value={pName}>{pName}</option>;
            })}
          </select>
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <ArrowDown size={16} />
          </div>
        </div>

        {/* ERROR STATE FOR PARKS */}
        {!loadingParks && parks.length === 0 && formData.partnerId && (
          <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px dashed #FECACA', borderRadius: '8px', color: '#B91C1C', fontSize: '12px', display: 'flex', gap: '10px' }}>
            <AlertCircle size={16} />
            <div>
              <strong>No Terminals Found.</strong> The selected partner has no registered parks.
              <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px', fontFamily: 'monospace' }}>{debugInfo}</div>
            </div>
          </div>
        )}

        {/* CONNECTOR 2 */}
        <div style={{ paddingLeft: '31px' }}>
          <div style={{ width: '2px', height: '32px', background: 'var(--border-subtle)' }} />
        </div>

        {/* ROW 3: DESTINATION */}
        <div style={inputContainerStyle}>
          <div style={iconBoxStyle}><Navigation size={18} /></div>
          <label style={labelStyle}>Destination City</label>
          <input
            type="text"
            list="city-suggestions"
            value={formData.destination || ''}
            onChange={(e) => handleChange('destination', e.target.value)}
            placeholder="e.g. Gulu"
            style={inputStyle(errors.destination)}
            onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 4px var(--bg-hover)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.destination ? 'var(--status-danger)' : 'var(--border-subtle)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
          />
        </div>

      </div>

      {/* AUTO-COMPLETE LIST */}
      <datalist id="city-suggestions">
        {CITY_SUGGESTIONS.map(city => <option key={city} value={city} />)}
      </datalist>

    </div>
  );
};

export default Step2_Geography;