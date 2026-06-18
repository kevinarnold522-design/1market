import { createClient } from '@base44/sdk';
import { requireSupabase } from '@/lib/supabaseClient';
import { appParams } from '@/lib/app-params';

const base44Fallback = createClient({
  appId: appParams.appId,
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl: appParams.appBaseUrl
});

const entityNames = [
  'User','Listing','Business','Order','Cart','Favourite','Review','MenuItem','Group','GroupPost','GroupComment','GroupMember','GroupPostLike','CommunityPost','Notification','VerificationApplication','Follow','Report','ListingHeart','ListingComment','Reservation','ChatMessage','DraftListing','SavedListingTemplate','UserReward','UserTasks'
];

const tableMap = {
  User: 'users',
  Listing: 'listings',
  Business: 'businesses',
  Order: 'orders',
  Cart: 'carts',
  Favourite: 'favourites',
  Review: 'reviews',
  MenuItem: 'menu_items',
  Group: 'groups',
  GroupPost: 'group_posts',
  GroupComment: 'group_comments',
  GroupMember: 'group_members',
  GroupPostLike: 'group_post_likes',
  CommunityPost: 'community_posts',
  Notification: 'notifications',
  VerificationApplication: 'verification_applications',
  Follow: 'follows',
  Report: 'reports',
  ListingHeart: 'listing_hearts',
  ListingComment: 'listing_comments',
  Reservation: 'reservations',
  ChatMessage: 'chat_messages',
  DraftListing: 'draft_listings',
  SavedListingTemplate: 'saved_listing_templates',
  UserReward: 'user_rewards',
  UserTasks: 'user_tasks'
};

const tableName = (name) => tableMap[name] || name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

function makeEntity(name) {
  const table = tableName(name);
  return {
    async list(sort = '-created_at', limit = 100) {
      const db = requireSupabase();
      const descending = String(sort).startsWith('-');
      const column = String(sort).replace(/^-/, '').replace('created_date', 'created_at').replace('updated_date', 'updated_at');
      const { data, error } = await db.from(table).select('*').order(column || 'created_at', { ascending: !descending }).limit(limit || 100);
      if (error) throw error;
      return data || [];
    },
    async filter(filters = {}, sort = '-created_at', limit = 100) {
      const db = requireSupabase();
      let q = db.from(table).select('*');
      Object.entries(filters || {}).forEach(([key, value]) => { q = q.eq(key, value); });
      const descending = String(sort).startsWith('-');
      const column = String(sort).replace(/^-/, '').replace('created_date', 'created_at').replace('updated_date', 'updated_at');
      const { data, error } = await q.order(column || 'created_at', { ascending: !descending }).limit(limit || 100);
      if (error) throw error;
      return data || [];
    },
    async get(id) {
      const db = requireSupabase();
      const { data, error } = await db.from(table).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(record) {
      const db = requireSupabase();
      const { data, error } = await db.from(table).insert(record).select('*').single();
      if (error) throw error;
      return data;
    },
    async bulkCreate(records) {
      const db = requireSupabase();
      const { data, error } = await db.from(table).insert(records).select('*');
      if (error) throw error;
      return data || [];
    },
    async update(id, patch) {
      const db = requireSupabase();
      const { data, error } = await db.from(table).update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const db = requireSupabase();
      const { error } = await db.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    },
    subscribe(callback) {
      const db = requireSupabase();
      const channel = db.channel(`${table}-changes`).on('postgres_changes', { event: '*', schema: 'public', table }, payload => callback({ type: payload.eventType?.toLowerCase(), data: payload.new, old_data: payload.old })).subscribe();
      return () => db.removeChannel(channel);
    }
  };
}

const entities = Object.fromEntries(entityNames.map(name => [name, makeEntity(name)]));

export const supabaseCompat = {
  entities,
  auth: {
    async ensureProfile(authUser) {
      const db = requireSupabase();
      const profile = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Member'
      };
      const { data, error } = await db.from('profiles').upsert(profile, { onConflict: 'id' }).select('*').single();
      if (error) return profile;
      return data;
    },
    async me() {
      const db = requireSupabase();
      const { data: sessionData, error: sessionError } = await db.auth.getUser();
      if (sessionError) throw sessionError;
      const authUser = sessionData?.user;
      if (!authUser) throw new Error('Not authenticated');
      const { data } = await db.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      return data || this.ensureProfile(authUser);
    },
    async isAuthenticated() {
      const db = requireSupabase();
      const { data } = await db.auth.getSession();
      return !!data?.session;
    },
    async loginViaEmailPassword(email, password) {
      const db = requireSupabase();
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.user) await this.ensureProfile(data.user);
      return data;
    },
    async register({ email, password, full_name }) {
      const db = requireSupabase();
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: full_name || email?.split('@')[0] || 'Member' },
          emailRedirectTo:
            import.meta.env.VITE_DEV_SUPABASE_REDIRECT_URL ||
            import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/login`
        }
      });
      if (error) throw error;
      if (data?.user) await this.ensureProfile(data.user);
      return data;
    },
    async verifyOtp({ email, otpCode }) {
      const db = requireSupabase();
      const { data, error } = await db.auth.verifyOtp({ email, token: otpCode, type: 'signup' });
      if (error) throw error;
      if (data?.user) await this.ensureProfile(data.user);
      return data?.session || data;
    },
    async resendOtp(email) {
      const db = requireSupabase();
      const { data, error } = await db.auth.resend({ type: 'signup', email });
      if (error) throw error;
      return data;
    },
    async loginWithProvider(provider, redirectTo = '/') {
      const db = requireSupabase();
      const { data, error } = await db.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}${redirectTo}` }
      });
      if (error) throw error;
      return data;
    },
    async resetPasswordRequest(email) {
      const db = requireSupabase();
      const { data, error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return data;
    },
    async resetPassword({ newPassword }) {
      const db = requireSupabase();
      const { data, error } = await db.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return data;
    },
    setToken() {
      return true;
    },
    async updateMe(patch) {
      const db = requireSupabase();
      const { data: userData } = await db.auth.getUser();
      const id = userData?.user?.id;
      if (!id) throw new Error('Not authenticated');
      const { data, error } = await db.from('profiles').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
      if (error) throw error;
      return data;
    },
    redirectToLogin(nextUrl = window.location.href) {
      window.location.href = `/login?next=${encodeURIComponent(nextUrl)}`;
    },
    async logout(redirectUrl = '/') {
      const db = requireSupabase();
      await db.auth.signOut();
      window.location.href = redirectUrl;
    }
  },
  functions: {
    async invoke(name, payload = {}) {
      let vercelError = null;
      try {
        const response = await fetch(`/api/${name}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok) return { data, status: response.status, headers: response.headers };
        vercelError = new Error(data.error || `Function ${name} failed`);
      } catch (error) {
        vercelError = error;
      }

      try {
        return await base44Fallback.functions.invoke(name, payload);
      } catch (fallbackError) {
        throw vercelError || fallbackError;
      }
    }
  },
  integrations: { Core: {} },
  users: {
    async inviteUser(email, role = 'user') {
      const res = await fetch('/api/inviteUser', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, role }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invite failed');
      return data;
    }
  }
};
