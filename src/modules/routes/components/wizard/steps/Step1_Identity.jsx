import React, { useEffect, useState } from 'react';
import { 
  Building2, Bus, AlertCircle, ChevronDown, 
  ShieldCheck, Map, WifiOff, Star, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';

/**
 * STEP 1: IDENTITY (Refined Layout Edition)
 * ------------------------------------------------------------------
 * Establishes WHO is operating the route.
 * * * UPGRADES:
 * 1. SPACIOUS LAYOUT: Increased gaps and padding for a premium, uncrowded feel.
 * 2. NO NOISE: Removed all capacity/seat numbers.
 * 3. ELEGANT CONFIRMATION: The spec card is now a pure visual verification.
 */

const Step1_Identity = ({ formData, onChange, errors = {} }) => {
  
  // 1. STATE
  const [partners, setPartners] = useState([]);
  const [allConfigs, setAllConfigs] = useState([]); 
  const [filteredConfigs, setFilteredConfigs] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. ROBUST DATA LOADER
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setConnectionError(null);

      try {
        if (!supabase || !supabase.from) throw new Error("Supabase Client is disconnected.");

        // Fetch Partners
        const { data: pData, error: pError } = await supabase.from('partners').select('*').order('company_name');
        if (pError) throw pError;
        setPartners(pData || []);

        // Fetch Bus Configs (Wildcard)
        const { data: cData, error: cError } = await supabase.from('bus_configs').select('*');
        if (cError) throw cError;
        setAllConfigs(cData || []);

      } catch (err) {
        console.error("SYNC ERROR:", err);
        setConnectionError(err.message || "Failed to sync with database.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 3. FILTER & AUTO-SELECT LOGIC
  useEffect(() => {
    if (!formData.partnerId || allConfigs.length === 0) {
      setFilteredConfigs([]);
      return;
    }

    const currentPartner = partners.find(p => p.id === formData.partnerId);
    if (!currentPartner) return;

    const matches = allConfigs.filter(config => {
      const pID = config.partner_id ? String(config.partner_id).trim() : 'NULL';
      const uuid = currentPartner.id ? String(currentPartner.id).trim() : 'NULL';
      const code = currentPartner.partner_id ? String(currentPartner.partner_id).trim() : 'NULL';
      return pID === uuid || pID === code;
    });

    setFilteredConfigs(matches);

    // Auto-Select if only 1 option exists
    if (matches.length === 1 && formData.busConfigId !== matches[0].id) {
      onChange({ ...formData, partnerId: formData.partnerId, busConfigId: matches[0].id });
    }

  }, [formData.partnerId, allConfigs, partners]);

  // 4. HELPERS
  const selectedConfig = filteredConfigs.find(c => c.id === formData.busConfigId);

  // --- STYLES ---
  const inputContainerStyle = { 
    position: 'relative', 
    transition: 'all 0.3s ease' 
  };
  
  const inputStyle = (hasError, disabled) => ({
    width: '100%',
    height: '68px', // Slightly taller for more breathing room
    padding: '26px 20px 10px 64px',
    background: disabled ? 'var(--bg-input)' : 'white',
    border: hasError ? '2px solid var(--status-danger)' : '1px solid var(--border-subtle)',
    borderRadius: '16px', // Softer, more modern corners
    fontSize: '16px',
    fontWeight: '800',
    color: disabled ? 'var(--text-muted)' : 'var(--text-main)',
    outline: 'none',
    appearance: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.7 : 1
  });

  const labelStyle = {
    position: 'absolute', left: '64px', top: '14px',
    fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
    color: 'var(--text-muted)', pointerEvents: 'none', letterSpacing: '0.8px'
  };

  const iconBoxStyle = {
    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-input)', borderRadius: '10px', color: 'var(--text-muted)'
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '20px 0' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ width: '64px', height: '64px', margin: '0 auto 20px', background: 'white', border: '1px solid var(--border-subtle)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
          <ShieldCheck size={32} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '28px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-0.5px' }}>Route Ownership</h3>
        <p className="text-muted" style={{ fontSize: '15px', lineHeight: '1.6' }}>Assign the operational partner and define the service level.</p>
      </div>

      {/* ERROR GUARD */}
      {connectionError && (
        <div className="animate-in slide-in-from-top-2" style={{ marginBottom: '32px', padding: '20px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', color: '#B91C1C' }}>
          <WifiOff size={24} />
          <div>
            <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Connection Failed</strong> 
            <span style={{ fontSize: '13px', opacity: 0.9 }}>{connectionError}</span>
          </div>
        </div>
      )}

      {/* MAIN FORM */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* 1. PARTNER SELECT */}
        <div style={inputContainerStyle}>
          <div style={iconBoxStyle}><Building2 size={20} /></div>
          <label style={labelStyle}>Bus Operator</label>
          <select
            value={formData.partnerId || ''}
            onChange={(e) => onChange({ ...formData, partnerId: e.target.value, busConfigId: '' })}
            style={inputStyle(errors.partnerId)}
            onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 4px var(--bg-hover)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.partnerId ? 'var(--status-danger)' : 'var(--border-subtle)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}
          >
            <option value="" disabled>Select Operator...</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.company_name}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <ChevronDown size={20} strokeWidth={2.5} />
          </div>
        </div>

        {/* 2. CONFIG SELECT */}
        <div style={inputContainerStyle}>
          <div style={iconBoxStyle}><Bus size={20} /></div>
          <label style={labelStyle}>Service Class</label>
          <select
            value={formData.busConfigId || ''}
            onChange={(e) => onChange({ ...formData, busConfigId: e.target.value })}
            disabled={!formData.partnerId}
            style={inputStyle(errors.busConfigId, !formData.partnerId)}
            onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 4px var(--bg-hover)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.busConfigId ? 'var(--status-danger)' : 'var(--border-subtle)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}
          >
            <option value="" disabled>
              {!formData.partnerId ? 'Waiting for Operator...' : (filteredConfigs.length === 0 ? 'No Classes Found' : 'Select Class...')}
            </option>
            {filteredConfigs.map(c => (
              <option key={c.id} value={c.id}>
                {c.bus_class} 
              </option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <ChevronDown size={20} strokeWidth={2.5} />
          </div>
        </div>

        {/* 3. THE CONFIRMATION CARD (Spacious & Clean) */}
        {selectedConfig && (
          <div className="animate-in slide-in-from-top-4 duration-500" style={{ 
            padding: '24px 32px', 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--bg-input)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={28} color="var(--brand-primary)" fill="var(--brand-primary)" fillOpacity={0.15} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--brand-primary)', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  Service Level Confirmed
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>
                  {selectedConfig.bus_class}
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#DCFCE7', color: '#16A34A', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '800' }}>
              <CheckCircle2 size={18} /> Ready
            </div>
          </div>
        )}

        {/* 4. ERROR STATE */}
        {!isLoading && formData.partnerId && filteredConfigs.length === 0 && (
           <div style={{ padding: '24px', background: '#FFF7ED', border: '1px dashed #FED7AA', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center', color: '#9A3412', marginTop: '8px' }}>
             <AlertCircle size={24} />
             <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
               <strong style={{ display: 'block', fontSize: '15px', marginBottom: '4px' }}>No Classes Found.</strong> 
               This operator has no active vehicle configurations registered in the Fleet Module.
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default Step1_Identity;