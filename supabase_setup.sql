-- ====================================================================
-- ANNAPURNA STORE - SUPABASE BACKEND SETUP SCHEMA
-- ====================================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com)
-- to create the required table and configure Row Level Security (RLS).
-- ====================================================================

-- 1. Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,                       -- Store's Order ID (e.g., ord-12345)
  created_at TIMESTAMPTZ DEFAULT NOW(),      -- Timestamp when the order was saved
  total_amount NUMERIC NOT NULL,             -- Total amount paid for the order
  payment_method TEXT NOT NULL,              -- Payment method used ('cod', 'upi', 'card')
  status TEXT NOT NULL,                      -- Status of the order ('pending', 'dispatched', etc.)
  delivery_address JSONB NOT NULL,           -- Full delivery address details (as JSON)
  items JSONB NOT NULL,                      -- Order items purchased (as JSON array)
  user_id TEXT,                              -- Authenticated User ID if logged in (optional)
  eta INTEGER DEFAULT 10                     -- Estimated time of delivery
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Allow anyone (authenticated or anonymous) to insert orders
CREATE POLICY "Allow anonymous and auth insert" ON orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 4. Create Policy: Allow anyone (authenticated or anonymous) to select/read orders
CREATE POLICY "Allow anonymous and auth select" ON orders
  FOR SELECT TO anon, authenticated
  USING (true);

-- 5. Create Policy: Allow updates (for store status changes, optional)
CREATE POLICY "Allow updates" ON orders
  FOR UPDATE TO anon, authenticated
  USING (true);
