/**
 * ROUTES DATA MODELS (The DNA)
 * ------------------------------------------------------------------
 * Defines the strict schema and validation logic for Route Objects.
 * * * WORLD CLASS UPGRADES:
 * 1. FACTORY PATTERN: Ensures consistent initialization state.
 * 2. BUSINESS LOGIC: Prevents "Kampala to Kampala" or Negative Prices.
 * 3. TYPE SAFETY: JSDoc definitions act as a contract for the UI.
 */

// =================================================================
// 1. THE SCHEMA DEFINITION (JSDoc Contract)
// =================================================================

/**
 * @typedef {Object} RouteFormState
 * @property {string} id - UUID or Draft ID
 * @property {string} partnerId - UUID of the Operating Partner
 * @property {string} busConfigId - UUID of the Vehicle Class
 * @property {string} origin - Departure City
 * @property {string} destination - Arrival City
 * @property {string} park - Departure Terminal/Park Name
 * @property {string} ticketPrice - Base Fare (Stored as string for input handling)
 * @property {string} serviceTax - Platform Fee (Stored as string)
 * @property {{hour: string, minute: string}} duration - Estimated Travel Time
 * @property {Array<{hour: string, minute: string, period: 'AM'|'PM'}>} timeSlots - For Bulk Creation
 * @property {{hour: string, minute: string, period: 'AM'|'PM'} | null} time - For Single Edit
 * @property {string} status - Lifecycle state (DRAFT, PENDING, ACTIVE)
 */

// =================================================================
// 2. THE FACTORY (Initialization)
// =================================================================

/**
 * Creates a pristine, crash-proof Route Object.
 * Usage: const newRoute = createDefaultRoute();
 * @returns {RouteFormState}
 */
export const createDefaultRoute = () => ({
  // Identity
  id: '', 
  partnerId: '',       
  busConfigId: '',     
  
  // Geography
  origin: '',          
  destination: '',     
  park: '',            
  
  // Financials
  ticketPrice: '',     
  serviceTax: '',      
  
  // Schedule
  duration: { hour: '00', minute: '00' }, 
  timeSlots: [],       // Array for "Explosion Strategy" (Multiple Routes)
  time: null,          // Object for "Precision Edit" (Single Route)

  // Meta
  status: 'DRAFT',     
  createdAt: new Date().toISOString()
});

// =================================================================
// 3. THE VALIDATION ENGINE (Business Logic)
// =================================================================

/**
 * Centralized rules for unlocking Wizard steps.
 * @param {number} stepId - The current step (1-4)
 * @param {RouteFormState} data - The current form state
 * @returns {boolean} - True if the step is complete and valid
 */
export const isRouteStepValid = (stepId, data) => {
  if (!data) return false;

  switch (stepId) {
    case 1: // IDENTITY
      // Rule: Must have both an Operator and a Service Class selected
      // We check for truthiness to ensure non-empty strings/UUIDs
      return Boolean(data.partnerId && data.busConfigId);
    
    case 2: // GEOGRAPHY
      // Rule 1: All fields mandatory
      const hasGeo = Boolean(data.origin && data.destination && data.park);
      // Rule 2: Origin cannot equal Destination (Logical Paradox)
      const distinctCities = data.origin.trim().toLowerCase() !== data.destination.trim().toLowerCase();
      
      return hasGeo && distinctCities;
    
    case 3: // FINANCIALS
      // Rule 1: Fields must not be empty
      if (data.ticketPrice === '' || data.serviceTax === '') return false;
      
      // Rule 2: Values cannot be negative (Business Safety)
      const price = Number(data.ticketPrice);
      const tax = Number(data.serviceTax);
      
      return !isNaN(price) && price >= 0 && !isNaN(tax) && tax >= 0;
    
    case 4: // SCHEDULE
      // Rule 1: Duration must be set (non-zero is preferred but explicit 00:00 is technically "set")
      const hasDuration = data.duration?.hour && data.duration?.minute;
      
      // Rule 2: Must have at least one time slot (Create Mode) OR a single time (Edit Mode)
      // This handles the dual-nature of the form (Wizard vs Editor)
      const hasTimeSlots = Array.isArray(data.timeSlots) && data.timeSlots.length > 0;
      const hasSingleTime = Boolean(data.time);
      
      return hasDuration && (hasTimeSlots || hasSingleTime);
      
    default:
      return false;
  }
};

/**
 * Determines if the route is in "Draft Mode" (Unsaved)
 * @param {string} id 
 * @returns {boolean}
 */
export const isDraftId = (id) => {
  return typeof id === 'string' && id.startsWith('route_draft_');
};