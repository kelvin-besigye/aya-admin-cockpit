/**
 * SCHEDULER TYPE DEFINITIONS
 * ------------------------------------------------------------------
 * This file serves as the Single Source of Truth for data structures.
 * It aligns strictly with the 'route_schedules' and 'schedule_drafts' tables.
 */

// ==========================================================
// 1. ENUMS & CONSTANTS
// ==========================================================

/**
 * @typedef {'DAILY' | 'WEEKLY' | 'CUSTOM' | 'SUPER_CUSTOM'} FrequencyType
 * * Logic Breakdown:
 * - DAILY: Runs every single day (Mon-Sun).
 * - WEEKLY: Runs on one specific day every week (e.g., Every Friday).
 * - CUSTOM: Runs on multiple specific days (e.g., Mon, Wed, Fri).
 * - SUPER_CUSTOM: Runs on specific calendar dates (e.g., Dec 25th, Jan 1st).
 */

/**
 * @typedef {'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED'} ScheduleStatus
 */

// ==========================================================
// 2. DATA PAYLOADS (The "Frequency Data" JSONB)
// ==========================================================

/**
 * Structure of the 'frequency_data' JSONB column.
 * @typedef {Object} FrequencyPayload
 * @property {number[]} [days] - Used for WEEKLY/CUSTOM. Array of integers 0-6 (0=Sun, 1=Mon).
 * @property {string[]} [dates] - Used for SUPER_CUSTOM. Array of ISO Date Strings ("2023-12-25").
 */

// ==========================================================
// 3. DATABASE RECORDS (What Supabase Returns)
// ==========================================================

/**
 * A fully hydrated Schedule Record for the Registry.
 * Includes joined data from Routes, Partners, and Configs.
 * * @typedef {Object} ScheduleRecord
 * @property {string} id - UUID
 * @property {string} route_id - UUID of the base route
 * @property {FrequencyType} frequency_type
 * @property {FrequencyPayload} frequency_data
 * @property {ScheduleStatus} status
 * @property {string} created_at - ISO Timestamp
 * @property {string} updated_at - ISO Timestamp
 * @property {string} created_by - User UUID
 * * // JOINED DATA (From fetchSchedules)
 * @property {Object} [route]
 * @property {string} route.origin_city
 * @property {string} route.destination_city
 * @property {string} route.departure_time
 * @property {string} route.duration_hours
 * @property {string} route.duration_minutes
 * @property {string} route.price_ticket
 * @property {Object} [route.partners]
 * @property {string} route.partners.company_name
 * @property {Object} [route.bus_configs]
 * @property {string} route.bus_configs.bus_class
 */

/**
 * A Draft Record (Work In Progress).
 * Columns are nullable because the wizard might be half-finished.
 * * @typedef {Object} ScheduleDraft
 * @property {string} id - Custom Draft ID ("draft_...")
 * @property {number} step_number - 1 or 2
 * @property {string} label - Auto-generated label (e.g., "KLA-MBA Daily")
 * @property {string|null} partner_id
 * @property {string|null} class_id
 * @property {string|null} route_id
 * @property {FrequencyType|null} frequency_type
 * @property {WizardFormData} form_data - The full React State blob
 * @property {string} last_updated
 */

// ==========================================================
// 4. WIZARD STATE (React Front-End)
// ==========================================================

/**
 * The Shape of the Wizard's local state (formData).
 * @typedef {Object} WizardFormData
 * @property {string} partnerId - UUID
 * @property {string} classId - UUID
 * @property {string} routeId - UUID
 * @property {FrequencyType} frequencyType
 * @property {number[]} selectedDays - [1, 3, 5] (Mon, Wed, Fri)
 * @property {Date[]} selectedDates - [Date Object, Date Object] (For Super Custom)
 */

export const Types = {}; // Export empty object to allow import/usage as module