import React, { useState } from 'react';
import { ChevronRight, Bus, Ticket, Star, ShieldAlert } from 'lucide-react';

// IMPORT LEVEL 1 & 2 DEPENDENCIES
import HealthBadge from '../primitives/HealthBadge';
import TierShield from '../primitives/TierShield';
import { formatPartnerId } from '../../data/partner.utils';

/**
 * 👑 PARTNER ROW (Level 4: Roster Atom - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: PartnerRow.jsx
 * * DESCRIPTION:
 * A high-density, strictly grid-aligned row representing a single Operator.
 * * UPGRADES:
 * - Anti-Squish Lock: Enforces a strict 1050px minimum width.
 * - CSS Grid Integrity: Uses minWidth: 0 on text containers to guarantee 
 * perfect ellipsis truncation for long operator names.
 * - Live Primitives: Injects the dynamic HealthBadge and TierShield.
 */

const PartnerRow = ({ 
  partner, 
  onClick // Triggers Level 5: Partner Profile & Yield Dossier
}) => {

  const [isHovered, setIsHovered] = useState(false);

  // ========================================================================
  // 1. DATA SAFEGUARDS & EXTRACTION
  // ========================================================================
  if (!partner) return null;

  const {
    id,
    companyName,
    fleetCode,
    metrics,
    healthScore,
    tier,
    activeBuses,
    openTickets
  } = partner;

  // Formatting helpers
  const formattedId = formatPartnerId(id);
  const isCriticalTicket = openTickets > 0;

  // ========================================================================
  // 2. RENDER ENGINE (Strict 1050px Grid Viewport)
  // ========================================================================
  return (
    <button
      onClick={() => onClick(partner)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        minWidth: '1050px', // THE CRITICAL UPGRADE: Prevents squishing on small screens
        display: 'grid',
        // STRICT CSS GRID: 2.5fr (Identity) | 1.5fr (Tier) | 1fr (Health) | 2fr (Metrics) | 1.5fr (Fleet/Issues) | 40px (Action)
        gridTemplateColumns: '2.5fr 1.5fr 1fr 2fr 1.5fr 40px', 
        alignItems: 'center',
        padding: '16px 24px', 
        background: isHovered ? 'var(--bg-hover)' : 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none',
        position: 'relative',
        fontFamily: 'inherit'
      }}
    >
      
      {/* --- KINETIC HOVER HIGHLIGHT --- */}
      {/* Links visually to their specific Tier color */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: isHovered ? tier.color : 'transparent',
        transition: 'background 0.2s ease',
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px'
      }} />

      {/* === COL 1: IDENTITY (COMPANY & CODE) === */}
      {/* minWidth: 0 is CRITICAL to allow text-overflow ellipsis to function inside CSS Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ 
            fontSize: '11px', fontWeight: '900', color: 'var(--brand-primary)', 
            background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
            padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px'
          }}>
            {fleetCode}
          </span>
          <span style={{ 
            fontSize: '14px', fontWeight: '800', color: 'var(--text-main)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
          }}>
            {companyName}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '600' }}>
          {formattedId}
        </span>
      </div>

      {/* === COL 2: SOVEREIGN TIER === */}
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: '16px', minWidth: 0 }}>
        <TierShield tierId={tier.id} size="sm" showLabel={true} />
      </div>

      {/* === COL 3: ALGORITHMIC HEALTH SCORE === */}
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: '16px' }}>
        <HealthBadge score={healthScore} size="sm" />
      </div>

      {/* === COL 4: OPERATIONAL TELEMETRY === */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingRight: '16px', minWidth: 0 }}>
        {/* On-Time Stat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>On-Time</span>
          <span style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>
            {metrics.onTimePct.toFixed(1)}%
          </span>
        </div>
        {/* Rating Stat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={10} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)' }}>
              {metrics.passengerRating.toFixed(1)}
            </span>
          </div>
        </div>
        {/* Cancel Stat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cancels</span>
          <span style={{ 
            fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', 
            color: metrics.cancellationPct > 5 ? 'var(--status-danger)' : 'var(--text-main)' 
          }}>
            {metrics.cancellationPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* === COL 5: FLEET SIZE & OPEN RESOLUTIONS === */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '16px', minWidth: 0 }}>
        {/* Active Buses */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bus size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-main)' }}>
            {activeBuses}
          </span>
        </div>
        
        {/* Resolution Tickets Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px 8px', borderRadius: '100px',
          background: isCriticalTicket ? 'color-mix(in srgb, var(--status-danger) 10%, transparent)' : 'var(--bg-input)',
          border: `1px solid ${isCriticalTicket ? 'color-mix(in srgb, var(--status-danger) 20%, transparent)' : 'var(--border-subtle)'}`,
          transition: 'all 0.2s ease'
        }}>
          {isCriticalTicket ? <ShieldAlert size={12} color="var(--status-danger)" /> : <Ticket size={12} color="var(--text-muted)" />}
          <span style={{ 
            fontSize: '11px', fontWeight: '800', fontFamily: 'monospace',
            color: isCriticalTicket ? 'var(--status-danger)' : 'var(--text-muted)'
          }}>
            {openTickets > 0 ? `${openTickets} Open` : 'Clear'}
          </span>
        </div>
      </div>

      {/* === COL 6: ACTION INDICATOR === */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: isHovered ? 'var(--bg-input)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}>
          <ChevronRight 
            size={18} 
            color={isHovered ? tier.color : 'var(--border-subtle)'} // Lights up with their Tier Color
            style={{ 
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)', 
              transition: 'all 0.2s ease' 
            }} 
          />
        </div>
      </div>

    </button>
  );
};

export default PartnerRow;