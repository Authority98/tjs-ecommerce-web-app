-- Simple deletion of all orders
-- Executed via Supabase CLI migration
-- WARNING: This permanently deletes ALL orders

-- Delete all orders from the orders table
DELETE FROM orders;

-- Log the action
DO $$
BEGIN
    RAISE NOTICE 'All orders have been deleted successfully via migration.';
END $$;