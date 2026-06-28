import React, { useMemo, useState } from 'react';
import {
  X, Edit, Trash2, ShieldCheck,
  MonitorPlay, LayoutGrid, Image as ImageIcon,
  Calendar, Loader, DoorOpen, Users,
  Navigation, Armchair, Accessibility,
} from 'lucide-react';
import ChassisCanvas from '../designer/ChassisCanvas';
import { BUS_AMENITIES } from '../../data/bus.constants';
import { busService } from '../../data/bus.service';
import { calculateSeatCount } from '../../data/bus.adapters';

import {
  formatBusTitle,
  formatPlateNumber,
  getBusClassColor,
} from '../../utils/bus.utils';

/**
 * BUS DETAIL VIEW (The Passport) — v2 Chassis Grammar
 * ------------------------------------------------------------------
 * New in this revision:
 *  - Chassis section now shows a full "Orientation Breakdown" widget
 *    with driver side, entrance row/side, bench type, conductor seats,
 *    and accessible seat — all pulled from layout_config.
 *  - Capacity tag shows exact calculated seat count from v2 adapter.
 *  - Orientation mini-badges shown next to the chassis section header.
 */

// ── Small orientation pill badge ─────────────────────────────────────────────
const OrientationBadge = ({ label, color = '#1E40AF' }) => (
  <span style={{
    fontSize: 10, fontWeight: 800,
    color: color,
    background: `${color}15`,
    border: `1px solid ${color}35`,
    padding: '3px 10px', borderRadius: 20,
    letterSpacing: '0.3px', whiteSpace: 'nowrap',
  }}>
    {label}
  </span>
);

