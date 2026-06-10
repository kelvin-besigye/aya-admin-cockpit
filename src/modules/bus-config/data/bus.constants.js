import { 
  Wind, Wifi, BatteryCharging, Tv, Music, Coffee, Shield, 
  Thermometer, MapPin, MonitorPlay, Zap, Armchair, 
  Trash2, Snowflake, LayoutGrid 
} from 'lucide-react';

/**
 * BUS CONFIGURATION CONSTANTS
 * ------------------------------------------------------------------
 * The "Single Source of Truth" for the Bus Detailing Centre.
 * * DESIGN PHILOSOPHY:
 * 1. UGANDAN CONTEXT: Classes match local market standards (Ordinary vs VIP).
 * 2. FLEXIBILITY: Columns and Rows are limits, not fixed numbers.
 * 3. SCALABILITY: New amenities can be added here without breaking code.
 */

// 1. BUS CLASSIFICATIONS (The Market Standards)
// 'defaultCols' helps the wizard pre-fill the chassis designer to save time.
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

// 2. AMENITIES (The Selling Points)
// Comprehensive list covering modern Ugandan bus features.
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

// 3. CHASSIS LIMITS (The Safety Rails)
// Prevents the UI from breaking if someone tries to create a 50-row bus.
export const CHASSIS_CONSTRAINTS = {
  MIN_ROWS: 5,
  MAX_ROWS: 15, // Standard max for large coaches is usually 13-14
  MIN_COLS: 1,
  MAX_COLS: 3,  // Max 3 seats per side (3+2 = 5 total width)
};

// 4. WIZARD STEPS (The Flow)
export const CONFIG_WIZARD_STEPS = [
  { id: 1, label: 'Classification', description: 'Define the bus type' },
  { id: 2, label: 'Chassis Design', description: 'Configure seat layout' },
  { id: 3, label: 'Visual Profile', description: 'Upload fleet photos' },
  { id: 4, label: 'Amenities', description: 'Select features' }
];