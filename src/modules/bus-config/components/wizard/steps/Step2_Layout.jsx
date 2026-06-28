import React from 'react';
// No lucide icons rendered directly in this file —
// icon rendering is handled inside ChassisCanvas, StepperRow, and ToggleRow sub-components.
import ChassisCanvas from '../../designer/ChassisCanvas';
import {
  CHASSIS_CONSTRAINTS,
  DRIVER_POSITION_OPTIONS,
  ENTRANCE_SIDE_OPTIONS,
  REAR_BENCH_POSITION_OPTIONS,
  CONDUCTOR_COUNT_OPTIONS,
  CONDUCTOR_SIDE_OPTIONS,
  INVALID_SEAT_OPTIONS,
} from '../../../data/bus.constants';
import { calculateSeatCount } from '../../../data/bus.adapters';

/**
 * WIZARD STEP 2: CHASSIS LAYOUT (v2 — Full Designer)
 * ------------------------------------------------------------------
 * Controls:
 *   1. Total Rows (stepper)
 *   2. Cols Left / Cols Right (steppers)
 *   3. Driver Position — segmented LEFT | RIGHT
 *   4. Entrance Side — segmented NONE | LEFT | RIGHT
 *   5. Entrance Row — stepper (only active when entrance !== NONE)
 *   6. Rear Bench — toggle + position MIDDLE | RIGHT (legacy)
 *   7. Conductor Seats — counter 0 | 1 | 2 + side LEFT | RIGHT
 *   8. Invalid/Wheelchair (1X) — toggle + side
 *
 * Live Preview Stats: bookable seat count, config summary
 * Live ChassisCanvas preview updates on every change.
 */

// ─── Reusable Segmented Toggle ────────────────────────────────────────────────
const SegmentedToggle = ({ options, value, onChange, disabled = false }) => (
  <div style={{
    display: 'inline-flex',
    background: 'var(--bg-canvas)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 10,
    padding: 3,
    gap: 2,
    opacity: disabled ? 0.4 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  }}>
    {options.map(opt => {
      const active = opt.id === value;
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          style={{
            padding: '6px 14px',
            borderRadius: 7,
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.3px',
            background: active ? 'var(--brand-primary)' : 'transparent',
            color: active ? '#fff' : 'var(--text-muted)',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

// ─── Reusable Stepper Row ─────────────────────────────────────────────────────
const StepperRow = ({ label, sublabel, value, onDecrement, onIncrement, disabled = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 10,
    opacity: disabled ? 0.4 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sublabel}</div>}
    </div>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--bg-canvas)', padding: '3px', borderRadius: 8,
      border: '1px solid var(--border-subtle)',
    }}>
      <button
        type="button"
        onClick={onDecrement}
        style={{
          width: 30, height: 30, border: 'none', borderRadius: 6,
          background: 'var(--bg-surface)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: 'var(--text-main)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }}
      >−</button>
      <span style={{
        minWidth: 24, textAlign: 'center',
        fontSize: 15, fontWeight: 800, color: 'var(--text-main)',
      }}>{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        style={{
          width: 30, height: 30, border: 'none', borderRadius: 6,
          background: 'var(--bg-surface)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: 'var(--text-main)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }}
      >+</button>
    </div>
  </div>
);

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 800, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '1px',
    marginBottom: 10, marginTop: 4,
  }}>
    {children}
  </div>
);

