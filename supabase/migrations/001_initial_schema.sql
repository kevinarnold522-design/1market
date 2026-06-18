-- 1MarketPH Supabase initial schema for Vercel migration
-- Apply this file in Supabase SQL Editor or via `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text,
  email text unique,
  role text default 'user',
  username text unique,
  username_set boolean default false,
  user_type text default 'customer',
  is_seller boolean default false,
  account_type text default 'customer',
  business_name text,
  channel_name text,
  bio text,
  seller_bio text,
  profile_picture text,
  cover_photo text,
  seller_location text,
  location text,
  seller_area text,
  seller_page_enabled boolean default false,
  is_verified_seller boolean default false,
  verification_submitted boolean default false,
  is_ghost_account boolean default false,
  is_connected_account boolean default false,
  ghost_id text,
  ghost_linked boolean default false,
  created_by_admin_id uuid,
  created_by_admin_email text,
  phone text,
  show_phone_public boolean default false,
  show_email_public boolean default false,
  social_facebook text,
  social_instagram text,
  social_tiktok text,
  social_twitter text,
  social_youtube text,
  social_viber text,
  social_telegram text,
  seller_products jsonb default '[]'::jsonb,
  business_categories jsonb default '[]'::jsonb
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  title text not null,
  main_category text,
  type text not null,
  approval_status text default 'pending',
  border_color text default '#00D4FF',
  subcategory text,
  extra_subcategories jsonb default '[]'::jsonb,
  business_id uuid,
  price numeric,
  original_price numeric,
  price_label text,
  quantity integer default 1,
  flash_deal_active boolean default false,
  flash_deal_end text,
  location text not null,
  area text,
  meetup_location text,
  seller_name text,
  seller_email text,
  phone text,
  email_contact text,
  apply_link text,
  description text,
  image_url text,
  extra_images jsonb default '[]'::jsonb,
  video_url text,
  preview_media text,
  condition text,
  brand text,
  model text,
  year integer,
  mileage text,
  transmission text,
  size text,
  is_active boolean default true,
  view_count integer default 0,
  rating numeric default 0,
  rating_count integer default 0,
  delivery_options jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  name text not null,
  category text,
  type text,
  section text not null,
  location text not null default 'Manila',
  area text,
  address text,
  hours text,
  tag text,
  logo_url text,
  image_url text,
  extra_images jsonb default '[]'::jsonb,
  menu jsonb default '[]'::jsonb,
  phone text,
  description text,
  is_active boolean default true,
  rating numeric default 0,
  rating_count integer default 0
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  listing_id uuid,
  name text not null,
  description text,
  price numeric default 0,
  price_label text,
  image_url text,
  category text,
  is_available boolean default true,
  notes text
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  listing_id uuid,
  listing_title text,
  listing_image text,
  price_label text,
  price numeric,
  buyer_email text not null,
  buyer_name text,
  seller_email text not null,
  seller_name text,
  status text default 'pending',
  seller_confirmed_delivery boolean default false,
  buyer_confirmed_received boolean default false,
  notes text
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete cascade,
  user_email text not null,
  listing_id uuid,
  listing_title text,
  listing_image text,
  price numeric,
  price_label text,
  seller_name text,
  seller_email text,
  quantity integer default 1,
  area text
);

create table if not exists public.favourites (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete cascade,
  user_email text not null,
  listing_id uuid,
  item_ref text,
  title text not null,
  image_url text,
  price_label text,
  category text not null,
  area text
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  business_id uuid,
  listing_id uuid,
  reviewer_name text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  photo_url text
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  listing_id uuid,
  listing_title text,
  seller_email text not null,
  buyer_email text not null,
  sender_email text not null,
  sender_name text,
  message text not null,
  is_read boolean default false,
  chat_type text default 'listing'
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  user_email text not null,
  type text not null,
  message text not null,
  listing_id uuid,
  listing_title text,
  from_user_name text,
  is_read boolean default false
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  name text not null,
  description text,
  cover_image text,
  category text,
  creator_email text not null,
  creator_name text,
  member_count integer default 1,
  approval_status text default 'pending',
  admin_note text,
  is_private boolean default false
);

create table if not exists public.group_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by_id uuid references public.users(id) on delete set null,
  group_id uuid,
  author_email text not null,
  author_name text,
  author_picture text,
  content text not null,
  image_url text,
  post_type text default 'post',
  listing_id uuid,
  listing_data jsonb default '{}'::jsonb,
  approval_status text default 'approved',
  likes integer default 0,
  comment_count integer default 0
);

create table if not exists public.group_comments (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete set null, post_id uuid, group_id uuid, author_email text not null, author_name text, content text not null);
create table if not exists public.group_members (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, group_id uuid, user_email text not null, user_name text, role text default 'member');
create table if not exists public.group_post_likes (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, post_id uuid, user_email text not null);
create table if not exists public.community_posts (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete set null, business_id uuid, business_name text, author_name text, author_email text not null, content text not null, image_url text, likes integer default 0, comment_count integer default 0, post_type text default 'update');
create table if not exists public.verification_applications (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete set null, user_id uuid, user_email text not null, user_name text, account_type text, doc1_url text, doc2_url text, doc3_url text, doc1_label text, doc2_label text, doc3_label text, status text default 'pending', admin_note text, reviewed_by text);
create table if not exists public.reports (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete set null, listing_id uuid, listing_title text, reporter_email text not null, reporter_name text, reason text not null, details text, status text default 'pending', admin_note text);
create table if not exists public.follows (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, follower_email text not null, following_user_id uuid, following_email text);
create table if not exists public.listing_hearts (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, listing_id uuid, user_email text not null);
create table if not exists public.listing_comments (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete set null, listing_id uuid, listing_type text, user_email text, user_name text, comment text not null, rating integer check (rating between 1 and 5), hearts integer default 0);
create table if not exists public.reservations (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete set null, listing_id uuid, listing_title text, hotel_name text, room_type text, guest_name text, guest_email text not null, guest_phone text, check_in_date date not null, check_out_date date not null, num_guests integer default 1, num_nights integer, total_price numeric, price_per_night numeric, status text default 'pending', payment_status text default 'unpaid', paypal_order_id text, seller_email text, special_requests text, check_in_time text, check_out_time text);
create table if not exists public.draft_listings (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, data jsonb not null default '{}'::jsonb);
create table if not exists public.saved_listing_templates (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, user_id uuid, user_email text, name text not null, form_data jsonb not null default '{}'::jsonb);
create table if not exists public.user_rewards (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, user_email text not null, user_id uuid, total_centavos numeric default 0, last_claimed_date text, streak_days integer default 0);
create table if not exists public.user_tasks (id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(), created_by_id uuid references public.users(id) on delete cascade, user_email text not null, user_id uuid, task_type text not null, completed boolean default false, completed_date text, reward_claimed boolean default false, points integer default 0);

create index if not exists idx_listings_created_by on public.listings(created_by_id);
create index if not exists idx_listings_status on public.listings(approval_status, is_active);
create index if not exists idx_chat_participants on public.chat_messages(seller_email, buyer_email);
create index if not exists idx_notifications_user on public.notifications(user_email, is_read);
create index if not exists idx_created_accounts_admin on public.users(created_by_admin_id);

alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.businesses enable row level security;
alter table public.chat_messages enable row level security;
alter table public.notifications enable row level security;

create policy "users can read public profiles" on public.users for select using (true);
create policy "users can insert own profile" on public.users for insert with check (auth.uid() = id);
create policy "users can update own profile" on public.users for update using (auth.uid() = id);
create policy "public approved listings are readable" on public.listings for select using (is_active = true and approval_status = 'approved');
create policy "users manage own listings" on public.listings for all using (auth.uid() = created_by_id) with check (auth.uid() = created_by_id);
create policy "businesses are public readable" on public.businesses for select using (is_active = true);
create policy "users manage own businesses" on public.businesses for all using (auth.uid() = created_by_id) with check (auth.uid() = created_by_id);
create policy "users read own chats" on public.chat_messages for select using (sender_email = auth.jwt()->>'email' or seller_email = auth.jwt()->>'email' or buyer_email = auth.jwt()->>'email');
create policy "users insert own chats" on public.chat_messages for insert with check (sender_email = auth.jwt()->>'email');
create policy "users read own notifications" on public.notifications for select using (user_email = auth.jwt()->>'email');

create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger listings_set_updated_at before update on public.listings for each row execute function public.set_updated_at();
create trigger businesses_set_updated_at before update on public.businesses for each row execute function public.set_updated_at();
create trigger chat_messages_set_updated_at before update on public.chat_messages for each row execute function public.set_updated_at();
create trigger notifications_set_updated_at before update on public.notifications for each row execute function public.set_updated_at();