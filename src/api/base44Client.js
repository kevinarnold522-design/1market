import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { authClient, getSessionUser } from '@/lib/auth-client';
import { toAppUser, saveProfile } from '@/lib/user-profile';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// --- Neon Auth integration -------------------------------------------------
// The app was originally wired to Base44's hosted auth, whose login redirect
// resolved to `undefined/login` (a 404) because no Base44 backend is configured
// here. We back the same `base44.auth.*` surface with Neon Auth so every existing
// caller (me/updateMe/logout/redirectToLogin) keeps working and signing in
// actually authenticates against a real backend.

function notAuthenticated() {
  const error = new Error('Not authenticated');
  error.status = 401;
  return error;
}

base44.auth.me = async () => {
  const user = await getSessionUser();
  if (!user) throw notAuthenticated();
  return toAppUser(user);
};

base44.auth.updateMe = async (patch = {}) => {
  const user = await getSessionUser();
  if (!user) throw notAuthenticated();

  // Keep the core identity name in sync with Neon Auth when it changes.
  const name = patch.full_name || patch.name;
  if (name) {
    try {
      await authClient.updateUser({ name });
    } catch (error) {
      console.error('[auth] updateUser failed:', error);
    }
  }

  saveProfile(user.id, patch);
  return toAppUser(user);
};

base44.auth.logout = async (redirectTo) => {
  try {
    await authClient.signOut();
  } catch (error) {
    console.error('[auth] signOut failed:', error);
  }
  if (redirectTo === false) return;
  window.location.assign(typeof redirectTo === 'string' ? redirectTo : '/');
};

base44.auth.redirectToLogin = (fromUrl) => {
  const redirect = encodeURIComponent(fromUrl || window.location.href);
  window.location.assign(`/login?redirect=${redirect}`);
};
