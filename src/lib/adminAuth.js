/**
 * SINGLE SOURCE OF TRUTH for admin access control.
 * Only this email is the CEO/admin. No role checks — email only.
 */
export const OWNER_EMAIL = 'kevinarnold522@gmail.com';

/**
 * Returns true ONLY if the given user is the real owner,
 * never for ghost sessions, never for role === 'admin'.
 */
export function isOwnerAccount(user, ghostUser = null) {
  if (ghostUser) return false;
  if (!user?.email) return false;
  return user.email.toLowerCase() === OWNER_EMAIL;
}