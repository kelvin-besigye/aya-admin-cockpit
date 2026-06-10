/**
 * COUNTRY CONTEXT CONFIGURATION (The East & Southern African Bloc)
 * ------------------------------------------------------------------
 * The "God Mode" configuration for Regional Expansion.
 * This drives the Map Search, Phone Validation, and Country Selection logic.
 * * REGIONS COVERED:
 * 1. UG - Uganda (Pearl of Africa)
 * 2. KE - Kenya (Silicon Savannah)
 * 3. TZ - Tanzania (Bongo)
 * 4. RW - Rwanda (Land of a Thousand Hills)
 * 5. BI - Burundi (Heart of Africa)
 * 6. SS - South Sudan (The Youngest Nation)
 * 7. CD - DR Congo (The Giant - East Africa Entry)
 * 8. ZM - Zambia (The Copper Link)
 */

export const COUNTRY_MAP_CONFIG = {
  // === 1. UGANDA (Primary HQ) ===
  UG: {
    id: 'UG',
    name: 'Uganda',
    isoCode: 'ug',           // OpenStreetMap requires lowercase
    center: { lat: 0.3476, lng: 32.5825 }, // Kampala
    zoom: 12,
    phoneCode: '+256',
    currency: 'UGX',
    locale: 'en-UG'
  },

  // === 2. KENYA ===
  KE: {
    id: 'KE',
    name: 'Kenya',
    isoCode: 'ke',
    center: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    zoom: 11,
    phoneCode: '+254',
    currency: 'KES',
    locale: 'en-KE'
  },

  // === 3. TANZANIA ===
  TZ: {
    id: 'TZ',
    name: 'Tanzania',
    isoCode: 'tz',
    center: { lat: -6.7924, lng: 39.2083 }, // Dar es Salaam
    zoom: 12,
    phoneCode: '+255',
    currency: 'TZS',
    locale: 'sw-TZ'
  },

  // === 4. RWANDA ===
  RW: {
    id: 'RW',
    name: 'Rwanda',
    isoCode: 'rw',
    center: { lat: -1.9441, lng: 30.0619 }, // Kigali
    zoom: 13, // Smaller city, tighter zoom
    phoneCode: '+250',
    currency: 'RWF',
    locale: 'en-RW'
  },

  // === 5. BURUNDI ===
  BI: {
    id: 'BI',
    name: 'Burundi',
    isoCode: 'bi',
    center: { lat: -3.3822, lng: 29.3644 }, // Gitega (Political Capital)
    zoom: 13,
    phoneCode: '+257',
    currency: 'BIF',
    locale: 'fr-BI'
  },

  // === 6. SOUTH SUDAN ===
  SS: {
    id: 'SS',
    name: 'South Sudan',
    isoCode: 'ss',
    center: { lat: 4.8594, lng: 31.5713 }, // Juba
    zoom: 12,
    phoneCode: '+211',
    currency: 'SSP',
    locale: 'en-SS'
  },

  // === 7. DR CONGO (Focused on East/Goma/Kinshasa) ===
  CD: {
    id: 'CD',
    name: 'DR Congo',
    isoCode: 'cd',
    center: { lat: -4.4419, lng: 15.2663 }, // Kinshasa
    // Note: For East African operations, might default to Goma (-1.6585, 29.2205) later
    zoom: 10,
    phoneCode: '+243',
    currency: 'CDF',
    locale: 'fr-CD'
  },

  // === 8. ZAMBIA (The Southern Link) ===
  ZM: {
    id: 'ZM',
    name: 'Zambia',
    isoCode: 'zm',
    center: { lat: -15.3875, lng: 28.3228 }, // Lusaka
    zoom: 12,
    phoneCode: '+260',
    currency: 'ZMW', // Zambian Kwacha
    locale: 'en-ZM'
  }
};

/**
 * THE ACTIVE CONTEXT SWITCHER
 * ------------------------------------------------------------------
 * Changing this SINGLE line updates the entire application's
 * map search bias, validation rules, and default views.
 */
export const ACTIVE_CONTEXT = COUNTRY_MAP_CONFIG.UG; 

/**
 * HELPER: PHONE CODES LIST
 * Useful for dropdowns in Step2_Parks or Partner Forms
 */
export const REGIONAL_PHONE_CODES = Object.values(COUNTRY_MAP_CONFIG).map(c => ({
  code: c.phoneCode,
  country: c.id
}));