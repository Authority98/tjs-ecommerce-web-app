-- Migration: Delete All Orders
-- WARNING: This will permanently delete ALL orders from the database
-- This is a one-time administrative operation
-- Executed on: 2025-08-29

-- Delete all orders from the orders table
DELETE FROM orders;

-- Optional: Add a comment for audit trail
COMMENT ON TABLE orders IS 'Orders table - all existing orders deleted on 2025-08-29 via admin request';

-- Verify deletion (should return 0)
SELECT COUNT(*) as remaining_orders_count FROM orders;