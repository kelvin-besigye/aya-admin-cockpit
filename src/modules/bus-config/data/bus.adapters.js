/**
 * 👑 AYABUS ADAPTER ENGINE (Sovereign Translator)
 * ------------------------------------------------------------------
 * Module: Bus Configuration
 * File: bus.adapters.js
 *
 * CHANGE LOG (Chassis Grammar v2):
 * - calculateSeatCount now respects entrance row + driver row collisions
 *   and counts bookable seats correctly when:
 *     - driver row loses seats on the driver's side
 *     - entrance row loses seats on the entrance's side
 *     - if both are the same row, that row contributes 0 bookable seats
 * - calculateSeatCount respects bench_position 'MIDDLE' (1 seat in middle
 *   column) vs legacy 'RIGHT' (1 seat in right column).
 */

// =====================================================================
// 0. HELPERS
// =====================================================================

const countFrontRowSeats = (row) => {
  let count = 0;
  const leftSlots  = Array.isArray(row.left)  ? row.left  : [];
  const rightSlots = Array.isArray(row.right) ? row.right : [];
  for (const slot of [...leftSlots, ...rightSlots]) {
    if (slot.type === 'SEAT') count++;
  }
  return count;
};

// =====================================================================
// 1. SHAPE → SEAT COUNT (v2 aware)
// =====================================================================
/**
 * Counts exactly how many real (bookable) seats a given layout_config
 * shape produces. v2-aware:
 *   - Driver row: only counts seats on the NON-driver side
 *   - Entrance row: only counts seats on the NON-entrance side
 *   - If driver row == entrance row: 0 bookable seats on that row
 *   - Rear bench MIDDLE: 1 seat in middle column
 *   - Rear bench RIGHT (legacy): 1 seat in right column
 *
 * @param {object} layout - full layout_config object
 * @returns {number} total bookable seat count
 */
export const calculateSeatCount = (layout) => {
  if (!layout) return 0;

  const colsLeft       = layout.cols_left    ?? 2;
  const colsRight      = layout.cols_right   ?? 2;
  const totalRows      = layout.total_rows   ?? 11;
  const hasRearBench   = !!layout.has_rear_bench;
  const frontRows      = Array.isArray(layout.front_rows) ? layout.front_rows : [];

  // ── v2 fields (with safe defaults) ──
  const driverPosition = layout.driver_position || 'RIGHT';
  const entranceSide   = layout.entrance_side   || 'NONE';
  const entranceRow    = layout.entrance_row    ?? 1;

  // If front_rows is provided, count those first (legacy override path)
  if (frontRows.length > 0) {
    let count = 0;
    for (const row of frontRows) count += countFrontRowSeats(row);
    for (let r = frontRows.length + 1; r <= totalRows; r++) {
      const isLast = r === totalRows;
      const isBench = isLast && hasRearBench;
      count += isBench ? 1 : (colsLeft + colsRight);
    }
    return count;
  }

  let count = 0;

  for (let r = 1; r <= totalRows; r++) {
    const isLast = r === totalRows;
    const isBench = isLast && hasRearBench;
    const isDriverR = r === 1;
    const isEntranceR = entranceSide !== 'NONE' && r === entranceRow;

    // Driver row + Entrance row collision
    if (isDriverR && isEntranceR) {
      // No bookable seats on this row at all
      continue;
    }

    if (isDriverR) {
      // Only count seats on the NON-driver side
      if (driverPosition === 'LEFT') {
        count += colsRight;  // right side has all the seats
      } else {
        count += colsLeft;   // left side has all the seats
      }
      continue;
    }

    if (isEntranceR) {
      // Only count seats on the NON-entrance side
      if (entranceSide === 'LEFT') {
        count += colsRight;
      } else {
        count += colsLeft;
      }
      continue;
    }

    if (isBench) {
      count += 1; // rear bench always contributes exactly 1 bookable seat
    } else {
      count += colsLeft + colsRight;
    }
  }

  return count;
};

