// 1Market stores extra, app-specific profile fields (account type, seller flags,
// payout email, etc.) that are not part of the core auth identity. These are kept
// keyed by the authenticated user's id so the rest of the app keeps the user shape
// it already expects from `base44.auth.me()`.

const STORAGE_KEY = 'onemarket_user_profiles';
const ADMIN_EMAILS = ['kevinarnold522@gmail.com'];

function readAll() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('[profile] failed to persist profile:', error);
  }
}

export function getProfile(userId) {
  if (!userId) return {};
  return readAll()[userId] || {};
}

export function saveProfile(userId, patch) {
  if (!userId) return {};
  const all = readAll();
  all[userId] = { ...(all[userId] || {}), ...patch };
  writeAll(all);
  return all[userId];
}

// Map a Neon Auth user (id, email, name, image, createdAt, ...) plus the local
// profile overlay into the user object the 1Market UI expects.
export function toAppUser(neonUser) {
  if (!neonUser) return null;
  const profile = getProfile(neonUser.id);
  const email = neonUser.email || '';
  const isAdmin =
    profile.role === 'admin' || ADMIN_EMAILS.includes(email.toLowerCase());

  return {
    id: neonUser.id,
    email,
    full_name: profile.full_name || neonUser.name || email.split('@')[0] || 'Member',
    username: profile.username || '',
    username_set: profile.username_set || false,
    role: isAdmin ? 'admin' : profile.role || 'user',
    account_type: profile.account_type || 'customer',
    is_seller: profile.is_seller || false,
    seller_bio: profile.seller_bio || '',
    seller_location: profile.seller_location || '',
    seller_area: profile.seller_area || '',
    seller_page_enabled: profile.seller_page_enabled || false,
    verification_submitted: profile.verification_submitted || false,
    paypal_email: profile.paypal_email || '',
    image: neonUser.image || '',
    created_date: neonUser.createdAt || profile.created_date || null,
    // Spread any other custom fields that have been saved over time.
    ...profile,
  };
}
