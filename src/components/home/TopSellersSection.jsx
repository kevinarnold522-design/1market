import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getAllLocalGhosts, getGhostDisplayName } from '@/lib/ghostAccounts';
import SellerLeaderboardCard from './SellerLeaderboardCard';

const sellerKey = (listing) => listing.created_by_id || listing.owner_user_id || listing.ghost_owner_id || listing.owner_ghost_id || listing.seller_email || listing.email_contact || listing.seller_name || '';

export default function TopSellersSection() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const loadSellers = async () => {
      const [users, listings, hearts, comments] = await Promise.all([
        base44.entities.User.list('-created_date', 200).catch(() => []),
        base44.entities.Listing.list('-created_date', 500).catch(() => []),
        base44.entities.ListingHeart.list('-created_date', 1000).catch(() => []),
        base44.entities.ListingComment.list('-created_date', 1000).catch(() => []),
      ]);

      const localGhosts = getAllLocalGhosts();
      const sellerMap = new Map();

      [...users, ...localGhosts].forEach(user => {
        const id = user.id || user.ghost_id || user.email;
        if (!id) return;
        const isSeller = user.is_seller || user.account_type === 'business_owner' || user.user_type === 'seller' || user.user_type === 'business' || user.is_ghost_account;
        if (!isSeller) return;
        sellerMap.set(id, {
          id,
          username: user.username || id,
          name: user.is_ghost_account ? getGhostDisplayName(user) : (user.channel_name || user.business_name || user.full_name || user.email || 'Seller'),
          avatar: user.profile_picture || '',
          verified: !!user.is_verified_seller,
          listings: 0,
          views: 0,
          hearts: 0,
          comments: 0,
          score: Number(user.seller_points || 0),
          rating: Number(user.rating || 0),
          ratingCount: Number(user.rating_count || 0),
        });
        if (user.ghost_id) sellerMap.set(user.ghost_id, sellerMap.get(id));
        if (user.email) sellerMap.set(user.email, sellerMap.get(id));
      });

      const heartsByListing = hearts.reduce((map, item) => ({ ...map, [item.listing_id]: (map[item.listing_id] || 0) + 1 }), {});
      const commentsByListing = comments.reduce((map, item) => ({ ...map, [item.listing_id]: (map[item.listing_id] || 0) + 1 }), {});

      listings.filter(item => item.approval_status !== 'rejected' && item.is_active !== false).forEach(item => {
        const key = sellerKey(item);
        if (!key) return;
        const seller = sellerMap.get(key) || {
          id: key,
          username: key,
          name: item.approved_channel_name || item.seller_name || 'Seller',
          avatar: '',
          verified: false,
          listings: 0,
          views: 0,
          hearts: 0,
          comments: 0,
          rating: 0,
          ratingCount: 0,
          score: 0,
        };
        const listingHearts = Number(item.heart_count || heartsByListing[item.id] || 0);
        const listingComments = Number(item.comment_count || commentsByListing[item.id] || 0);
        const listingViews = Number(item.view_count || 0);
        seller.listings += 1;
        seller.views += listingViews;
        seller.hearts += listingHearts;
        seller.comments += listingComments;
        seller.score += Number(item.point_count || (listingViews + (listingHearts * 2) + (listingComments * 3)));
        if (item.rating) seller.rating = Math.max(seller.rating, Number(item.rating || 0));
        if (item.rating_count) seller.ratingCount += Number(item.rating_count || 0);
        sellerMap.set(key, seller);
      });

      const unique = Array.from(new Set(Array.from(sellerMap.values())))
        .filter(seller => seller.listings > 0)
        .map(seller => ({
          ...seller,
          score: Math.round(seller.score + (seller.listings * 10)),
        }))
        .sort((a, b) => b.score - a.score || b.views - a.views)
        .slice(0, 10);

      setSellers(unique);
    };

    loadSellers();
  }, []);

  if (!sellers.length) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-[#001a80]/45 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#FFD700]/25 to-[#00D4FF]/15 border border-[#FFD700]/30">
              <Award className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-white">Seller Leaderboard Top 10</h2>
              <p className="font-body text-xs text-white/50">Live users, ghost accounts, and regular sellers ranked together</p>
            </div>
          </div>
          <Link to="/explore" className="hidden sm:inline-flex font-body text-xs font-bold text-[#00D4FF] hover:underline">View listings →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {sellers.map((seller, index) => <SellerLeaderboardCard key={`${seller.id}-${index}`} seller={seller} rank={index + 1} />)}
        </div>
      </div>
    </section>
  );
}