// ─── SINGLE CLIENT GUARANTEE ────────────────────────────────────────────────
// This file intentionally re-exports from api.config.js instead of calling
// createClient() again. Having two createClient() calls causes the
// "Multiple GoTrueClient instances" warning and sends some requests as
// unauthenticated (triggering 403s on RLS-protected tables).
//
// Every file that imports { supabase } from './supabase' (or wherever this
// sits) continues to work with zero changes — they just get the one true
// client instead of a second one.
// ─────────────────────────────────────────────────────────────────────────────

export { supabase } from '../services/api.config';
