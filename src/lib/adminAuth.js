/**
 * Admin access control.
 * The owner email always has access; users with role="admin" also have admin access.
 */
export const OWNER_EMAIL = 'kevinarnold522@gmail.com';

export function isAdminAccount(user, ghostUser = null) {
  if (ghostUser) return false;
  if (!user?.email) return false;
  return user.email.toLowerCase() === OWNER_EMAIL || user.role === 'admin';
}

export function isOwnerAccount(user, ghostUser = null) {
  return isAdminAccount(user, ghostUser);
}