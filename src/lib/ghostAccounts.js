const SESSION_KEY = '1m_ghost_session';
const STORAGE_PREFIX = '1m_ghost_';

export function getGhostSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGhostSession(ghost) {
  const cleanGhost = {
    ...ghost,
    id: ghost.id || ghost.ghost_id,
    ghost_id: ghost.ghost_id || ghost.id,
    is_ghost_account: true,
    is_connected_account: true,
    role: 'user',
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(cleanGhost));
  localStorage.setItem(SESSION_KEY, JSON.stringify(cleanGhost));
  window.dispatchEvent(new CustomEvent('ghost-session-changed', { detail: cleanGhost }));
  return cleanGhost;
}

export function clearGhostSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('ghost-session-changed', { detail: null }));
}

export function getAllLocalGhosts() {
  const ghosts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try { ghosts.push(JSON.parse(localStorage.getItem(key))); } catch {}
    }
  }
  return ghosts.sort((a, b) => new Date(b.created_at || b.created_date || 0) - new Date(a.created_at || a.created_date || 0));
}

export function getGhostDisplayName(ghost) {
  return ghost?.channel_name || ghost?.business_name || ghost?.full_name || 'Ghost Account';
}

export function getGhostInitials(ghost) {
  return getGhostDisplayName(ghost).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'G';
}

export function isGhostOwnedRecord(record, ghost) {
  if (!ghost || !record) return false;
  const ghostId = ghost.ghost_id || ghost.id;
  return record.ghost_owner_id === ghostId || record.owner_ghost_id === ghostId || record.created_by_ghost_id === ghostId || record.seller_ghost_id === ghostId || record.created_by_id === ghostId;
}

export function ghostOwnerFields(ghost) {
  if (!ghost) return {};
  const ghostId = ghost.ghost_id || ghost.id;
  return {
    ghost_owner_id: ghostId,
    owner_ghost_id: ghostId,
    created_by_ghost_id: ghostId,
    owner_account_type: 'ghost',
    seller_name: getGhostDisplayName(ghost),
    seller_email: ghost.email || '',
  };
}