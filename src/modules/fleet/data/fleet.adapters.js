/**
 * FLEET DATA ADAPTERS (The Translator Layer)
 * ------------------------------------------------------------------
 * Solves the "Snake_Case" vs "CamelCase" conflict.
 * * 1. dbToForm: Converts raw DB rows (snake_case) -> Wizard State (camelCase).
 * 2. formToDb: Converts Wizard State (camelCase) -> Raw DB Payload (snake_case).
 */

// --- HELPER: SAFE PARSING ---
// Prevents crashes if a value is null/undefined
const safeStr = (val) => val || '';

// --- HELPER: SAFE DATES (THE FIX) ---
// Postgres crashes if you send "" for a date column. It demands NULL.
const safeDate = (val) => (val && val !== '') ? val : null;

// --- 1. DB TO FORM (Hydration) ---
// Used when: Clicking "Modify" in the Registry.
export const dbToForm = (dbRecord) => {
  if (!dbRecord) return null;

  // 1. SAFEGUARD: Handle missing 'details' column gracefully
  const details = dbRecord.details || {};
  
  // 2. CHILD ARRAYS: Prefer Joined Tables, Fallback to JSONB
  const rawParks = dbRecord.partner_parks || details.parks || [];
  const rawFinancials = dbRecord.partner_financials || details.financials || [];
  const rawContacts = dbRecord.partner_contacts || details.contacts || [];

  return {
    // A. CORE IDENTITY
    id: dbRecord.id,
    companyName: safeStr(dbRecord.company_name),
    partnerId: safeStr(dbRecord.partner_id),
    status: dbRecord.status || 'DRAFT',
    createdAt: dbRecord.created_at,
    
    // Passwords are never sent back from DB
    password: '', 
    confirmPassword: '',

    // B. CREDENTIALS
    tinNumber: safeStr(dbRecord.tin_number || details.tinNumber),
    businessType: safeStr(dbRecord.business_type || details.businessType || 'LTD'),
    incorporationDate: safeStr(dbRecord.incorporation_date || details.incorporationDate),

    // C. DEEP MAP: PARKS
    parks: Array.isArray(rawParks) ? rawParks.map(p => ({
      id: p.id || `temp_${Date.now()}_${Math.random()}`,
      name: safeStr(p.name),
      address: safeStr(p.address),
      gps: {
        lat: safeStr(p.gps_lat),
        lng: safeStr(p.gps_lng)
      },
      contactName: safeStr(p.contact_name),
      contactPhone: safeStr(p.contact_phone),
      contactPhoneCode: '+256'
    })) : [],

    // D. DEEP MAP: FINANCIALS
    financials: Array.isArray(rawFinancials) ? rawFinancials.map(f => ({
      id: f.id,
      institutionCode: safeStr(f.institution_code),
      accountName: safeStr(f.account_name),
      accountNumber: safeStr(f.account_number),
      currency: safeStr(f.currency || 'UGX'),
      isPrimary: !!f.is_primary
    })) : [],

    // E. DEEP MAP: CONTACTS
    contacts: Array.isArray(rawContacts) ? rawContacts.map(c => ({
      id: c.id,
      fullName: safeStr(c.full_name),
      role: safeStr(c.role),
      phonePrimary: safeStr(c.phone_primary),
      phoneAlt: safeStr(c.phone_alt),
      email: safeStr(c.email)
    })) : []
  };
};

// --- 2. FORM TO DB (Submission) ---
// Used when: Clicking "Save" or "Save & Close".
export const formToDb = (formData) => {
  if (!formData) return null;

  return {
    // A. CORE COLUMNS
    company_name: formData.companyName,
    partner_id: formData.partnerId,
    status: formData.status,

    // B. OPTIONAL COLUMNS (Data Hygiene Applied Here)
    tin_number: formData.tinNumber,
    business_type: formData.businessType,
    
    // THE FIX: Convert "" to null
    incorporation_date: safeDate(formData.incorporationDate), 

    // C. JSON BACKUP (The Safety Net)
    details: {
      parks: formData.parks || [],
      financials: formData.financials || [],
      contacts: formData.contacts || [],
      tinNumber: formData.tinNumber,
      businessType: formData.businessType,
      incorporationDate: formData.incorporationDate
    },

    // D. PASSWORD (Only if changed)
    ...(formData.password ? { password_raw: formData.password } : {})
  };
};