// ── Breakdown row inside the capacity widget ──────────────────────────────────
const BreakdownRow = ({ icon: Icon, label, value, muted = false }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '9px 0',
    borderBottom: '1px solid var(--border-subtle)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon size={13} color={muted ? 'var(--text-muted)' : 'var(--brand-primary)'} />
      <span style={{ fontSize: 12, color: muted ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: 600 }}>
        {label}
      </span>
    </div>
    <span style={{
      fontSize: 12, fontWeight: 800,
      color: muted ? 'var(--text-muted)' : 'var(--text-main)',
      fontFamily: 'monospace',
    }}>
      {value}
    </span>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const BusDetailView = ({ config, onClose, onEdit }) => {

  const [isDeleting, setIsDeleting]           = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!config) return null;

  // ── Data extraction ──
  const layout     = config.layout_config || config.layout || {};
  const gallery    = config.gallery       || {};
  const amenityIds = config.amenities     || [];

  const displayTitle = formatBusTitle(config);
  const displayPlate = formatPlateNumber(config.plate_number);
  const badgeColor   = getBusClassColor(config.bus_class);

  // ── v2 fields ──
  const driverPos    = layout.driver_position  || 'RIGHT';
  const entranceSide = layout.entrance_side    || 'NONE';
  const entranceRow  = layout.entrance_row     ?? 1;
  const hasEntrance  = entranceSide !== 'NONE';
  const hasBench     = !!layout.has_rear_bench;
  const benchPos     = layout.bench_position   || 'MIDDLE';
  const conductors   = layout.conductor_count  ?? 0;
  const has1X        = !!layout.has_invalid_seat;
  const totalRows    = layout.total_rows        ?? 0;
  const colsLeft     = layout.cols_left         ?? 0;
  const colsRight    = layout.cols_right        ?? 0;

  const exactSeats = useMemo(() => calculateSeatCount(layout), [layout]);

  // ── Amenities ──
  const activeAmenities = useMemo(() =>
    amenityIds.map(id => BUS_AMENITIES.find(a => a.id === id)).filter(Boolean),
  [amenityIds]);

  // ── Image helpers ──
  const getImageSrc = (imgSource) => {
    if (!imgSource) return null;
    if (typeof imgSource === 'string') return imgSource;
    if (imgSource.preview) return imgSource.preview;
    return null;
  };

  const profileSrc    = getImageSrc(gallery.profile);
  const galleryViews  = (gallery.views || []).map(getImageSrc).filter(Boolean);

  // ── Delete ──
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await busService.deleteBusConfig(config.id);
      window.dispatchEvent(new Event('citadel-bus-update'));
      onClose();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Could not delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>

      {/* ── HEADER ── */}
      <div style={{
        padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h2 className="text-heading" style={{ fontSize: 20, margin: 0, lineHeight: 1.2 }}>
              {displayTitle}
            </h2>
            <span style={{
              fontSize: 11, fontWeight: 800,
              color: '#fff', background: badgeColor,
              padding: '4px 10px', borderRadius: 12,
            }}>
              {config.bus_class}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {displayPlate && (
              <>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{displayPlate}</span>
                <span>•</span>
              </>
            )}
            <span>{config.partners?.company_name || 'Unknown Operator'}</span>
            <span>•</span>
            <span>{exactSeats} bookable seats</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onEdit(config)}
            className="citadel-btn-ghost"
            style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', border: '1px solid var(--brand-primary-subtle)' }}
          >
            <Edit size={14} style={{ marginRight: 6 }} /> Edit Configuration
          </button>
          <button
            onClick={onClose}
            className="citadel-btn-ghost"
            style={{ padding: 8, color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        className="citadel-scroll-area"
        style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: 40, overflowY: 'auto' }}
      >

        {/* SECTION A — VISUAL PROFILE */}
        <section>
          <h4 className="text-muted" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ImageIcon size={14} /> Visual Profile
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, height: 240 }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', position: 'relative' }}>
              {profileSrc ? (
                <img src={profileSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  No Cover Image
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                MAIN PROFILE
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {galleryViews.slice(0, 2).map((src, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}>
                  <img src={src} alt={`View ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              {galleryViews.length === 0 && (
                <div style={{ flex: 1, borderRadius: 12, border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
                  No Gallery
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION B — CHASSIS */}
        <section>
          {/* Header row with orientation badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <h4 className="text-muted" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <LayoutGrid size={14} /> Chassis Layout
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <OrientationBadge label={`Driver ${driverPos}`} color="#1E40AF" />
              {hasEntrance && <OrientationBadge label={`Entry Row ${entranceRow} · ${entranceSide}`} color="#16A34A" />}
              {hasBench     && <OrientationBadge label={`M Bench · ${benchPos}`} color="#D97706" />}
              {conductors > 0 && <OrientationBadge label={`${conductors} Conductor${conductors > 1 ? 's' : ''}`} color="#7C3AED" />}
              {has1X        && <OrientationBadge label="1X Accessible" color="#B45309" />}
            </div>
          </div>

          {/* Two-col: canvas left, breakdown right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

            {/* Canvas */}
            <div style={{
              background: 'var(--bg-canvas)', borderRadius: 16, padding: 24,
              border: '1px solid var(--border-subtle)',
              display: 'flex', justifyContent: 'center', overflow: 'hidden',
            }}>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                <ChassisCanvas layout={layout} />
              </div>
            </div>

            {/* Capacity Breakdown Widget */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16, padding: '20px 20px 12px',
            }}>
              {/* Big seat count */}
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid var(--brand-primary)' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                  Capacity
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--brand-primary)', letterSpacing: '-1px', lineHeight: 1 }}>
                  {exactSeats}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>bookable seats</div>
              </div>

              {/* Breakdown rows */}
              <BreakdownRow icon={LayoutGrid}    label="Total Rows"    value={`${totalRows}`} />
              <BreakdownRow icon={LayoutGrid}    label="Columns"       value={`${colsLeft} + ${colsRight}`} />
              <BreakdownRow icon={Navigation}    label="Driver Side"   value={driverPos} />
              {hasEntrance && (
                <BreakdownRow icon={DoorOpen} label="Entrance" value={`Row ${entranceRow} · ${entranceSide}`} />
              )}
              <BreakdownRow
                icon={Armchair}
                label="Rear Bench"
                value={hasBench ? `Yes · ${benchPos}` : 'None'}
                muted={!hasBench}
              />
              <BreakdownRow
                icon={Users}
                label="Conductors"
                value={conductors > 0 ? `${conductors} (${layout.conductor_side || 'LEFT'})` : 'None'}
                muted={conductors === 0}
              />
              <BreakdownRow
                icon={Accessibility}
                label="1X Accessible"
                value={has1X ? `Yes · ${layout.invalid_seat_side || 'LEFT'}` : 'None'}
                muted={!has1X}
              />
            </div>
          </div>
        </section>

        {/* SECTION C — AMENITIES */}
        <section>
          <h4 className="text-muted" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MonitorPlay size={14} /> On-Board Features
          </h4>
          {activeAmenities.length === 0 ? (
            <div style={{ padding: 20, border: '1px dashed var(--border-subtle)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              No specific amenities listed for this vehicle.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {activeAmenities.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} color="var(--brand-primary)" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 24, marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 24, fontSize: 11, color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={12} /> Created: {new Date(config.created_at || Date.now()).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={12} /> Status: {config.status}
            </div>
          </div>
          <div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="citadel-btn-ghost"
                style={{ color: 'var(--status-danger)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={14} /> Delete Configuration
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', padding: '4px 8px', borderRadius: 8, border: '1px solid #FCA5A5' }}>
                <span style={{ color: '#B91C1C', fontSize: 11, fontWeight: 700 }}>Are you sure?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ border: 'none', background: '#DC2626', color: '#fff', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {isDeleting ? <Loader size={10} className="animate-spin" /> : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ border: 'none', background: 'transparent', color: '#7F1D1D', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusDetailView;
