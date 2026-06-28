import React, { useMemo } from 'react';
import SeatIcon from './SeatIcon';

/**
 * CHASSIS CANVAS (Admin Cockpit — Visual Engine)
 * ------------------------------------------------------------------
 * Renders the bus layout using the v2 PROVEN buildChassisRows algorithm.
 * This file is the SOURCE OF TRUTH for the chassis grammar.
 *
 * Both Partner Portal's SeatMatrix and Consumer Web's ChassisGrid MUST
 * export the same buildChassisRows signature — they're siblings.
 *
 * v2 grammar additions:
 *   - driver_position: 'LEFT' | 'RIGHT' (default RIGHT)
 *   - entrance_side:   'NONE' | 'LEFT' | 'RIGHT' (default NONE)
 *   - entrance_row:    1..total_rows (default 1)
 *   - bench_position:  'MIDDLE' | 'RIGHT' (default MIDDLE)
 *   - conductor_count: 0 | 1 | 2 (default 0)
 *   - conductor_side:  'LEFT' | 'RIGHT' (default LEFT)
 *   - has_invalid_seat: boolean (default false)
 *   - invalid_seat_side: 'LEFT' | 'RIGHT' (default LEFT)
 */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // skip I/O

/**
 * THE PROVEN ALGORITHM (v2).
 * Returns an array of { left: Slot[], middle: Slot[], right: Slot[], meta }.
 */
