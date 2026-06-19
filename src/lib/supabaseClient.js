import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_uHaBIgBzuhgPuUe0cTK0Qw_PDktWO2c';

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  FALLBACK_SUPABASE_URL
).replace(/\/+$/, '');

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  FALLBACK_SUPABASE_PUBLISHABLE_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  return supabase;
}