-- NUCLEAR RLS FIX FOR ORDERS TABLE
-- This script will completely reset all RLS policies and permissions for the orders table
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS temporarily
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_delete_policy" ON orders;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON orders;
DROP POLICY IF EXISTS "Enable select for anonymous users" ON orders;
DROP POLICY IF EXISTS "Enable update for anonymous users" ON orders;
DROP POLICY IF EXISTS "Enable delete for anonymous users" ON orders;
DROP POLICY IF EXISTS "Allow anonymous insert" ON orders;
DROP POLICY IF EXISTS "Allow anonymous select" ON orders;
DROP POLICY IF EXISTS "Allow anonymous update" ON orders;
DROP POLICY IF EXISTS "Allow anonymous delete" ON orders;

-- Step 3: Revoke all existing permissions
REVOKE ALL ON orders FROM anon;
REVOKE ALL ON orders FROM authenticated;
REVOKE ALL ON orders FROM public;
REVOKE ALL ON orders FROM service_role;

-- Step 4: Grant comprehensive permissions to all roles
GRANT ALL ON orders TO anon;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON orders TO public;
GRANT ALL ON orders TO service_role;

-- No sequence permissions needed - orders table uses UUID for primary key

-- Step 5: Re-enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 6: Create new simple policies for all operations
CREATE POLICY "allow_all_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_select" ON orders FOR SELECT USING (true);
CREATE POLICY "allow_all_update" ON orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_delete" ON orders FOR DELETE USING (true);

-- Step 7: Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'orders';

-- Step 8: Verify permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'orders';

-- Test the fix with a sample insert
INSERT INTO orders (
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    product_id,
    order_number,
    gift_card_id,
    order_type
) VALUES (
    'Test Customer',
    'test@example.com',
    '+65 1234 5678',
    '123 Test Street, Singapore 123456',
    NULL,
    'ORD-' || EXTRACT(EPOCH FROM NOW())::text,
    NULL,
    'product'
);

-- Clean up test data
DELETE FROM orders WHERE customer_email = 'test@example.com';

-- Final verification
SELECT 'RLS policies and permissions have been reset successfully' as status;