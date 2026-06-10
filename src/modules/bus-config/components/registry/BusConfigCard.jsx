import React from 'react';
import { Bus, ArrowRight, LayoutGrid, Clock } from 'lucide-react'; // Added Clock
import { 
  formatBusTitle, 
  formatPlateNumber, 
  getBusClassColor, 
  getStatusConfig 
} from '../../utils/bus.utils';

/**
 * BUS CONFIGURATION CARD (The Child Item)
 * ------------------------------------------------------------------
 * Displays a single bus profile in the registry list.
 * * * WORLD CLASS UPDATES:
 * 1. PENDING STATE: Distinct Yellow/Dashed border for items under review.
 * 2. SMART TEXT: Uses utilities to clean up "Blueprint" and "TBA" noise.
 * 3. IMAGE FIX: Handles both stored URLs and live preview objects.
 */

const BusConfigCard = ({ config, onClick }) => {
  
  // 1. DATA FORMATTING
  const title = formatBusTitle(config);
  const plate = formatPlateNumber(config.plate_number);
  const statusInfo = getStatusConfig(config.status);
  const borderLeftColor = getBusClassColor(config.bus_class);
  
  // 2. STATUS CHECK
  const isPending = config.status === 'PENDING_APPROVAL';

  // 3. IMAGE RESOLVER
  const profileImage = config.gallery?.profile;
  const imageSrc = typeof profileImage === 'string' 
    ? profileImage 
    : profileImage?.preview;

  return (
    <div 
      onClick={onClick}
      className="citadel-card-hover"
      style={{ 
        padding: '12px 16px', 
        // === THE VISUAL FIX ===
        // If Pending: Dashed Yellow Border. If Active: Solid Subtle Border.
        border: isPending ? '1px dashed var(--status-warning)' : '1px solid var(--border-subtle)',
        borderRadius: '8px', 
        background: isPending ? 'var(--bg-surface)' : 'var(--bg-surface)', 
        opacity: isPending ? 0.9 : 1, // Slight fade for pending items
        cursor: 'pointer',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        marginLeft: '12px', 
        borderLeft: `3px solid ${borderLeftColor}` 
      }}
    >
      
      {/* A. LEFT: IDENTITY */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Icon / Thumbnail */}
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '6px', 
          background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', border: '1px solid var(--border-subtle)'
        }}>
          {imageSrc ? (
            <img src={imageSrc} alt="Bus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Bus size={18} color="var(--text-muted)" />
          )}
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {title}
            {isPending && <Clock size={12} color="var(--status-warning)" />} {/* Tiny indicator */}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Class Badge */}
            <span style={{ 
              fontWeight: '700', 
              color: borderLeftColor,
              fontSize: '10px',
              letterSpacing: '0.5px' 
            }}>
              {config.bus_class}
            </span>

            {plate && (
              <>
                <span>•</span>
                <span style={{ fontFamily: 'monospace', background: 'var(--bg-input)', padding: '0 4px', borderRadius: '4px' }}>
                  {plate}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* B. RIGHT: STATS & ACTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Capacity Summary (Desktop Only) */}
        <div style={{ textAlign: 'right', display: 'none', md: 'block' }}> 
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <LayoutGrid size={12} color="var(--text-muted)" /> 
            {config.layout_config?.total_rows || 0} Rows
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
             ~{config.layout_config?.total_seats || 0} Seats
          </div>
        </div>

        {/* Status Badge */}
        <span style={{ 
          fontSize: '10px', fontWeight: '700', 
          background: statusInfo.bg, color: statusInfo.color,
          padding: '4px 8px', borderRadius: '6px',
          display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          {statusInfo.label}
        </span>

        <ArrowRight size={14} color="var(--text-muted)" />
      </div>

    </div>
  );
};

export default BusConfigCard;