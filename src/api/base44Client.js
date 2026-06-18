import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { supabaseCompat } from '@/api/supabaseCompatClient';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const base44Native = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

export const base44 = import.meta.env.VITE_BACKEND_PROVIDER === 'supabase'
  ? supabaseCompat
  : base44Native;