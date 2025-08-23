-- manual-seed.sql (renamed from seed.sql)
-- Full schema + data seed for manual one-shot setup.
-- Prefer: use migrations + supabase/seed.sql for normal development.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending_cancellation','cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  downsell_variant TEXT NOT NULL CHECK (downsell_variant IN ('A','B')),
  reason TEXT,
  accepted_downsell BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO users (id, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001','user1@example.com'),
  ('550e8400-e29b-41d4-a716-446655440002','user2@example.com'),
  ('550e8400-e29b-41d4-a716-446655440003','user3@example.com'),
  ('22702cc7-3875-474a-947b-5d4b1aab038b','user@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO subscriptions (user_id, monthly_price, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001',2500,'active'),
  ('550e8400-e29b-41d4-a716-446655440002',2900,'active'),
  ('550e8400-e29b-41d4-a716-446655440003',2500,'active'),
  ('22702cc7-3875-474a-947b-5d4b1aab038b',2500,'active')
ON CONFLICT DO NOTHING;
