/**
 * FLEET DATA MODELS
 * Defines the structure (DNA) of every object in the Registry.
 * These are the "Factories" that create empty forms.
 * * CRITICAL: These must match the 'Universal Schema' used by
 * fleet.adapters.js and the React Components.
 */

// 1. THE ROOT PARTNER OBJECT (Used in WizardContainer)
export const createDefaultPartner = () => ({
  // Identity
  companyName: '',
  partnerId: '',
  status: 'DRAFT',
  
  // Credentials
  tinNumber: '',
  businessType: 'LTD',
  incorporationDate: '',
  
  // Security (Local state only, never sent to DB)
  password: '',
  confirmPassword: '',
  
  // Children Arrays (Initialized empty)
  parks: [],
  financials: [],
  contacts: []
});

// 2. THE PARK MODEL (Used in Step 2)
export const createDefaultPark = () => ({
  id: Date.now(), // Temporary ID for React keys
  name: '',
  address: '',
  gps: {
    lat: '',
    lng: ''
  },
  contactName: '',
  contactPhone: '',
  contactPhoneCode: '+256'
});

// 3. THE FINANCIAL MODEL (Used in Step 3)
export const createDefaultFinancial = (isPrimary = false) => ({
  id: Date.now(),
  institutionCode: '', 
  accountName: '',
  accountNumber: '',
  confirmAccountNumber: '',
  currency: 'UGX',
  isPrimary: isPrimary
});

// 4. THE CONTACT MODEL (Used in Step 4)
export const createDefaultContact = () => ({
  id: Date.now(),
  fullName: '',
  role: '',
  phonePrimary: '',
  phoneAlt: '',
  email: ''
});