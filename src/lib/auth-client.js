import { createAuthClient } from '@neondatabase/auth';
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters';

// Neon Auth (Better Auth) hosted endpoint, exposed to the browser via Vite env.
const RAW_URL = import.meta.env.VITE_NEON_AUTH_URL;

// The Neon Auth endpoint is provisioned asynchronously. Until it's ready the env
// var holds the placeholder "provisioning" (or is empty). Treat anything that
// isn't a real http(s) URL as "not ready" so we never crash the whole app by
// constructing a client with an invalid URL.
function isReadyUrl(value) {
  if (!value || value === 'provisioning') return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export const isAuthReady = isReadyUrl(RAW_URL);

const NOT_READY_MESSAGE =
  'Authentication is still being set up. Please try again in a moment.';

// A stub that mirrors the parts of the Better Auth client the app uses, so React
// can render and components can call auth methods without throwing at import time.
function createStubClient() {
  const fail = async () => ({
    data: null,
    error: { message: NOT_READY_MESSAGE },
  });
  return {
    signIn: { email: fail },
    signUp: { email: fail },
    signOut: async () => ({ data: null, error: null }),
    getSession: async () => ({ data: null, error: null }),
    // Better Auth's useSession returns { data, isPending, error, refetch }.
    useSession: () => ({
      data: null,
      isPending: false,
      error: null,
      refetch: async () => {},
    }),
    updateUser: fail,
  };
}

function createRealClient() {
  try {
    return createAuthClient(RAW_URL, {
      adapter: BetterAuthReactAdapter(),
    });
  } catch (error) {
    console.error('[auth] Failed to initialize Neon Auth client:', error);
    return createStubClient();
  }
}

if (!isAuthReady) {
  console.warn(
    `[auth] VITE_NEON_AUTH_URL is not ready yet (value: "${RAW_URL ?? 'undefined'}"). ` +
      'Sign in/up will be available once the Neon Auth endpoint finishes provisioning.'
  );
}

export const authClient = isAuthReady ? createRealClient() : createStubClient();

// Read the current session user outside of React (used by the base44.auth shim).
export async function getSessionUser() {
  if (!isAuthReady) return null;
  try {
    const res = await authClient.getSession();
    const data = res?.data ?? res;
    return data?.user ?? null;
  } catch (error) {
    console.error('[auth] getSession failed:', error);
    return null;
  }
}
