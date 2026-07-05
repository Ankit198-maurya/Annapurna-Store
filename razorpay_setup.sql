-- ====================================================================
-- RAZORPAY AUTOMATED UPI PAYMENTS - POSTGRESQL SCHEMA SETUP
-- ====================================================================
-- Senior Backend Engineer Notes:
-- 1. We use standard VARCHAR(100) for the order_id as Razorpay IDs are alphanumeric strings.
-- 2. We use NUMERIC(10, 2) for amounts to avoid floating-point rounding issues common with FLOAT or REAL.
-- 3. We implement a status CHECK constraint to restrict values to 'pending', 'paid', or 'failed'.
-- 4. An index is added to user_id for rapid user order history lookup, and on status to speed up administrative analytics.
-- ====================================================================

-- Create custom check constraint or domain if desired, or keep it in-line
CREATE TABLE IF NOT EXISTS razorpay_orders (
  order_id VARCHAR(100) PRIMARY KEY,                 -- Razorpay generated unique Order ID (e.g., 'order_MhZ8oEpB9fE89k')
  user_id VARCHAR(100) NOT NULL,                     -- App User ID reference
  amount NUMERIC(10, 2) NOT NULL,                    -- Paid amount (in INR)
  status VARCHAR(20) NOT NULL DEFAULT 'pending',     -- Order status ('pending', 'paid', 'failed')
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),     -- Record creation time
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),     -- Record update time
  
  -- Prevent unexpected statuses at the database layer (Defense-in-Depth)
  CONSTRAINT check_payment_status CHECK (status IN ('pending', 'paid', 'failed'))
);

-- Indices for high-concurrency performance optimization
CREATE INDEX IF NOT EXISTS idx_razorpay_orders_user_id ON razorpay_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_orders_status ON razorpay_orders(status);

-- Automatic updated_at trigger helper (PostgreSQL specific best practice)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp update trigger to the razorpay_orders table
DROP TRIGGER IF EXISTS set_timestamp_razorpay_orders ON razorpay_orders;
CREATE TRIGGER set_timestamp_razorpay_orders
BEFORE UPDATE ON razorpay_orders
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
