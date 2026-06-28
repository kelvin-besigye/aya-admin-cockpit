import React from 'react';
import { Bus, ArrowRight, LayoutGrid, Clock, DoorOpen, Navigation } from 'lucide-react';
import {
  formatBusTitle,
  formatPlateNumber,
  getBusClassColor,
  getStatusConfig,
} from '../../utils/bus.utils';

/**
 * BUS CONFIGURATION CARD (The Child Item) — v2 Chassis Grammar
 * ------------------------------------------------------------------
 * Updates:
 *  1. ORIENTATION ICONS — tiny driver-side and entrance-row indicators
 *     so operators see bus orientation at a glance without opening it.
 *  2. PENDING STATE — yellow dashed border + clock icon.
 *  3. SMART TEXT — clean title and plate via utilities.
 *  4. IMAGE FIX — handles both stored URLs and live preview objects.
 */

// ── Small inline orientation tag ─────────────────────────────────────────────
const MiniTag = ({ icon: Icon, label, color }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 3,
    fontSize: 9, fontWeight: 800,
    color: color,
    background: `${color}14`,
    border: `1px solid ${color}30`,
    padding: '2px 6px', borderRadius: 20,
    letterSpacing: '0.2px', whiteSpace: 'nowrap',
  }}>
    {Icon && <Icon size={9} />}
    {label}
  </span>
);

// ── Main component ────────────────────────────────────────────────────────────
const BusConfigCard = ({ config, onClick }) => {

  // ── Formatting ──
  const title      = formatBusTitle(config);
  const plate      = formatPlateNumber(config.plate_number);
  const statusInfo = getStatusConfig(config.status);
  const borderLeftColor = getBusClassColor(config.bus_class);
  const isPending  = config.status === 'PENDING_APPROVAL';

  // ── Image ──
  const profileImage = config.gallery?.profile;
  const imageSrc = typeof profileImage === 'string'
    ? profileImage
    : profileImage?.preview;

  // ── v2 Orientation fields ──
  const layout      = config.layout_config || {};
  const driverPos   = layout.driver_position || 'RIGHT';
  const entranceSide = layout.entrance_side  || 'NONE';
  const entranceRow  = layout.entrance_row   ?? null;
  const hasEntrance  = entranceSide !== 'NONE';
  const totalSeats   = layout.total_seats   ?? config.capacity ?? 0;
  const totalRows    = layout.total_rows    ?? 0;

  return (
    <div
      onClick={onClick}
      className="citadel-card-hover"
      style={{
        padding: '12px 16px',
        border: isPending
          ? '1px dashed var(--status-warning)'
          : '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${borderLeftColor}`,
        borderRadius: 8,
        background: 'var(--bg-surface)',
        opacity: isPending ? 0.92 : 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        marginLeft: 12,
      }}
    >

      {/* A. LEFT — IDENTITY */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>

        {/* Thumbnail / Bus icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 6, flexShrink: 0,
          background: 'var(--bg-input)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', border: '1px solid var(--border-subtle)',
        }}>
          {imageSrc ? (
            <img src={imageSrc} alt="Bus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Bus size={18} color="var(--text-muted)" />
          )}
        </div>

        {/* Title + meta */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: 'var(--text-main)',
            marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6,
            flexWrap: 'wrap',
          }}>
            {title}
            {isPending && <Clock size={11} color="var(--status-warning)" />}
          </div>

          {/* Class + plate */}
          <div style={{
            fontSize: 11, color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          }}>
            <span style={{ fontWeight: 700, color: borderLeftColor, fontSize: 10, letterSpacing: '0.5px' }}>
              {config.bus_class}
            </span>
            {plate && (
              <>
                <span>·</span>
                <span style={{ fontFamily: 'monospace', background: 'var(--bg-input)', padding: '0 4px', borderRadius: 4 }}>
                  {plate}
                </span>
              </>
            )}
          </div>

          {/* ── ORIENTATION TAGS — the v2 addition ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
            <MiniTag
              icon={Navigation}
              label={`Driver ${driverPos}`}
              color="#1E40AF"
            />
            {hasEntrance && (
              <MiniTag
                icon={DoorOpen}
                label={`Entry R${entranceRow} · ${entranceSide}`}
                color="#16A34A"
              />
            )}
            {layout.has_rear_bench && (
              <MiniTag
                label="M Bench"
                color="#D97706"
              />
            )}
          </div>
        </div>
      </div>

      {/* B. RIGHT — STATS + STATUS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>

        {/* Seat/Row count */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text-main)',
            display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end',
          }}>
            <LayoutGrid size={12} color="var(--text-muted)" />
            {totalRows} Rows
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {totalSeats} Seats
          </div>
        </div>

        {/* Status badge */}
        <span style={{
          fontSize: 10, fontWeight: 700,
          background: statusInfo.bg, color: statusInfo.color,
          padding: '4px 8px', borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 4,
          whiteSpace: 'nowrap',
        }}>
          {statusInfo.label}
        </span>

        <ArrowRight size={14} color="var(--text-muted)" />
      </div>

    </div>
  );
};

export default BusConfigCard;
