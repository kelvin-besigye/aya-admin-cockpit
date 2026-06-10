import { Bus, MapPin, CreditCard, Clock } from 'lucide-react';

/**
 * ROUTES CONSTANTS (The Rule Book)
 * ------------------------------------------------------------------
 * Centralized definition of all enums, limits, and configuration options.
 * * * WORLD CLASS UPGRADES:
 * 1. IMMUTABILITY: All objects are frozen to prevent runtime tampering.
 * 2. COMPLETE CONTEXT: Includes comprehensive City lists and Status Configs.
 * 3. TYPE SAFETY: Acts as the definitive reference for the entire module.
 */

// =================================================================
// 1. LIFECYCLE ENUMS (Immutable)
// =================================================================
export const ROUTE_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  REJECTED: 'REJECTED'
});

export const ROUTE_STATUS_CONFIG = Object.freeze({
  [ROUTE_STATUS.DRAFT]: { 
    label: 'Draft', 
    color: 'gray', 
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    description: 'Not yet submitted' 
  },
  [ROUTE_STATUS.PENDING]: { 
    label: 'Pending Approval', 
    color: 'amber', 
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    description: 'Awaiting admin review' 
  },
  [ROUTE_STATUS.ACTIVE]: { 
    label: 'Live Active', 
    color: 'green', 
    bg: 'bg-green-100',
    text: 'text-green-700',
    description: 'Visible to customers' 
  },
  [ROUTE_STATUS.SUSPENDED]: { 
    label: 'Suspended', 
    color: 'red', 
    bg: 'bg-red-100',
    text: 'text-red-700',
    description: 'Temporarily disabled' 
  },
  [ROUTE_STATUS.REJECTED]: { 
    label: 'Rejected', 
    color: 'red', 
    bg: 'bg-red-50',
    text: 'text-red-600',
    description: 'Requires correction' 
  }
});

// =================================================================
// 2. WIZARD CONFIGURATION
// =================================================================
export const WIZARD_STEPS = Object.freeze([
  { 
    id: 1, 
    label: 'Identity', 
    description: 'Partner & Service Class',
    icon: Bus 
  },
  { 
    id: 2, 
    label: 'Geography', 
    description: 'Origin, Destination & Park',
    icon: MapPin 
  },
  { 
    id: 3, 
    label: 'Financials', 
    description: 'Pricing & Service Tax',
    icon: CreditCard 
  },
  { 
    id: 4, 
    label: 'Schedule', 
    description: 'Departure & Duration',
    icon: Clock 
  }
]);

// =================================================================
// 3. VALIDATION RULES & LIMITS
// =================================================================
export const ROUTE_RULES = Object.freeze({
  // Financials (UGX)
  CURRENCY: 'UGX',
  MIN_PRICE: 500,           
  MAX_PRICE: 5000000,       
  
  // Schedule
  MIN_DURATION_MINUTES: 30, 
  MAX_DURATION_HOURS: 24,   
  
  // Time Intervals (Minutes)
  TIME_INCREMENT: 15,
  
  // Formatting
  DATE_FORMAT: 'MMM dd, yyyy',
  TIME_FORMAT: 'hh:mm a'
});

// =================================================================
// 4. PRE-DEFINED LISTS (For Dropdowns)
// =================================================================

// Comprehensive List of Major Ugandan Towns/Cities
export const CITY_SUGGESTIONS = Object.freeze([
  // Central
  'Kampala', 'Entebbe', 'Masaka', 'Mityana', 'Mubende', 'Luweero',
  // East
  'Jinja', 'Mbale', 'Soroti', 'Tororo', 'Busia', 'Iganga', 'Kapchorwa',
  // North
  'Gulu', 'Lira', 'Arua', 'Kitgum', 'Koboko', 'Nebbi', 'Adjumani',
  // West
  'Mbarara', 'Fort Portal', 'Kabale', 'Kasese', 'Hoima', 'Kisoro', 'Rukungiri', 'Bushenyi'
]);

// =================================================================
// 5. ERROR MESSAGES (User Facing)
// =================================================================
export const ROUTE_ERRORS = Object.freeze({
  MISSING_IDENTITY: "Please select both an Operating Partner and a Service Class.",
  MISSING_GEOGRAPHY: "Origin, Destination, and Departure Park are required.",
  INVALID_PRICE: "Ticket price cannot be negative or empty.",
  MISSING_DURATION: "Please specify the approximate journey duration.",
  NO_SLOTS: "At least one departure time slot is required.",
  SAME_CITY: "Origin and Destination cannot be the same city.",
  NETWORK_ERROR: "Could not connect to the server. Please check your internet.",
  SAVE_FAILED: "Failed to save the route. Please try again."
});