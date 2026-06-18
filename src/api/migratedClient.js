import { base44 as base44Client } from '@/api/base44Client';
import { supabaseCompat } from '@/api/supabaseCompatClient';

export const appClient = import.meta.env.VITE_BACKEND_PROVIDER === 'supabase'
  ? supabaseCompat
  : base44Client;

export const base44 = appClient;