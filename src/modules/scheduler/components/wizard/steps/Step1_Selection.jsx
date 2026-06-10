import React, { useEffect, useState } from 'react';
import { 
  Building2, Bus, MapPin, ChevronDown, Check, Loader, AlertCircle 
} from 'lucide-react';
import { schedulerService } from '../../../data/scheduler.service';

/**
 * ELITE STEP 1: TARGET DEFINITION
 * ------------------------------------------------------------------
 * A high-density cascading selector engine.
 * * * FEATURES:
 * 1. INTELLIGENT CASCADING: Locks child fields until parent data is validated.
 * 2. COMMAND INPUTS: Deep-milled selection boxes with integrated branding icons.
 * 3. LIVE FEEDBACK: Visual confirmation when the selection chain is complete.
 */

const Step1_Selection = ({ formData, onChange }) => {
  
  // 1. DATA REPOSITORIES
  const [partners, setPartners] = useState([]);
  const [classes, setClasses] = useState([]);
  const [routes, setRoutes] = useState([]);

  // 2. STATE ENGINE
  const [loading, setLoading] = useState({ partners: true, classes: false, routes: false });

  // 3. PHASE 1: LOAD OPERATORS
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await schedulerService.fetchPartners();
        setPartners(data || []);
      } finally {
        setLoading(prev => ({ ...prev, partners: false }));
      }
    };
    loadPartners();
  }, []);

  // 4. PHASE 2: LOAD CLASSES (Triggered by Partner Selection)
  useEffect(() => {
    if (!formData.partnerId) {
      setClasses([]);
      return;
    }
    const loadClasses = async () => {
      setLoading(prev => ({ ...prev, classes: true }));
      try {
        const data = await schedulerService.fetchClassesByPartner(formData.partnerId);
        setClasses(data || []);
      } finally {
        setLoading(prev => ({ ...prev, classes: false }));
      }
    };
    loadClasses();
  }, [formData.partnerId]);

  // 5. PHASE 3: LOAD ROUTES (Triggered by Class Selection)
  useEffect(() => {
    if (!formData.classId) {
      setRoutes([]);
      return;
    }
    const loadRoutes = async () => {
      setLoading(prev => ({ ...prev, routes: true }));
      try {
        const data = await schedulerService.fetchRoutesByClass(formData.classId);
        setRoutes(data || []);
      } finally {
        setLoading(prev => ({ ...prev, routes: false }));
      }
    };
    loadRoutes();
  }, [formData.classId]);

  // 6. EVENT HANDLERS (With Chain Resets)
  const handlePartnerChange = (e) => {
    onChange({ 
      partnerId: e.target.value, 
      classId: '', 
      routeId: '' 
    });
  };

  const handleClassChange = (e) => {
    onChange({ 
      classId: e.target.value, 
      routeId: '' 
    });
  };

  // --- ELITE UI STYLES ---
  const fieldContainerStyle = (isActive) => ({
    padding: '24px',
    background: 'white',
    borderRadius: '20px',
    border: '1px solid var(--border-subtle)',
    transition: 'all 0.3s ease',
    opacity: isActive ? 1 : 0.5,
    pointerEvents: isActive ? 'auto' : 'none',
    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.02)' : 'none'
  });

  const selectWrapperStyle = { position: 'relative', marginTop: '16px' };

  const selectElementStyle = (isLoading) => ({
    width: '100%', height: '58px', padding: '0 20px 0 52px',
    borderRadius: '14px', border: '2px solid var(--bg-input)',
    background: 'var(--bg-canvas)', color: 'var(--text-main)',
    fontSize: '15px', fontWeight: '700', appearance: 'none',
    outline: 'none', cursor: isLoading ? 'wait' : 'pointer',
    transition: 'all 0.2s ease'
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER: CONTEXTUAL INSTRUCTION */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h3 className="text-heading" style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' }}>
          Target Selection
        </h3>
        <p className="text-muted" style={{ fontSize: '14px', marginTop: '8px' }}>
          Define the network route profile you wish to automate.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 1. OPERATOR SELECTOR */}
        <div style={fieldContainerStyle(true)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
               Fleet Operator
             </label>
             {formData.partnerId && <Check size={16} color="#10B981" strokeWidth={3} />}
          </div>
          <div style={selectWrapperStyle}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-primary)' }}>
              <Building2 size={20} />
            </div>
            <select 
              value={formData.partnerId} 
              onChange={handlePartnerChange}
              style={selectElementStyle(loading.partners)}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--bg-input)'}
            >
              <option value="">Choose a registered partner...</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.company_name}</option>)}
            </select>
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              {loading.partners ? <Loader className="animate-spin" size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>

        {/* 2. CLASS SELECTOR */}
        <div style={fieldContainerStyle(!!formData.partnerId)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
               Service Class
             </label>
             {formData.classId && <Check size={16} color="#10B981" strokeWidth={3} />}
          </div>
          <div style={selectWrapperStyle}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-primary)' }}>
              <Bus size={20} />
            </div>
            <select 
              value={formData.classId} 
              onChange={handleClassChange}
              style={selectElementStyle(loading.classes)}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--bg-input)'}
            >
              <option value="">{loading.classes ? 'Syncing Classes...' : 'Select service class...'}</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.bus_class}</option>)}
            </select>
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* 3. ROUTE SELECTOR */}
        <div style={fieldContainerStyle(!!formData.classId)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
               Active Route Profile
             </label>
             {formData.routeId && <Check size={16} color="#10B981" strokeWidth={3} />}
          </div>
          <div style={selectWrapperStyle}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-primary)' }}>
              <MapPin size={20} />
            </div>
            <select 
              value={formData.routeId} 
              onChange={(e) => onChange({ routeId: e.target.value })}
              style={selectElementStyle(loading.routes)}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--bg-input)'}
            >
              <option value="">{routes.length === 0 && formData.classId ? 'No routes found for this class' : 'Select target route...'}</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.origin_city} → {r.destination_city} ({r.departure_time.slice(0,5)})
                </option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* NO ROUTES WARNING */}
        {!loading.routes && formData.classId && routes.length === 0 && (
          <div className="animate-in zoom-in-95" style={{ padding: '16px', background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={18} color="#D97706" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#92400E' }}>
              No routes registered for this class. Please define routes first.
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Step1_Selection;