export function buildChassisRows(layout) {
  const {
    total_rows        = 11,
    cols_left         = 2,
    cols_right        = 3,
    has_rear_bench    = true,
    bench_position    = 'MIDDLE',
    driver_position   = 'RIGHT',
    entrance_side     = 'NONE',
    entrance_row      = 1,
    front_rows        = [],
    conductor_count   = 0,
    conductor_side    = 'LEFT',
    has_invalid_seat  = false,
    invalid_seat_side = 'LEFT',
  } = layout || {};

  const rows = [];
  let rowNumber = 1;
  let conductorCounter = 0;

  const isEntranceRow = (r) => entrance_side !== 'NONE' && r === entrance_row;
  const isDriverRow   = (r) => r === 1;

  // ── PASS 1 — front_rows legacy override ──
  for (const row of front_rows) {
    const leftArr  = Array.isArray(row.left)  ? row.left  : [];
    const rightArr = Array.isArray(row.right) ? row.right : [];

    const labelSlot = (slot, side) => {
      const width = side === 'left' ? cols_left : cols_right;
      if (slot.type === 'SEAT') {
        const letterIdx = (side === 'left' ? leftArr : rightArr)
          .slice(0, (side === 'left' ? leftArr : rightArr).indexOf(slot))
          .filter(s => s.type === 'SEAT').length;
        return {
          type: 'SEAT',
          label: `${rowNumber}${ALPHABET[letterIdx] || '?'}`,
          bookable: true,
        };
      }
      if (slot.type === 'CONDUCTOR') {
        conductorCounter++;
        return { type: 'CONDUCTOR', label: `SS${conductorCounter}`, bookable: false };
      }
      if (slot.type === 'DRIVER')  return { type: 'DRIVER',  label: null, bookable: false };
      if (slot.type === 'ENTRY')   return { type: 'ENTRY',   label: 'E',  bookable: false };
      if (slot.type === 'INVALID') return { type: 'INVALID', label: '1X', bookable: false };
      return { type: 'UNKNOWN', label: '?', bookable: false };
    };

    rows.push({
      left:    leftArr.map(s => labelSlot(s, 'left')),
      middle:  [{ type: 'AISLE', label: null, bookable: false }],
      right:   rightArr.map(s => labelSlot(s, 'right')),
      isFrontRow: true,
      isBench: false,
      isDriverRow: true,
      isEntranceRow: false,
    });
    rowNumber++;
  }

  // ── PASS 2 — generated rows ──
  const startRow = front_rows.length > 0 ? front_rows.length + 1 : 1;
  const totalToRender = Math.max(startRow - 1, total_rows);

  for (let r = startRow; r <= totalToRender; r++) {
    const isLast = r === totalToRender;
    const isBench = isLast && has_rear_bench;

    const isDriverR   = isDriverRow(r);
    const isEntranceR = isEntranceRow(r);
    const isCollision = isDriverR && isEntranceR;

    const left  = [];
    const right = [];
    const middle = [];

    // ── LEFT SIDE ──
    if (isCollision && entrance_side === 'LEFT') {
      // Driver wins the LEFT, entrance stays on RIGHT
      left.push({ type: 'DRIVER', label: null, bookable: false });
    } else if (isCollision && entrance_side !== 'LEFT') {
      // driver on right, entrance on left
      left.push({ type: 'ENTRY', label: 'E', bookable: false });
    } else if (isDriverR && driver_position === 'LEFT') {
      left.push({ type: 'DRIVER', label: null, bookable: false });
    } else if (isEntranceR && entrance_side === 'LEFT') {
      left.push({ type: 'ENTRY', label: 'E', bookable: false });
    } else if (r === 1 && front_rows.length === 0) {
      // Default front row LEFT — conductor + invalid + seats
      if (conductor_side === 'LEFT' && conductor_count > 0) {
        const maxC = Math.min(conductor_count, cols_left);
        for (let i = 0; i < maxC; i++) {
          left.push({ type: 'CONDUCTOR', label: `SS${++conductorCounter}`, bookable: false });
        }
      }
      if (has_invalid_seat && invalid_seat_side === 'LEFT' && left.length < cols_left) {
        left.push({ type: 'INVALID', label: '1X', bookable: false });
      }
      let letterIdx = left.filter(s => s.type === 'SEAT').length;
      while (left.length < cols_left) {
        left.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[letterIdx] || '?'}`, bookable: true });
        letterIdx++;
      }
    } else {
      // Normal row LEFT
      for (let c = 0; c < cols_left; c++) {
        left.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[c] || '?'}`, bookable: true });
      }
    }

    // ── RIGHT SIDE ──
    if (isCollision && entrance_side === 'RIGHT') {
      // Driver wins the RIGHT, entrance stays on LEFT
      right.push({ type: 'DRIVER', label: null, bookable: false });
    } else if (isCollision && entrance_side !== 'RIGHT') {
      right.push({ type: 'ENTRY', label: 'E', bookable: false });
    } else if (isDriverR && driver_position === 'RIGHT') {
      right.push({ type: 'DRIVER', label: null, bookable: false });
    } else if (isEntranceR && entrance_side === 'RIGHT') {
      right.push({ type: 'ENTRY', label: 'E', bookable: false });
    } else if (r === 1 && front_rows.length === 0) {
      // Default front row RIGHT
      if (conductor_side === 'RIGHT' && conductor_count > 0) {
        const maxC = Math.min(conductor_count, cols_right);
        for (let i = 0; i < maxC; i++) {
          right.push({ type: 'CONDUCTOR', label: `SS${++conductorCounter}`, bookable: false });
        }
      }
      if (has_invalid_seat && invalid_seat_side === 'RIGHT' && right.length < cols_right) {
        right.push({ type: 'INVALID', label: '1X', bookable: false });
      }
      let letterIdx = right.filter(s => s.type === 'SEAT').length;
      while (right.length < cols_right) {
        right.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[letterIdx] || '?'}`, bookable: true });
        letterIdx++;
      }
    } else {
      // Normal row RIGHT
      for (let c = 0; c < cols_right; c++) {
        right.push({ type: 'SEAT', label: `${rowNumber}${ALPHABET[c] || '?'}`, bookable: true });
      }
    }

    // ── MIDDLE COLUMN ──
    if (isBench && bench_position === 'MIDDLE') {
      middle.push({ type: 'REAR_MIDDLE', label: 'M', bookable: true });
    } else if (isBench && bench_position === 'RIGHT') {
      // Legacy: M on the right column. Rearrange right to put M as the only slot.
      right.length = 0;
      right.push({ type: 'REAR_MIDDLE', label: 'M', bookable: true });
      middle.push({ type: 'AISLE', label: null, bookable: false });
    } else {
      middle.push({ type: 'AISLE', label: null, bookable: false });
    }

    rows.push({
      left,
      middle,
      right,
      isFrontRow: r === 1 && front_rows.length === 0,
      isBench,
      isDriverRow: isDriverR,
      isEntranceRow: isEntranceR,
      rowNumber,
    });
    rowNumber++;
  }

  return rows;
}

// ── Maps a slot type → SeatIcon type prop ──
const slotTypeToIconType = (slot) => {
  switch (slot.type) {
    case 'SEAT':         return 'STANDARD';
    case 'CONDUCTOR':    return 'CONDUCTOR';
    case 'DRIVER':       return 'DRIVER';
    case 'ENTRY':        return 'ENTRY';
    case 'INVALID':      return 'INVALID';
    case 'REAR_MIDDLE':  return 'REAR_MIDDLE';
    default:             return 'STANDARD';
  }
};

// ── COMPONENT ──
const ChassisCanvas = ({
  layout,
  onSeatClick,
  highlightSeat,
  small = false,
}) => {
  const rows = useMemo(() => buildChassisRows(layout || {}), [layout]);

  const colsLeft  = layout?.cols_left  ?? 2;
  const colsRight = layout?.cols_right ?? 3;

  // gridTemplate: `1fr 1fr ... {aisle} 1fr 1fr 1fr`
  const seatTemplate = (() => {
    const left  = '1fr '.repeat(colsLeft).trim();
    const right = '1fr '.repeat(colsRight).trim();
    return `${left} 44px ${right}`;
  })();

  const seatSize = small ? 32 : 40;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: small ? '20px' : '40px',
        background: 'var(--bg-canvas)',
        borderRadius: 16,
        border: '1px solid var(--border-subtle)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)',
        minHeight: small ? 240 : 500,
        overflowY: 'auto',
      }}
    >
      {/* THE BUS BODY */}
      <div
        style={{
          width: '100%',
          maxWidth: small ? 280 : 460,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: '40px 40px 12px 12px',
          border: '3px solid var(--text-main)',
          padding: small ? '16px 12px' : '30px 20px',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        }}
      >
        {/* Windshield glare */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 20,
            right: 20,
            height: 15,
            background:
              'linear-gradient(180deg, rgba(200,230,255,0.55), transparent)',
            borderRadius: 20,
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: small ? 8 : 12 }}>
          {rows.map((row, rowIdx) => {
            const isBench = row.isBench;
            const allSlots = [...row.left, ...row.middle, ...row.right];

            return (
              <div
                key={`row-${rowIdx}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: seatTemplate,
                  gap: small ? 4 : 6,
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {allSlots.map((slot, si) => {
                  if (slot.type === 'AISLE') {
                    return (
                      <div
                        key={`aisle-${si}`}
                        style={{
                          width: 1,
                          height: small ? 24 : 32,
                          background:
                            'repeating-linear-gradient(180deg, var(--border-subtle) 0 4px, transparent 4px 8px)',
                          margin: '0 auto',
                          opacity: 0.5,
                        }}
                        aria-hidden
                      />
                    );
                  }
                  const iconType = slotTypeToIconType(slot);
                  const isHighlighted = highlightSeat && slot.label === highlightSeat;
                  return (
                    <div
                      key={si}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                        outline: isHighlighted
                          ? '2px solid var(--brand-primary, #CEAC5C)'
                          : 'none',
                        borderRadius: 8,
                        padding: isHighlighted ? 2 : 0,
                        transition: 'outline 0.2s',
                      }}
                    >
                      <SeatIcon
                        type={iconType}
                        label={slot.label || ''}
                        size={seatSize}
                      />
                    </div>
                  );
                })}

                {/* Driver row marker */}
                {row.isDriverRow && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -22,
                      left: 0,
                      fontSize: 9,
                      fontWeight: 900,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    FRONT (Driver Row)
                  </div>
                )}

                {/* Entrance row marker */}
                {row.isEntranceRow && !row.isDriverRow && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -22,
                      left: 0,
                      fontSize: 9,
                      fontWeight: 900,
                      color: 'var(--status-success, #22C55E)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    ENTRANCE ROW
                  </div>
                )}

                {/* Bench row marker */}
                {row.isBench && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -22,
                      left: 0,
                      fontSize: 9,
                      fontWeight: 900,
                      color: 'var(--status-warning, #F59E0B)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    REAR BENCH
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!small && (
        <div
          style={{
            marginTop: 36,
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 11,
            fontFamily: 'monospace',
            letterSpacing: '1px',
          }}
        >
          ▲ FRONT (NORTH)
        </div>
      )}
    </div>
  );
};

export default ChassisCanvas;