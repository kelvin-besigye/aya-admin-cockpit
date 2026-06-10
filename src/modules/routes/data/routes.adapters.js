/**
 * ROUTES ADAPTERS (The Universal Translator)
 * ------------------------------------------------------------------
 * Converts data between the Application format (CamelCase) and 
 * the Database format (Snake_case).
 * * * WORLD CLASS UPGRADES:
 * 1. DEFENSIVE PROGRAMMING: Null checks everywhere. No crashes.
 * 2. TYPE COERCION: Ensures Numbers are Numbers, Strings are Strings.
 * 3. BIDIRECTIONAL MAPPING: Perfect symmetry between DB and UI states.
 */

// =================================================================
// 1. DATABASE -> FORM (Hydration)
// =================================================================
export const dbToForm = (dbData) => {
  if (!dbData) return null;

  try {
    return {
      // Identity
      id: dbData.id || '',
      partnerId: dbData.partner_id || '',
      busConfigId: dbData.bus_config_id || '',
      
      // Geography
      origin: dbData.origin_city || '',
      destination: dbData.destination_city || '',
      park: dbData.departure_park || '',
      
      // Financials (Convert Numbers to Strings for Inputs)
      ticketPrice: (dbData.price_ticket !== undefined && dbData.price_ticket !== null) 
        ? dbData.price_ticket.toString() 
        : '',
      serviceTax: (dbData.price_tax !== undefined && dbData.price_tax !== null) 
        ? dbData.price_tax.toString() 
        : '',
      
      // Schedule (Complex Object Reconstruction)
      duration: {
        hour: (dbData.duration_hours || 0).toString().padStart(2, '0'),
        minute: (dbData.duration_minutes || 0).toString().padStart(2, '0')
      },
      
      // Single Time (For Edit Mode)
      // DB '14:30:00' -> UI { hour: '02', minute: '30', period: 'PM' }
      time: dbData.departure_time ? parseDbTime(dbData.departure_time) : null,
      
      // Meta (Read Only)
      status: dbData.status || 'DRAFT',
      routeCode: dbData.route_code || '',
      createdAt: dbData.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error("Adapter Hydration Failed:", error);
    return null; // Fail gracefully
  }
};

// =================================================================
// 2. FORM -> DATABASE (Payload)
// =================================================================
export const formToDb = (formData) => {
  if (!formData) return {};

  try {
    return {
      // Identity (Ensure UUIDs are trimmed)
      partner_id: formData.partnerId ? formData.partnerId.trim() : null,
      bus_config_id: formData.busConfigId ? formData.busConfigId.trim() : null,
      
      // Geography
      origin_city: formData.origin ? formData.origin.trim() : null,
      destination_city: formData.destination ? formData.destination.trim() : null,
      departure_park: formData.park ? formData.park.trim() : null,
      
      // Financials (Ensure Numbers, Default to 0)
      price_ticket: Number(formData.ticketPrice) || 0,
      price_tax: Number(formData.serviceTax) || 0,
      
      // Schedule (Deconstruct Object)
      duration_hours: Number(formData.duration?.hour) || 0,
      duration_minutes: Number(formData.duration?.minute) || 0,
      
      // Note: 'departure_time' is handled separately in the Service 
      // because it depends on whether we are Creating (Array) or Editing (Single)
    };
  } catch (error) {
    console.error("Adapter Payload Construction Failed:", error);
    return {};
  }
};

// =================================================================
// 3. HELPERS (Time Logic)
// =================================================================

/**
 * Converts DB Time String to UI Object
 * Input: '14:30:00'
 * Output: { hour: '02', minute: '30', period: 'PM' }
 */
export const parseDbTime = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  
  try {
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    
    if (isNaN(h)) return null;

    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    
    return {
      hour: displayHour.toString().padStart(2, '0'),
      minute: mStr || '00',
      period
    };
  } catch (e) {
    console.error("Time Parse Error:", timeStr, e);
    return null;
  }
};

/**
 * Converts UI Time Object to DB Time String
 * Input: { hour: '02', minute: '30', period: 'PM' }
 * Output: '14:30:00'
 */
export const formatTimeForDb = (timeObj) => {
  if (!timeObj || !timeObj.hour) return '00:00:00';

  try {
    let h = parseInt(timeObj.hour, 10);
    const m = timeObj.minute || '00';
    
    if (isNaN(h)) return '00:00:00';

    if (timeObj.period === 'PM' && h < 12) h += 12;
    if (timeObj.period === 'AM' && h === 12) h = 0;
    
    return `${h.toString().padStart(2, '0')}:${m}:00`;
  } catch (e) {
    console.error("Time Format Error:", timeObj, e);
    return '00:00:00';
  }
};