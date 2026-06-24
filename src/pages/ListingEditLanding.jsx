import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddListingModal from '@/components/AddListingModal';
import RoyalBlueWaves from '@/components/RoyalBlueWaves';
import { base44 } from '@/api/base44Client';

export default function ListingEditLanding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [listing, setListing] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const init = async () => {
      let currentUser = null;
      try {
        const isAuthed = await base44.auth.isAuthenticated();
        if (!isAuthed) {
          base44.auth.redirectToLogin(window.location.href);
          return;
        }
        currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      try {
        const items = await base44.entities.Listing.filter({ id });
        const found = items[0] || null;
        setListing(found);

        const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
        const isOwner = !!(found && currentUser && (
          currentUser.id === found.created_by_id ||
          currentUser.email === found.owner_email ||
          currentUser.email === found.created_by
        ));
        setAuthorized(isAdmin || isOwner);
      } catch {
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #dff3ff 56%, #bfdbfe 100%)' }}>
        <RoyalBlueWaves />
        <div className="relative z-20 w-10 h-10 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #dff3ff 56%, #bfdbfe 100%)' }}>
        <RoyalBlueWaves />
        <div className="relative z-20 text-center px-6">
          <p className="font-body text-sky-700 text-lg">Listing not found.</p>
          <Link to="/" className="inline-flex mt-3 px-6 py-2.5 bg-sky-500 text-white rounded-xl font-body font-bold text-sm hover:bg-sky-400 transition-colors">Go Home</Link>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #dff3ff 56%, #bfdbfe 100%)' }}>
        <RoyalBlueWaves />
        <div className="relative z-20 text-center px-6">
          <p className="font-body text-sky-700 text-lg">You do not have permission to edit this listing.</p>
          <button onClick={() => navigate(`/listing/${id}`)} className="inline-flex mt-3 px-6 py-2.5 bg-sky-500 text-white rounded-xl font-body font-bold text-sm hover:bg-sky-400 transition-colors">Back to Listing</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #dff3ff 56%, #bfdbfe 100%)' }}>
      <RoyalBlueWaves />
      <AddListingModal
        user={user}
        editMode
        listingId={listing.id}
        initialListing={listing}
        onSaved={(updated) => setListing(updated || listing)}
        onClose={() => navigate(`/listing/${listing.id}`)}
      />
    </div>
  );
}
