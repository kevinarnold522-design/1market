export function isPublishedListing(listing) {
  if (!listing || listing.is_active === false) return false;
  const status = String(listing.approval_status || '').toLowerCase();
  if (status === 'rejected') return false;
  // Treat legacy records without explicit status as publishable if active.
  return status === '' || status === 'approved' || status === 'published';
}

export function filterPublishedListings(items = []) {
  return items.filter(isPublishedListing);
}

export function dedupeById(items = []) {
  const map = new Map();
  items.forEach((item) => {
    if (!item?.id || map.has(item.id)) return;
    map.set(item.id, item);
  });
  return Array.from(map.values());
}
