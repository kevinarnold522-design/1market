import { createAuthClient } from '@neondatabase/auth';
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters';

// Neon Auth (Better Auth) hosted endpoint. Exposed to the browser via Vite env.
const NEON_AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL;

if (!NEON_AUTH_URL) {
  // Surfaced clearly in the console instead of failing with a cryptic network error.
  console.error(
    '[auth] VITE_NEON_AUTH_URL is not set. Sign in/up will not work until it is configured.'
  );
}

// The React adapter exposes the Better Auth client directly:
//   authClient.signIn.email(), authClient.signUp.email(),
//   authClient.signOut(), authClient.getSession(), authClient.useSession(), authClient.updateUser()
export const authClient = createAuthClient(NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});

// Read the current session user outside of React (used by the base44.auth shim).
export async function getSessionUser() {
  try {
    const res = await authClient.getSession();
    const data = res?.data ?? res;
    return data?.user ?? null;
  } catch (error) {
    console.error('[auth] getSession failed:', error);
    return null;
  }
}