// ─── Toggle Row ───────────────────────────────────────────────────────────────
const ToggleRow = ({ label, sublabel, checked, onChange, accent = false }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
      background: 'var(--bg-surface)',
      border: checked && accent
        ? '1px solid var(--brand-primary)'
        : '1px solid var(--border-subtle)',
      transition: 'border-color 0.18s',
    }}
  >
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sublabel}</div>}
    </div>
    {/* pill toggle */}
    <div style={{
      width: 40, height: 22, borderRadius: 20,
      background: checked ? 'var(--brand-primary)' : 'var(--border-subtle)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3,
        left: checked ? 21 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.20)',
      }} />
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Step2_Layout = ({ data, onChange }) => {

  const layout = data?.layout || {
    total_rows: 11, cols_left: 2, cols_right: 3,
    has_rear_bench: true, bench_position: 'MIDDLE',
    driver_position: 'RIGHT',
    entrance_side: 'NONE', entrance_row: 1,
    conductor_count: 0, conductor_side: 'LEFT',
    has_invalid_seat: false, invalid_seat_side: 'LEFT',
  };

  // ── Generic field updater ──
  const set = (field, value) => {
    onChange({ ...data, layout: { ...layout, [field]: value } });
  };

  // ── Numeric stepper with constraints ──
  const step = (field, delta, min, max) => {
    const next = (layout[field] ?? 0) + delta;
    if (next < min || next > max) return;
    set(field, next);
  };

  const hasEntrance = layout.entrance_side !== 'NONE';
  const seatCount   = calculateSeatCount(layout);

  // ── Collision detection: same side, same row ──
  const collisionWarning =
    hasEntrance &&
    layout.entrance_row === 1 &&
    layout.entrance_side === layout.driver_position;

  // ── Live stats summary ──
  const conductors = layout.conductor_count || 0;
  const has1X      = !!layout.has_invalid_seat;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '420px 1fr',
      gap: 32,
      height: '100%',
      minHeight: 0,
    }}>

      {/* ══════════════════════════════════════════
          LEFT PANEL — CONTROLS
      ══════════════════════════════════════════ */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 20,
        overflowY: 'auto', paddingRight: 4,
      }}>

        {/* ── LIVE STATS BADGE ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-primary) 0%, color-mix(in srgb, var(--brand-primary) 70%, #000) 100%)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 16px color-mix(in srgb, var(--brand-primary) 25%, transparent)',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Bookable Seats
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1 }}>
              {seatCount}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
              {layout.total_rows} rows ·{' '}
              {layout.cols_left}+{layout.cols_right} cols ·{' '}
              Driver {layout.driver_position}{' '}
              {hasEntrance ? `· Entry row ${layout.entrance_row} ${layout.entrance_side}` : ''}{' '}
              {conductors > 0 ? `· ${conductors} SS` : ''}{' '}
              {has1X ? '· 1X' : ''}{' '}
              {layout.has_rear_bench ? '· M bench' : ''}
            </div>
          </div>
          <div style={{
            fontSize: 48, opacity: 0.15, fontWeight: 900, color: '#fff',
            userSelect: 'none', lineHeight: 1,
          }}>⊞</div>
        </div>

        {collisionWarning && (
          <div style={{
            padding: '10px 14px',
            background: 'color-mix(in srgb, #EF4444 10%, transparent)',
            border: '1px solid #EF4444',
            borderRadius: 8, fontSize: 12, color: '#EF4444', fontWeight: 600,
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span style={{ flexShrink: 0 }}>⚠</span>
            Driver and entrance are on the same side of row 1. Move the entrance to a different row or opposite side.
          </div>
        )}

        {/* ─── 1. DIMENSIONS ─── */}
        <div>
          <SectionLabel>Dimensions</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <StepperRow
              label="Total Rows"
              sublabel={`Min ${CHASSIS_CONSTRAINTS.MIN_ROWS} · Max ${CHASSIS_CONSTRAINTS.MAX_ROWS}`}
              value={layout.total_rows}
              onDecrement={() => step('total_rows', -1, CHASSIS_CONSTRAINTS.MIN_ROWS, CHASSIS_CONSTRAINTS.MAX_ROWS)}
              onIncrement={() => step('total_rows',  1, CHASSIS_CONSTRAINTS.MIN_ROWS, CHASSIS_CONSTRAINTS.MAX_ROWS)}
            />
            <StepperRow
              label="Left-Side Columns"
              sublabel="Seats to the left of the aisle"
              value={layout.cols_left}
              onDecrement={() => step('cols_left', -1, CHASSIS_CONSTRAINTS.MIN_COLS, CHASSIS_CONSTRAINTS.MAX_COLS)}
              onIncrement={() => step('cols_left',  1, CHASSIS_CONSTRAINTS.MIN_COLS, CHASSIS_CONSTRAINTS.MAX_COLS)}
            />
            <StepperRow
              label="Right-Side Columns"
              sublabel="Seats to the right of the aisle"
              value={layout.cols_right}
              onDecrement={() => step('cols_right', -1, CHASSIS_CONSTRAINTS.MIN_COLS, CHASSIS_CONSTRAINTS.MAX_COLS)}
              onIncrement={() => step('cols_right',  1, CHASSIS_CONSTRAINTS.MIN_COLS, CHASSIS_CONSTRAINTS.MAX_COLS)}
            />
          </div>
        </div>

        {/* ─── 2. DRIVER POSITION ─── */}
        <div>
          <SectionLabel>Driver Position</SectionLabel>
          <div style={{
            padding: '14px 16px', background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Steering Wheel Side</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                That side of row 1 becomes driver-only. Uganda standard is Right.
              </div>
            </div>
            <SegmentedToggle
              options={DRIVER_POSITION_OPTIONS}
              value={layout.driver_position}
              onChange={v => set('driver_position', v)}
            />
          </div>
        </div>

        {/* ─── 3. ENTRANCE / DOOR ─── */}
        <div>
          <SectionLabel>Passenger Entrance</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* Side */}
            <div style={{
              padding: '14px 16px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>Door Side</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  That side of the entrance row becomes an empty entry zone.
                </div>
              </div>
              <SegmentedToggle
                options={ENTRANCE_SIDE_OPTIONS}
                value={layout.entrance_side}
                onChange={v => set('entrance_side', v)}
              />
            </div>

            {/* Row */}
            <StepperRow
              label="Entrance Row"
              sublabel={hasEntrance
                ? (layout.entrance_row === 1 ? 'Row 1 — same row as driver' : `Row ${layout.entrance_row}`)
                : 'Enable an entrance side first'}
              value={layout.entrance_row}
              onDecrement={() => step('entrance_row', -1, 1, layout.total_rows)}
              onIncrement={() => step('entrance_row',  1, 1, layout.total_rows)}
              disabled={!hasEntrance}
            />
          </div>
        </div>

        {/* ─── 4. REAR BENCH ─── */}
        <div>
          <SectionLabel>Rear Bench Seat</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ToggleRow
              label='Rear "M" Bench'
              sublabel={layout.has_rear_bench ? 'Adds 1 bookable seat in the last row' : 'Last row is standard'}
              checked={!!layout.has_rear_bench}
              onChange={v => set('has_rear_bench', v)}
              accent
            />
            {layout.has_rear_bench && (
              <div style={{
                padding: '12px 16px', background: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Bench Position</div>
                <SegmentedToggle
                  options={REAR_BENCH_POSITION_OPTIONS}
                  value={layout.bench_position || 'MIDDLE'}
                  onChange={v => set('bench_position', v)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ─── 5. CONDUCTOR SEATS ─── */}
        <div>
          <SectionLabel>Conductor Seats (SS)</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <StepperRow
              label="Conductor Count"
              sublabel="Staff seats placed in row 1 (SS1, SS2)"
              value={layout.conductor_count || 0}
              onDecrement={() => step('conductor_count', -1, CHASSIS_CONSTRAINTS.MIN_CONDUCTORS, CHASSIS_CONSTRAINTS.MAX_CONDUCTORS)}
              onIncrement={() => step('conductor_count',  1, CHASSIS_CONSTRAINTS.MIN_CONDUCTORS, CHASSIS_CONSTRAINTS.MAX_CONDUCTORS)}
            />
            {(layout.conductor_count || 0) > 0 && (
              <div style={{
                padding: '12px 16px', background: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Conductor Side</div>
                <SegmentedToggle
                  options={CONDUCTOR_SIDE_OPTIONS}
                  value={layout.conductor_side || 'LEFT'}
                  onChange={v => set('conductor_side', v)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ─── 6. INVALID / WHEELCHAIR SEAT ─── */}
        <div>
          <SectionLabel>Accessible / Reserved Seat (1X)</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ToggleRow
              label="Include 1X Seat"
              sublabel={layout.has_invalid_seat ? 'Wheelchair / reserved slot in row 1' : 'No accessible slot'}
              checked={!!layout.has_invalid_seat}
              onChange={v => set('has_invalid_seat', v)}
            />
            {layout.has_invalid_seat && (
              <div style={{
                padding: '12px 16px', background: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>1X Side</div>
                <SegmentedToggle
                  options={[
                    { id: 'LEFT',  label: 'Left' },
                    { id: 'RIGHT', label: 'Right' },
                  ]}
                  value={layout.invalid_seat_side || 'LEFT'}
                  onChange={v => set('invalid_seat_side', v)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Info note */}
        <div style={{
          padding: '12px 14px',
          background: 'rgba(59,130,246,0.05)',
          border: '1px solid rgba(59,130,246,0.18)',
          borderRadius: 8, fontSize: 11,
          color: 'var(--brand-primary)', lineHeight: 1.55,
          display: 'flex', gap: 8,
        }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>ℹ</span>
          <span>
            Columns use letters A–Z (skipping I and O). Rows are numbered 1–{layout.total_rows}.
            The seat count above is exactly what passengers can book.
          </span>
        </div>

      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — LIVE PREVIEW
      ══════════════════════════════════════════ */}
      <div style={{
        background: 'var(--bg-input)',
        borderRadius: 16,
        border: '1px dashed var(--border-subtle)',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        overflowY: 'auto',
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '1.5px',
        }}>
          Live Chassis Preview
        </div>

        {/* Live orientation summary bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
        }}>
          {[
            { label: `Driver ${layout.driver_position}`, color: '#1E40AF' },
            hasEntrance && { label: `Entry Row ${layout.entrance_row} ${layout.entrance_side}`, color: '#16A34A' },
            layout.has_rear_bench && { label: 'M Bench', color: '#D97706' },
            conductors > 0 && { label: `${conductors} SS (${layout.conductor_side})`, color: '#7C3AED' },
            has1X && { label: `1X (${layout.invalid_seat_side})`, color: '#B45309' },
          ].filter(Boolean).map((tag, i) => (
            <span key={i} style={{
              fontSize: 10, fontWeight: 800,
              color: tag.color,
              background: `${tag.color}18`,
              border: `1px solid ${tag.color}40`,
              padding: '3px 10px', borderRadius: 20,
              letterSpacing: '0.3px',
            }}>
              {tag.label}
            </span>
          ))}
        </div>

        <ChassisCanvas layout={layout} />
      </div>

    </div>
  );
};

export default Step2_Layout;
