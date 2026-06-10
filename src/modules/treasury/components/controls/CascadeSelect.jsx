import React, { useState, useEffect } from 'react';
import { Building2, MapPin, CreditCard, ChevronDown, X, Loader } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { PAYMENT_GATEWAYS } from '../../data/treasury.constants';

/**
 * CASCADE SELECT (Level 3: Omni-Filter Control)
 * ------------------------------------------------------------------
 * Smart, hierarchical filtering engine.
 * Operator selection dictates Route selection.
 * Directly updates the Master Filter State passed to Level 1 and 4.
 */

const CascadeSelect = ({ filters, onFilterChange }) => {

  // 1. STATE: DICTIONARIES & LOADING
  const [operators, setOperators] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState({ operators: true, routes: true });

  // 2. DATA FETCHING: OPERATORS (Loads Once)
  useEffect(() => {
    const fetchOperators = async () => {
      setIsLoading(prev => ({ ...prev, operators: true }));
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('id, company_name')
          .eq('status', 'ACTIVE')
          .order('company_name', { ascending: true });
        
        if (!error && data) setOperators(data);
      } catch (err) {
        console.error("Failed to fetch Operators:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, operators: false }));
      }
    };
    fetchOperators();
  }, []);

  // 3. DATA FETCHING: ROUTES (Cascades based on Operator)
  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(prev => ({ ...prev, routes: true }));
      try {
        let query = supabase
          .from('routes')
          .select('id, origin_city, destination_city')
          .eq('status', 'ACTIVE');
        
        // The Cascade Action
        if (filters.partnerId && filters.partnerId !== 'ALL') {
          query = query.eq('partner_id', filters.partnerId);
        }

        const { data, error } = await query;
        if (!error && data) {
          // Format routes beautifully (e.g., "Kampala → Nairobi")
          const formattedRoutes = data.map(r => ({
            id: r.id,
            label: `${r.origin_city} → ${r.destination_city}`
          }));
          // Sort alphabetically by origin
          formattedRoutes.sort((a, b) => a.label.localeCompare(b.label));
          setRoutes(formattedRoutes);
        }
      } catch (err) {
        console.error("Failed to fetch Routes:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, routes: false }));
      }
    };
    fetchRoutes();
  }, [filters.partnerId]); // Re-runs every time partnerId changes

  // 4. HANDLERS
  const handleOperatorChange = (e) => {
    const newPartnerId = e.target.value;
    // If Operator changes, we MUST reset Route to ALL to prevent impossible combinations
    onFilterChange({ 
      ...filters, 
      partnerId: newPartnerId, 
      routeId: 'ALL' 
    });
  };

  const handleRouteChange = (e) => {
    onFilterChange({ ...filters, routeId: e.target.value });
  };

  const handleGatewayChange = (e) => {
    onFilterChange({ ...filters, gateway: e.target.value });
  };

  const clearFilter = (filterKey) => {
    if (filterKey === 'partnerId') {
      onFilterChange({ ...filters, partnerId: 'ALL', routeId: 'ALL' });
    } else {
      onFilterChange({ ...filters, [filterKey]: 'ALL' });
    }
  };

  // 5. EXTRACT GATEWAYS FROM DNA CONSTANTS
  const gatewayOptions = Object.values(PAYMENT_GATEWAYS).map(gw => ({
    id: gw.id,
    label: gw.label
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      
      {/* A. OPERATOR FILTER */}
      <FilterPill 
        icon={Building2}
        label="Operator"
        value={filters.partnerId || 'ALL'}
        options={operators.map(op => ({ id: op.id, label: op.company_name }))}
        isLoading={isLoading.operators}
        onChange={handleOperatorChange}
        onClear={() => clearFilter('partnerId')}
      />

      {/* B. ROUTE FILTER (Cascaded) */}
      <FilterPill 
        icon={MapPin}
        label="Route Path"
        value={filters.routeId || 'ALL'}
        options={routes}
        isLoading={isLoading.routes}
        onChange={handleRouteChange}
        onClear={() => clearFilter('routeId')}
        disabled={isLoading.routes} // Disable while re-fetching based on operator
      />

      {/* C. GATEWAY FILTER */}
      <FilterPill 
        icon={CreditCard}
        label="Gateway"
        value={filters.gateway || 'ALL'}
        options={gatewayOptions}
        isLoading={false}
        onChange={handleGatewayChange}
        onClear={() => clearFilter('gateway')}
      />

    </div>
  );
};

// --- SUB-COMPONENT: STYLED NATIVE SELECT PILL ---
const FilterPill = ({ icon: Icon, label, value, options, isLoading, onChange, onClear, disabled }) => {
  const isActive = value !== 'ALL';

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      
      {/* 1. The Visual Shell */}
      <div style={{
        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
        color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
        display: 'flex', pointerEvents: 'none', transition: 'color 0.2s ease'
      }}>
        {isLoading ? <Loader size={16} className="animate-spin" /> : <Icon size={16} />}
      </div>

      {/* 2. The Native Select (Invisible but clickable) */}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled || isLoading}
        style={{
          appearance: 'none', // Removes default OS styling
          WebkitAppearance: 'none',
          background: isActive ? 'var(--bg-hover)' : 'var(--bg-surface)',
          border: `1px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
          borderRadius: '8px',
          padding: '8px 40px 8px 36px', // Space for left icon and right chevron
          fontSize: '13px',
          fontWeight: isActive ? '700' : '500',
          color: isActive ? 'var(--brand-primary)' : 'var(--text-main)',
          cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
          outline: 'none',
          minWidth: '160px',
          maxWidth: '220px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          boxShadow: isActive ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)'
        }}
      >
        <option value="ALL">All {label}s</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* 3. The Right-Side Actions (Chevron or Clear 'X') */}
      <div style={{
        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
        display: 'flex', alignItems: 'center'
      }}>
        {isActive ? (
          <button
            onClick={(e) => { e.preventDefault(); onClear(); }}
            style={{
              background: 'var(--bg-canvas)', border: 'none', borderRadius: '50%',
              width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-danger)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={12} strokeWidth={3} />
          </button>
        ) : (
          <ChevronDown size={14} color="var(--text-muted)" style={{ pointerEvents: 'none' }} />
        )}
      </div>

    </div>
  );
};

export default CascadeSelect;