import { requireSupabase } from '@/lib/supabaseClient';
import { uploadFileToSupabase, SUPABASE_IMAGE_BUCKET } from '@/lib/supabaseStorage';
import { localListingAI } from '@/lib/localListingAI';

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
      try {
        const db = requireSupabase();
        const descending = String(sort).startsWith('-');
        const column = String(sort).replace(/^-/, '').replace('created_date', 'created_at').replace('updated_date', 'updated_at');
        const { data, error } = await db.from(table).select('*').order(column || 'created_at', { ascending: !descending }).limit(limit || 100);
        if (error) throw error;
        return data || [];
      } catch (error) {
        throw error;
      }
    },
    async filter(filters = {}, sort = '-created_at', limit = 100) {
      try {
        const db = requireSupabase();
        let q = db.from(table).select('*');
        Object.entries(filters || {}).forEach(([key, value]) => { q = q.eq(key, value); });
        const descending = String(sort).startsWith('-');
        const column = String(sort).replace(/^-/, '').replace('created_date', 'created_at').replace('updated_date', 'updated_at');
        const { data, error } = await q.order(column || 'created_at', { ascending: !descending }).limit(limit || 100);
        if (error) throw error;
        return data || [];
      } catch (error) {
        throw error;
      }
    },
    async get(id) {
      try {
        const db = requireSupabase();
        const { data, error } = await db.from(table).select('*').eq('id', id).single();
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
    async create(record) {
      const response = await supabaseCompat.functions.invoke('supabaseEntityWrite', { entity: name, action: 'create', record });
      return response.data.data;
    },
    async bulkCreate(records) {
      const response = await supabaseCompat.functions.invoke('supabaseEntityWrite', { entity: name, action: 'bulkCreate', records });
      return response.data.data || [];
    },
    async update(id, patch) {
      const response = await supabaseCompat.functions.invoke('supabaseEntityWrite', { entity: name, action: 'update', id, patch });
      return response.data.data;
    },
    async delete(id) {
      await supabaseCompat.functions.invoke('supabaseEntityWrite', { entity: name, action: 'delete', id });
      return true;
    },
    subscribe(callback) {
      try {
        const db = requireSupabase();
        const channel = db.channel(`${table}-changes`).on('postgres_changes', { event: '*', schema: 'public', table }, payload => callback({ type: payload.eventType?.toLowerCase(), data: payload.new, old_data: payload.old })).subscribe();
        return () => db.removeChannel(channel);
      } catch (error) {
        return () => {};
      }
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
      const { data, error } = await db.from('users').upsert(profile, { onConflict: 'id' }).select('*').single();
      if (error) return profile;
      return data;
    },
    async me() {
      try {
        const db = requireSupabase();
        const { data: sessionData, error: sessionError } = await db.auth.getUser();
        if (sessionError) throw sessionError;
        const authUser = sessionData?.user;
        if (!authUser) throw new Error('Not authenticated');
        const { data } = await db.from('users').select('*').eq('id', authUser.id).maybeSingle();
        return data || this.ensureProfile(authUser);
      } catch (error) {
        throw error;
      }
    },
    async isAuthenticated() {
      try {
        const db = requireSupabase();
        const { data } = await db.auth.getSession();
        return !!data?.session;
      } catch (error) {
        return false;
      }
    },
    async loginViaEmailPassword(email, password) {
      try {
        const db = requireSupabase();
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data?.session?.access_token) throw new Error('Login did not create a session. Please try again.');
        if (data?.user) await this.ensureProfile(data.user);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async onAuthStateChange(callback) {
      const db = requireSupabase();
      const { data } = db.auth.onAuthStateChange((_event, session) => callback(session));
      return data?.subscription;
    },
    async register({ email, password, full_name }) {
      try {
        const db = requireSupabase();
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: full_name || email?.split('@')[0] || 'Member' },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/')}`
          }
        });
        if (error) throw error;
        if (data?.user) await this.ensureProfile(data.user);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async verifyOtp({ email, otpCode }) {
      try {
        const db = requireSupabase();
        const { data, error } = await db.auth.verifyOtp({ email, token: otpCode, type: 'signup' });
        if (error) throw error;
        if (data?.user) await this.ensureProfile(data.user);
        return data?.session || data;
      } catch (error) {
        throw error;
      }
    },
    async resendOtp(email) {
      const db = requireSupabase();
      const { data, error } = await db.auth.resend({ type: 'signup', email });
      if (error) throw error;
      return data;
    },
    async loginWithProvider(provider, redirectTo = '/') {
      const db = requireSupabase();
      const callbackUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : '/auth/callback';
      const { data, error } = await db.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl, skipBrowserRedirect: false }
      });
      if (error) throw error;
      return data;
    },
    async resetPasswordRequest(email) {
      const db = requireSupabase();
      const resetRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/reset-password')}`;
      const { data, error } = await db.auth.resetPasswordForEmail(email, { redirectTo: resetRedirectTo });
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
      const response = await supabaseCompat.functions.invoke('updateMyProfile', { patch });
      return response.data.user;
    },
    redirectToLogin(nextUrl = window.location.href) {
      window.location.href = `/login?next=${encodeURIComponent(nextUrl)}`;
    },
    async logout(redirectUrl = '/') {
      try {
        const db = requireSupabase();
        await db.auth.signOut();
        window.location.href = redirectUrl;
      } catch (error) {
        window.location.href = redirectUrl || '/';
      }
    }
  },
  functions: {
    async invoke(name, payload = {}) {
      const db = requireSupabase();
      const { data: sessionData } = await db.auth.getSession();
      const functionBase = (
        import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
        `${import.meta.env.VITE_SUPABASE_URL || 'https://ksnzljothfoaefifevch.supabase.co'}/functions/v1`
      ).replace(/\/+$/, '');
      const response = await fetch(`${functionBase}/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionData?.session?.access_token ? { Authorization: `Bearer ${sessionData.session.access_token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Function ${name} failed`);
      return { data, status: response.status, headers: response.headers };
    }
  },
  integrations: {
    Core: {
      async UploadFile({ file }) {
        return uploadFileToSupabase(file, SUPABASE_IMAGE_BUCKET, 'uploads', { allowPdf: true });
      },
      async UploadPrivateFile({ file }) {
        return uploadFileToSupabase(file, SUPABASE_IMAGE_BUCKET, 'private', { allowPdf: true });
      },
      async CreateFileSignedUrl({ file_uri }) {
        return { signed_url: file_uri };
      },
      async SendEmail(payload) {
        const db = requireSupabase();
        const { data, error } = await db.from('1marketph').insert({
          entity_name: 'EmailQueue',
          title: payload.subject || 'Email request',
          user_email: payload.to || '',
          data: payload
        }).select('*').single();
        if (error) throw error;
        return { success: true, queued: true, data };
      },
      async InvokeLLM(payload = {}) {
        return localListingAI(payload);
      }
    }
  },
  users: {
    async inviteUser(email, role = 'user') {
      const res = await fetch('/api/inviteUser', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, role }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invite failed');
      return data;
    }
  }
};