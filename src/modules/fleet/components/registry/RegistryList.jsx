import React, { useEffect, useState, useRef } from 'react';
import { Search, Filter, Bus, MoreVertical, MapPin, CreditCard, ShieldCheck, Clock, AlertCircle, Edit, Trash2, Power, Eye, ShieldAlert } from 'lucide-react';

// Connects to your surgically updated service
import { fleetService } from '../../data/fleet.service';

/**
 * 👑 AYABUS REGISTRY LIST (Sovereign Edition)
 * ------------------------------------------------------------------
 * The Command Center Interface.
 * - Displays all partners (Active, Pending, Suspended).
 * - Suspended partners get a premium "Ghosted" visual treatment.
 */

const RegistryList = ({ onSelectPartner, onEditPartner }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // 1. DATA SYNCHRONIZATION
  const loadRegistry = async () => {
    try {
      if (partners.length === 0) setLoading(true);
      
      // Fetching ALL records (including suspended) from your updated service
      const data = await fleetService.fetchPartners(); 
      setPartners(data || []);
      setError(null);
    } catch (err) {
      console.error("Registry Load Error:", err);
      setError("Could not synchronize with Sovereign Fleet Database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  // 2. CLICK OUTSIDE MENU LISTENER
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. INTERACTION HANDLERS
  const handleRowClick = (partner) => {
    if (activeMenuId) {
      setActiveMenuId(null); 
      return;
    }
    onSelectPartner(partner);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation(); 
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // 4. THE ACTION ENGINE
  const handleMenuAction = async (e, action, partner) => {
    e.stopPropagation(); 
    setActiveMenuId(null); 
    
    try {
      if (action === 'VIEW') {
        onSelectPartner(partner);
      } 
      else if (action === 'EDIT') {
        if (onEditPartner) onEditPartner(partner);
      } 
      else if (action === 'TOGGLE_SUSPEND') {
        // Dynamic State Switching
        const isSuspending = partner.status !== 'SUSPENDED';
        const newStatus = isSuspending ? 'SUSPENDED' : 'ACTIVE';
        
        // Using your existing update method
        const result = await fleetService.updatePartnerStatus(partner.id, newStatus);
        
        if (result.success) {
          loadRegistry(); 
        } else {
          alert(`Encryption Error: ${result.error}`);
        }
      }
      else if (action === 'DELETE') {
        if (window.confirm(`SOVEREIGN SECURITY CHECK:\n\nAre you sure you want to permanently obliterate ${partner.company_name} from the database?\nThis action cannot be reversed.`)) {
          const result = await fleetService.deletePartner(partner.id);
          if (result.success) {
            loadRegistry();
          } else {
            alert(`Error: ${result.error}`);
          }
        }
      }
    } catch (err) {
      console.error("Action failed:", err);
      alert("System Error: Action could not be completed securely.");
    }
  };

  // 5. SOVEREIGN STATUS VISUALS
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#10B981';           // Success Emerald
      case 'PENDING_APPROVAL': return '#F59E0B'; // Citadel Gold
      case 'SUSPENDED': return '#64748B';        // Muted Slate (Ghost State)
      default: return 'var(--text-muted)';
    }
  };

  const safeDate = (dateString) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString('en-GB'); } 
    catch (e) { return 'Invalid Date'; }
  };

  const filteredPartners = partners.filter(p => 
    (p.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.partner_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
      
      {/* HEADER */}
      <div style={{ 
        padding: '24px', borderBottom: '1px solid var(--border-subtle)', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: 'var(--bg-surface)' 
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            FLEET REGISTRY
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0', fontWeight: '700' }}>
            TOTAL REGISTERED: <span style={{ color: 'var(--brand-primary)' }}>{partners.length} UNITS</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ 
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', width: '280px', 
            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '12px' 
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by ID or Company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none', fontSize: '13px', fontWeight: '500' }}
            />
          </div>
          <button style={{ 
            width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-main)', cursor: 'pointer'
          }}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="ayabus-hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '100px' }}>
        
        {/* Loading State */}
        {loading && partners.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>
            <Bus className="animate-pulse" size={40} style={{ marginBottom: '20px', opacity: 0.3 }} />
            <p>ESTABLISHING SECURE CONNECTION...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--status-danger)', borderRadius: '12px', color: 'var(--status-danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
            <AlertCircle size={20} /> {error}
            <button onClick={loadRegistry} style={{ marginLeft: 'auto', background: 'var(--status-danger)', border: 'none', color: '#FFF', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '800', fontSize: '11px' }}>RETRY</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPartners.length === 0 && (
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
              <Bus size={40} color="var(--text-muted)" opacity={0.5} />
            </div>
            <p style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)' }}>NO PARTNERS DETECTED</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Adjust your search or register a new fleet.</p>
          </div>
        )}

        {/* THE LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPartners.map((partner) => {
            const isMenuOpen = activeMenuId === partner.id;
            const isSuspended = partner.status === 'SUSPENDED';
            
            return (
              <div 
                key={partner.id} 
                onClick={() => handleRowClick(partner)}
                style={{ 
                  background: isSuspended ? 'var(--bg-input)' : 'var(--bg-surface)',
                  padding: '20px 24px', 
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: `5px solid ${getStatusColor(partner.status)}`,
                  cursor: 'pointer', 
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 0.8fr auto',
                  alignItems: 'center',
                  gap: '24px',
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isMenuOpen ? 20 : 1,
                  // The Ghost Effect for Suspended items
                  opacity: isSuspended ? 0.65 : 1,
                  filter: isSuspended ? 'grayscale(80%)' : 'none'
                }}
                onMouseEnter={(e) => { 
                  if (!isMenuOpen) { 
                    e.currentTarget.style.transform = 'translateY(-2px)'; 
                    e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.05)';
                    e.currentTarget.style.opacity = '1'; // Light up on hover even if suspended
                  }
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0)'; 
                  e.currentTarget.style.boxShadow = 'none'; 
                  e.currentTarget.style.opacity = isSuspended ? '0.65' : '1';
                }}
              >
                {/* 1. IDENTITY COLUMN */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>
                      {partner.company_name}
                    </h3>
                    {partner.status === 'PENDING_APPROVAL' && (
                      <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> IN REVIEW
                      </span>
                    )}
                    {isSuspended && (
                      <span style={{ fontSize: '10px', fontWeight: '800', background: 'var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldAlert size={12} /> BENCHED
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
                    <span style={{ background: 'var(--bg-canvas)', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                      {partner.partner_id}
                    </span>
                    <span>Added: {safeDate(partner.created_at)}</span>
                  </div>
                </div>

                {/* 2. STATS COLUMN */}
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    <MapPin size={16} color={isSuspended ? 'var(--text-muted)' : 'var(--brand-primary)'} /> 
                    <span>{partner.partner_parks?.[0]?.count || 0} Stages</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    <CreditCard size={16} color={isSuspended ? 'var(--text-muted)' : 'var(--brand-primary)'} /> 
                    <span>{partner.partner_financials?.[0]?.count || 0} Accounts</span>
                  </div>
                </div>

                {/* 3. STATUS COLUMN */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color={getStatusColor(partner.status)} />
                  <span style={{ fontSize: '12px', fontWeight: '800', color: getStatusColor(partner.status) }}>
                    {(partner.status || 'UNKNOWN').replace('_', ' ')}
                  </span>
                </div>

                {/* 4. SMART ACTIONS MENU */}
                <div style={{ position: 'relative' }}>
                  <button 
                    style={{ padding: '8px', borderRadius: '10px', border: '1px solid transparent', background: isMenuOpen ? 'var(--border-subtle)' : 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                    onClick={(e) => toggleMenu(e, partner.id)}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-subtle)'}
                    onMouseLeave={(e) => { if(!isMenuOpen) e.currentTarget.style.background = 'transparent' }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {isMenuOpen && (
                    <div ref={menuRef} style={{ 
                      position: 'absolute', top: '100%', right: 0, width: '200px',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                      borderRadius: '16px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                      overflow: 'hidden', zIndex: 100, padding: '8px'
                    }}>
                      <div 
                        onClick={(e) => handleMenuAction(e, 'VIEW', partner)}
                        style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', borderRadius: '8px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Eye size={16} /> Inspect Profile
                      </div>
                      
                      <div 
                        onClick={(e) => handleMenuAction(e, 'EDIT', partner)}
                        style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', borderRadius: '8px', marginBottom: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Edit size={16} /> Modify Details
                      </div>

                      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
                      
                      {/* DYNAMIC TOGGLE BUTTON */}
                      <div 
                        onClick={(e) => handleMenuAction(e, 'TOGGLE_SUSPEND', partner)}
                        style={{ 
                          padding: '10px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px',
                          color: isSuspended ? '#10B981' : '#F59E0B' // Green to activate, Amber to suspend
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Power size={16} /> {isSuspended ? 'Reactivate Operator' : 'Suspend Operator'}
                      </div>
                      
                      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                      <div 
                        onClick={(e) => handleMenuAction(e, 'DELETE', partner)}
                        style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', borderRadius: '8px' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Trash2 size={16} /> Purge Record
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
      <style>{`.ayabus-hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default RegistryList;