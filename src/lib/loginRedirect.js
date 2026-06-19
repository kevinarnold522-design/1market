/**
 * Redirects to the app's Supabase login page and returns to the current page afterwards.
 * Strips preview/iframe injected query params so the redirect URL is always clean.
 */
export function redirectToLogin() {
  const cleanUrl = window.location.origin + window.location.pathname;
  window.location.href = `/login?next=${encodeURIComponent(cleanUrl)}`;
}