// =====================================================================
// 2. DATABASE → FORM (The Hydration Engine)
// =====================================================================
export const dbToForm = (dbRecord) => {
  if (!dbRecord) return null;

  const restoreImage = (val) => {
    if (!val) return null;
    if (typeof val === 'object' && val.preview) return { ...val, isRemote: true };
    return { preview: typeof val === 'string' ? val : val.url, isRemote: true };
  };

  // Backfill v2 defaults if a legacy record is hydrated
  const rawLayout = dbRecord.layout_config || {};
  const layout = {
    total_rows:        rawLayout.total_rows        ?? 11,
    cols_left:         rawLayout.cols_left         ?? 2,
    cols_right:        rawLayout.cols_right        ?? 3,
    has_rear_bench:    rawLayout.has_rear_bench    ?? true,
    driver_position:   rawLayout.driver_position   ?? 'RIGHT',
    entrance_side:     rawLayout.entrance_side     ?? 'NONE',
    entrance_row:      rawLayout.entrance_row      ?? 1,
    bench_position:    rawLayout.bench_position    ?? 'MIDDLE',
    conductor_count:   rawLayout.conductor_count   ?? 0,
    conductor_side:    rawLayout.conductor_side    ?? 'LEFT',
    has_invalid_seat:  rawLayout.has_invalid_seat  ?? false,
    invalid_seat_side: rawLayout.invalid_seat_side ?? 'LEFT',
    front_rows:        Array.isArray(rawLayout.front_rows) ? rawLayout.front_rows : [],
    total_seats:       rawLayout.total_seats       ?? 0,
  };

  return {
    id:        dbRecord.id,
    partnerId: dbRecord.partner_id,

    busClass: dbRecord.bus_class || 'Standard',
    layout:   layout,

    seatCount: dbRecord.capacity ?? calculateSeatCount(layout),

    gallery: Array.isArray(dbRecord.gallery)
      ? dbRecord.gallery.map(img => restoreImage(img))
      : [],

    amenities: dbRecord.amenities || [],
    status:    dbRecord.status    || 'PENDING_APPROVAL',

    modelName:   dbRecord.model_name   || '',
    plateNumber: dbRecord.plate_number || 'TBA',

    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  };
};

// =====================================================================
// 3. FORM → DATABASE (The Persistence Engine)
// =====================================================================
export const formToDb = (formData) => {
  if (!formData) return null;

  const processImage = (img) => {
    if (!img) return null;
    return img.isRemote ? img.preview : img;
  };

  // Make sure layout has all v2 fields, even if the user skipped Step 2
  const rawLayout = formData.layout || {};
  const layout = {
    total_rows:        rawLayout.total_rows        ?? 11,
    cols_left:         rawLayout.cols_left         ?? 2,
    cols_right:        rawLayout.cols_right        ?? 3,
    has_rear_bench:    rawLayout.has_rear_bench    ?? true,
    driver_position:   rawLayout.driver_position   ?? 'RIGHT',
    entrance_side:     rawLayout.entrance_side     ?? 'NONE',
    entrance_row:      rawLayout.entrance_row      ?? 1,
    bench_position:    rawLayout.bench_position    ?? 'MIDDLE',
    conductor_count:   rawLayout.conductor_count   ?? 0,
    conductor_side:    rawLayout.conductor_side    ?? 'LEFT',
    has_invalid_seat:  rawLayout.has_invalid_seat  ?? false,
    invalid_seat_side: rawLayout.invalid_seat_side ?? 'LEFT',
    front_rows:        Array.isArray(rawLayout.front_rows) ? rawLayout.front_rows : [],
  };

  const seatCount = calculateSeatCount(layout);

  return {
    partner_id:    formData.partnerId,
    bus_class:     formData.busClass,
    layout_config: { ...layout, total_seats: seatCount },
    capacity:      seatCount,

    model_name:   formData.modelName  || (formData.busClass + '_CONFIG'),
    plate_number: formData.plateNumber || 'TBA',

    gallery: Array.isArray(formData.gallery)
      ? formData.gallery.map(img => processImage(img))
      : [],

    amenities: formData.amenities || [],
    status:    formData.status    || 'PENDING_APPROVAL',
  };
};

// =====================================================================
// 4. SOVEREIGN UTILITIES
// =====================================================================
export const getBusLabel = (formData) => {
  if (!formData) return 'Untitled Configuration';
  const partnerId = formData.partnerId ? formData.partnerId.substring(0, 5) : 'NEW';
  const busClass  = formData.busClass || 'Standard';
  return `[${partnerId}] ${busClass} Configuration`;
};