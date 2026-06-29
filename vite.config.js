import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_ prefixed) so we can bridge them
  const env = loadEnv(mode, process.cwd(), '');

  const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || '';
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '';
  const redirectUrl = env.VITE_DEV_SUPABASE_REDIRECT_URL || env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || '';

  return {
    logLevel: 'error', // Suppress warnings, only show errors
    plugins: [react(), cloudflare()],
    // Bridge non-VITE_ prefixed env vars into import.meta.env so Supabase client works.
    // Vite only auto-exposes VITE_ prefixed variables; we explicitly map the others here.
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    define: {
      'import.meta.env.VITE_BACKEND_PROVIDER': JSON.stringify(
        env.VITE_BACKEND_PROVIDER || 'supabase'
      ),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_DEV_SUPABASE_REDIRECT_URL': JSON.stringify(redirectUrl),
    }
  };
});