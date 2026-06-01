-- ============================================================
-- MTG Hub — Supabase Schema
-- Run this in the Supabase SQL editor (one-shot)
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  is_public     BOOLEAN DEFAULT FALSE,  -- true = anyone can follow, false = friends only
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-insert a placeholder profile row on signup (username set in ProfileSetup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    'user_' || substr(NEW.id::text, 1, 8),  -- temp username until setup
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Connections (friendships + follows) ──────────────────────────────────
CREATE TABLE public.connections (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  addressee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  -- 'pending'  = friend request sent, awaiting acceptance
  -- 'friend'   = mutual friendship accepted
  -- 'follow'   = one-way follow of a public profile
  status       TEXT NOT NULL CHECK (status IN ('pending', 'friend', 'follow')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- ── Collection cards ──────────────────────────────────────────────────────
CREATE TABLE public.collection_cards (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  scryfall_id TEXT NOT NULL,
  set_code    TEXT,
  set_name    TEXT,
  type_line   TEXT,
  mana_cost   TEXT,
  image_uri   TEXT,
  price       DECIMAL(10,2),
  price_foil  DECIMAL(10,2),
  quantity    INTEGER NOT NULL DEFAULT 1,
  condition   TEXT NOT NULL DEFAULT 'NM',
  foil        BOOLEAN DEFAULT FALSE,
  for_trade   BOOLEAN DEFAULT FALSE,
  trade_note  TEXT,
  added_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Price watchlist ───────────────────────────────────────────────────────
CREATE TABLE public.price_watchlist (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scryfall_id           TEXT NOT NULL,
  name                  TEXT NOT NULL,
  set_code              TEXT,
  set_name              TEXT,
  image_uri             TEXT,
  alert_threshold_high  DECIMAL(10,2),
  alert_threshold_low   DECIMAL(10,2),
  added_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scryfall_id)
);

-- ── Trade listings ────────────────────────────────────────────────────────
CREATE TABLE public.trade_listings (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  collection_card_id UUID REFERENCES public.collection_cards(id) ON DELETE SET NULL,
  card_name          TEXT NOT NULL,
  scryfall_id        TEXT NOT NULL,
  set_name           TEXT,
  image_uri          TEXT,
  quantity           INTEGER NOT NULL DEFAULT 1,
  condition          TEXT NOT NULL,
  foil               BOOLEAN DEFAULT FALSE,
  asking_price       DECIMAL(10,2),  -- null = open to trade only
  wants              TEXT,           -- "Looking for fetch lands, Tarmogoyf"
  notes              TEXT,
  status             TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'completed', 'cancelled')),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Trade offers ──────────────────────────────────────────────────────────
CREATE TABLE public.trade_offers (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id     UUID REFERENCES public.trade_listings(id) ON DELETE CASCADE NOT NULL,
  offerer_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  -- offered_cards: [{name, scryfallId, imageUri, quantity, condition, foil}]
  offered_cards  JSONB NOT NULL DEFAULT '[]',
  cash_offer     DECIMAL(10,2),
  message        TEXT,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Activity feed ─────────────────────────────────────────────────────────
CREATE TABLE public.activities (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  -- card_added | trade_listed | trade_completed | price_alert
  type          TEXT NOT NULL,
  card_name     TEXT,
  card_image_uri TEXT,
  quantity      INTEGER,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_watchlist  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_listings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_offers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities       ENABLE ROW LEVEL SECURITY;

-- Helper: returns true if the viewer is a friend of target_user
CREATE OR REPLACE FUNCTION public.is_friend(target_user UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connections
    WHERE status = 'friend'
      AND ((requester_id = auth.uid() AND addressee_id = target_user)
        OR (addressee_id = auth.uid() AND requester_id = target_user))
  );
$$;

-- profiles: public profiles visible to all; private only to friends + self
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (is_public OR id = auth.uid() OR public.is_friend(id));
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- connections: both parties can see; requester inserts; either party can update (accept/decline)
CREATE POLICY "connections_select" ON public.connections FOR SELECT
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());
CREATE POLICY "connections_insert" ON public.connections FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "connections_update" ON public.connections FOR UPDATE
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());
CREATE POLICY "connections_delete" ON public.connections FOR DELETE
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

-- collection_cards: owner sees all; friends see all; strangers see nothing
CREATE POLICY "collection_select" ON public.collection_cards FOR SELECT
  USING (user_id = auth.uid() OR public.is_friend(user_id));
CREATE POLICY "collection_insert" ON public.collection_cards FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "collection_update" ON public.collection_cards FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "collection_delete" ON public.collection_cards FOR DELETE USING (user_id = auth.uid());

-- price_watchlist: owner only
CREATE POLICY "watchlist_all" ON public.price_watchlist FOR ALL USING (user_id = auth.uid());

-- trade_listings: available listings visible to friends + self; all statuses only to owner
CREATE POLICY "listings_select" ON public.trade_listings FOR SELECT
  USING (user_id = auth.uid() OR (status = 'available' AND public.is_friend(user_id)));
CREATE POLICY "listings_insert" ON public.trade_listings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "listings_update" ON public.trade_listings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "listings_delete" ON public.trade_listings FOR DELETE USING (user_id = auth.uid());

-- trade_offers: offerer and listing owner can see
CREATE POLICY "offers_select" ON public.trade_offers FOR SELECT
  USING (
    offerer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.trade_listings WHERE id = listing_id AND user_id = auth.uid())
  );
CREATE POLICY "offers_insert" ON public.trade_offers FOR INSERT WITH CHECK (offerer_id = auth.uid());
CREATE POLICY "offers_update" ON public.trade_offers FOR UPDATE
  USING (
    offerer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.trade_listings WHERE id = listing_id AND user_id = auth.uid())
  );

-- activities: owner + friends
CREATE POLICY "activities_select" ON public.activities FOR SELECT
  USING (user_id = auth.uid() OR public.is_friend(user_id));
CREATE POLICY "activities_insert" ON public.activities FOR INSERT WITH CHECK (user_id = auth.uid());

-- ── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX ON public.collection_cards (user_id);
CREATE INDEX ON public.collection_cards (for_trade) WHERE for_trade = TRUE;
CREATE INDEX ON public.trade_listings (status, user_id);
CREATE INDEX ON public.trade_offers (listing_id);
CREATE INDEX ON public.trade_offers (offerer_id);
CREATE INDEX ON public.activities (user_id, created_at DESC);
CREATE INDEX ON public.connections (requester_id, addressee_id, status);
