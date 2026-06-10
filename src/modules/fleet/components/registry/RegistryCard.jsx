import React from 'react';
import { MapPin, CreditCard, ShieldCheck, Clock, MoreVertical, ShieldAlert } from 'lucide-react';

/**
 * 👑 AYABUS REGISTRY CARD (Sovereign Edition)
 * ------------------------------------------------------------------
 * Represents a single partner asset. 
 * Purely presentational, but handles complex visual states 
 * (like the 'Ghosted' suspension look) automatically.
 */

const RegistryCard = ({ partner, onClick }) => {
  const isSuspended = partner.status === 'SUSPENDED';

  // HELPER: Sovereign Status Colors
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

  return (
    <div 
      onClick={onClick}
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
        marginBottom: '16px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        // The Ghost Effect for Suspended items
        opacity: isSuspended ? 0.65 : 1,
        filter: isSuspended ? 'grayscale(80%)' : 'none'
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.transform = 'translateY(-2px)'; 
        e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.05)';
        e.currentTarget.style.opacity = '1'; // Light up on hover
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.transform = 'translateY(0)'; 
        e.currentTarget.style.boxShadow = 'none'; 
        e.currentTarget.style.opacity = isSuspended ? '0.65' : '1';
      }}
    >
      
      {/* COL 1: IDENTITY */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>
            {partner.company_name}
          </h3>
          
          {/* STATUS BADGES */}
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
          <span style={{ background: 'var(--bg-canvas)', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace', letterSpacing: '0.5px', border: '1px solid var(--border-subtle)' }}>
            {partner.partner_id}
          </span>
          <span>Added: {safeDate(partner.created_at)}</span>
        </div>
      </div>

      {/* COL 2: ASSETS */}
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

      {/* COL 3: STATUS INDICATOR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck size={16} color={getStatusColor(partner.status)} />
        <span style={{ fontSize: '12px', fontWeight: '800', color: getStatusColor(partner.status), textTransform: 'uppercase' }}>
          {(partner.status || 'UNKNOWN').replace('_', ' ')}
        </span>
      </div>

      {/* COL 4: ACTIONS KEBAB */}
      <button 
        style={{ 
          background: 'transparent', border: 'none', color: 'var(--text-muted)', 
          cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' 
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-subtle)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <MoreVertical size={18} />
      </button>

    </div>
  );
};

export default RegistryCard;
