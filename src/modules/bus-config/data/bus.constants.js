import {
  Wind, Wifi, BatteryCharging, Tv, Music, Coffee, Shield,
  Thermometer, MapPin, MonitorPlay, Zap, Armchair,
  Trash2, Snowflake, LayoutGrid
} from 'lucide-react';

/**
 * BUS CONFIGURATION CONSTANTS
 * ------------------------------------------------------------------
 * The "Single Source of Truth" for the Bus Detailing Centre.
 *
 * DESIGN PHILOSOPHY:
 * 1. UGANDAN CONTEXT: Classes match local market standards (Ordinary vs VIP).
 * 2. FLEXIBILITY: Columns and Rows are limits, not fixed numbers.
 * 3. SCALABILITY: New amenities can be added here without breaking code.
 * 4. CHASSIS GRAMMAR v2: Driver position, entrance row, entrance side,
 *    rear-bench position, conductor count, invalid seat — all here.
 */

// =========================================================================
// 1. BUS CLASSIFICATIONS (The Market Standards)
// =========================================================================
export const BUS_CLASSES = [
  {
    id: 'ORDINARY',
    label: 'Ordinary (3 + 2)',
    description: 'Standard layout for high capacity routes.',
    defaultCols: { left: 3, right: 2 }
  },
  {
    id: 'STANDARD',
    label: 'Standard (2 + 2)',
    description: 'Balanced comfort for regional travel.',
    defaultCols: { left: 2, right: 2 }
  },
  {
    id: 'EXECUTIVE',
    label: 'Executive (2 + 2 Spacious)',
    description: 'Extra legroom and reclining seats.',
    defaultCols: { left: 2, right: 2 }
  },
  {
    id: 'VIP',
    label: 'VIP / First Class (2 + 1)',
    description: 'Premium single-aisle seating for luxury.',
    defaultCols: { left: 2, right: 1 }
  }
];

// =========================================================================
// 2. AMENITIES (The Selling Points)
// =========================================================================
export const BUS_AMENITIES = [
  { id: 'ac', label: 'Climate Control (AC)', icon: Snowflake },
  { id: 'wifi', label: 'Free 4G Wi-Fi', icon: Wifi },
  { id: 'charging', label: 'USB Charging Ports', icon: BatteryCharging },
  { id: 'power_outlets', label: '240V Power Outlets', icon: Zap },
  { id: 'tv', label: 'Central TV Screens', icon: Tv },
  { id: 'personal_screen', label: 'Personal Entertainment', icon: MonitorPlay },
  { id: 'music', label: 'Surround Sound', icon: Music },
  { id: 'refreshments', label: 'Free Refreshments', icon: Coffee },
  { id: 'fridge', label: 'On-board Fridge', icon: Thermometer },
  { id: 'reclining', label: 'Reclining Seats', icon: Armchair },
  { id: 'legroom', label: 'Extra Legroom', icon: LayoutGrid },
  { id: 'tracking', label: 'Real-time Tracking', icon: MapPin },
  { id: 'cctv', label: 'CCTV Security', icon: Shield },
  { id: 'trash', label: 'Waste Bins', icon: Trash2 },
];

// =========================================================================
// 3. CHASSIS LIMITS (The Safety Rails)
// =========================================================================
export const CHASSIS_CONSTRAINTS = {
  MIN_ROWS: 5,
  MAX_ROWS: 15,
  MIN_COLS: 1,
  MAX_COLS: 3,
  // Entrance row range — computed dynamically against total_rows
  MIN_ENTRANCE_ROW: 1,
  ENTRANCE_ALLOWED_IN_ROW_1: true,  // row 1 (driver row) CAN also hold the entrance
  // Conductor seat limits
  MIN_CONDUCTORS: 0,
  MAX_CONDUCTORS: 2,
};

// =========================================================================
// 4. CHASSIS ORIENTATION OPTIONS (NEW in v2)
// =========================================================================
/** Where is the driver seat positioned? */
export const DRIVER_POSITION_OPTIONS = [
  { id: 'RIGHT', label: 'Right (Uganda Standard)' },
  { id: 'LEFT',  label: 'Left' },
];

/** Which side of the bus is the entrance / passenger door on? */
export const ENTRANCE_SIDE_OPTIONS = [
  { id: 'NONE',  label: 'No Entrance' },
  { id: 'LEFT',  label: 'Left' },
  { id: 'RIGHT', label: 'Right' },
];

/** Which row is the entrance at? (1-indexed from front) */
export const ENTRANCE_ROW_OPTIONS = (totalRows) => {
  const opts = [];
  for (let r = 1; r <= totalRows; r++) {
    opts.push({
      id: r,
      label: r === 1 ? 'Row 1 (with Driver)' : `Row ${r}`,
    });
  }
  return opts;
};

/** Where is the rear bench "M" seat positioned? */
export const REAR_BENCH_POSITION_OPTIONS = [
  { id: 'MIDDLE', label: 'Middle Aisle (Recommended)' },
  { id: 'RIGHT',  label: 'Right Column (Legacy)' },
];

/** How many conductor seats (SS1, SS2)? */
export const CONDUCTOR_COUNT_OPTIONS = [
  { id: 0, label: 'None' },
  { id: 1, label: '1 Conductor' },
  { id: 2, label: '2 Conductors' },
];

export const CONDUCTOR_SIDE_OPTIONS = [
  { id: 'LEFT',  label: 'Left' },
  { id: 'RIGHT', label: 'Right' },
];

/** Invalid / Wheelchair seat ("1X") settings */
export const INVALID_SEAT_OPTIONS = [
  { id: 'NONE', label: 'None' },
  { id: 'LEFT', label: 'Left side' },
  { id: 'RIGHT', label: 'Right side' },
];

// =========================================================================
// 5. WIZARD STEPS
// =========================================================================
export const CONFIG_WIZARD_STEPS = [
  { id: 1, label: 'Classification', description: 'Define the bus type' },
  { id: 2, label: 'Chassis Design', description: 'Configure seat layout' },
  { id: 3, label: 'Visual Profile', description: 'Upload fleet photos' },
  { id: 4, label: 'Amenities', description: 'Select features' }
];

// =========================================================================
// 6. LAYOUT SCHEMA VERSION (for future migrations)
// =========================================================================
export const LAYOUT_SCHEMA_VERSION = 2;
export const SCHEMA_V2_INTRODUCED_AT = '2026-06-28';