import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, Building2, Bus, MapPin, Clock, 
  ShieldCheck, MoreVertical 
} from 'lucide-react';

/**
 * ROUTE SIDEBAR (Inline Style Edition)
 * ------------------------------------------------------------------
 * A high-fidelity hierarchical navigation tree.
 * * * FIX:
 * 1. NO TAILWIND: Uses explicit style={{}} to guarantee rendering.
 * 2. BRAND COLORS: Links directly to var(--brand-primary).
 * 3. KINETIC HOVERS: Uses JS-driven hover states for interactions.
 */

const RouteSidebar = ({ tree, selectedId, onSelect }) => {
  
  // 1. STATE
  const [expandedPartners, setExpandedPartners] = useState(new Set());
  const [expandedConfigs, setExpandedConfigs] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);

  // --- ACTIONS ---
  const togglePartner = (id) => {
    const next = new Set(expandedPartners);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedPartners(next);
  };

  const toggleConfig = (id) => {
    const next = new Set(expandedConfigs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedConfigs(next);
  };

  const formatTime = (timeString) => {
    if (!timeString) return { time: '00:00', period: '--' };
    const [h, m] = timeString.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return { time: `${displayHour}:${m}`, period };
  };

  // --- RENDER HELPERS ---
  const partners = Object.values(tree);

  if (partners.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Bus size={32} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
        <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>No Routes Found</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px', paddingBottom: '80px' }}>
      {partners.map((partner) => {
        const isPartnerOpen = expandedPartners.has(partner.id);
        const configCount = Object.keys(partner.configs).length;

        return (
          <div key={partner.id} style={{ position: 'relative' }}>
            
            {/* LEVEL 1: PARTNER CARD */}
            <div
              onClick={() => togglePartner(partner.id)}
              onMouseEnter={() => setHoveredId(partner.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                borderRadius: '12px', cursor: 'pointer', position: 'relative', zIndex: 10,
                background: isPartnerOpen ? 'white' : 'var(--bg-surface)',
                border: isPartnerOpen ? '1px solid var(--brand-primary)' : (hoveredId === partner.id ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)'),
                boxShadow: isPartnerOpen ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Icon Box */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isPartnerOpen ? 'var(--brand-primary)' : 'var(--bg-input)',
                color: isPartnerOpen ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}>
                <Building2 size={18} />
              </div>

              {/* Text Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '2px' }}>
                  {partner.label}
                </div>
                <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                  {configCount} Classes
                </div>
              </div>

              {/* Chevron */}
              <div style={{ color: isPartnerOpen ? 'var(--brand-primary)' : 'var(--text-muted)', transform: isPartnerOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* EXPANDED CONTENT AREA */}
            {isPartnerOpen && (
              <div style={{ position: 'relative', paddingLeft: '24px', marginTop: '8px' }}>
                
                {/* The "Tree Line" */}
                <div style={{ position: 'absolute', left: '32px', top: '0', bottom: '16px', width: '2px', background: 'var(--border-subtle)' }} />

                {Object.values(partner.configs).map((config) => {
                  const isConfigOpen = expandedConfigs.has(config.id);
                  const routeCount = config.routes.length;

                  return (
                    <div key={config.id} style={{ marginBottom: '8px' }}>
                      
                      {/* LEVEL 2: CONFIG HEADER */}
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                         {/* Horizontal Connector */}
                        <div style={{ position: 'absolute', left: '-22px', top: '50%', width: '16px', height: '2px', background: 'var(--border-subtle)' }} />
                        
                        <div
                          onClick={() => toggleConfig(config.id)}
                          onMouseEnter={() => setHoveredId(config.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                            background: hoveredId === config.id ? 'var(--bg-input)' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <ShieldCheck size={14} color={isConfigOpen ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                             <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>{config.label}</span>
                             <span style={{ fontSize: '9px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '1px 5px', borderRadius: '10px', color: 'var(--text-muted)' }}>{routeCount}</span>
                          </div>
                          <ChevronDown size={12} color="var(--text-muted)" style={{ transform: isConfigOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>
                      </div>

                      {/* LEVEL 3: ROUTES (The Leaves) */}
                      {isConfigOpen && (
                        <div style={{ paddingLeft: '16px', paddingTop: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          
                          {config.routes.map((route) => {
                            const isSelected = selectedId === route.id;
                            const isHovered = hoveredId === route.id;
                            const { time, period } = formatTime(route.departure_time);
                            
                            return (
                              <div
                                key={route.id}
                                onClick={() => onSelect(route.id)}
                                onMouseEnter={() => setHoveredId(route.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                  position: 'relative', display: 'flex', alignItems: 'center', gap: '12px',
                                  padding: '10px', borderRadius: '10px', cursor: 'pointer',
                                  background: isSelected ? 'var(--text-main)' : 'white', // Dark background for selected
                                  border: isSelected ? '1px solid var(--text-main)' : (isHovered ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)'),
                                  boxShadow: isSelected || isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                                  transform: isSelected || isHovered ? 'scale(1.02)' : 'none',
                                  transition: 'all 0.2s ease',
                                  zIndex: isSelected ? 5 : 1
                                }}
                              > 
                                {/* Connector Curve */}
                                <div style={{ position: 'absolute', left: '-16px', top: '50%', width: '12px', height: '2px', background: isSelected ? 'var(--text-main)' : 'var(--border-subtle)' }} />

                                {/* Time Block */}
                                <div style={{
                                  width: '42px', height: '42px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                  background: isSelected ? 'rgba(255,255,255,0.1)' : 'var(--bg-input)',
                                  color: isSelected ? 'white' : 'var(--text-main)'
                                }}>
                                  <span style={{ fontSize: '13px', fontWeight: '900', lineHeight: '1' }}>{time}</span>
                                  <span style={{ fontSize: '8px', fontWeight: '700', opacity: 0.7, marginTop: '2px' }}>{period}</span>
                                </div>

                                {/* Info Block */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: '800', color: isSelected ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>
                                      {route.route_code || 'NO CODE'}
                                    </span>
                                    {/* Status Dot */}
                                    <div style={{ 
                                      width: '6px', height: '6px', borderRadius: '50%', 
                                      background: route.status === 'ACTIVE' ? '#22C55E' : '#F59E0B',
                                      boxShadow: route.status === 'ACTIVE' ? '0 0 6px rgba(34,197,94,0.6)' : 'none'
                                    }} />
                                  </div>
                                  
                                  <div style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? 'white' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {route.origin_city} <span style={{ opacity: 0.5 }}>→</span> {route.destination_city}
                                  </div>
                                </div>

                                {/* Arrow */}
                                {isSelected && (
                                  <div style={{ color: 'white', opacity: 0.5 }}>
                                    <ChevronRight size={14} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RouteSidebar;