import { base44 } from '@/api/base44Client';

/**
 * Redirects to login and returns to the current page afterwards.
 * Strips preview/iframe injected query params so the redirect URL is always clean.
 */
export function redirectToLogin() {
  const cleanUrl = window.location.origin + window.location.pathname;
  base44.auth.redirectToLogin(cleanUrl);
}