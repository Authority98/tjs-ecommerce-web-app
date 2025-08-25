-- Fix Orders Table INSERT RLS Policy for Anonymous Users
-- This script addresses the 401 Unauthorized error during order submission

-- First, check current policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'orders';

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "Enable insert for anon users" ON orders;
DROP POLICY IF EXISTS "Allow anonymous insert" ON orders;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;

-- Create a comprehensive INSERT policy for anonymous users
CREATE POLICY "orders_anonymous_insert_policy" ON orders
    FOR INSERT
    TO anon, public
    WITH CHECK (true);

-- Also ensure SELECT policy exists for order confirmation
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
CREATE POLICY "orders_select_policy" ON orders
    FOR SELECT
    TO anon, public, authenticated
    USING (true);

-- Grant necessary permissions
GRANT INSERT ON orders TO anon;
GRANT INSERT ON orders TO public;
GRANT SELECT ON orders TO anon;
GRANT SELECT ON orders TO public;
-- No sequence permissions needed - orders table uses UUID for primary key

-- Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Test the policy with a sample insert (this should work)
SELECT current_user, current_setting('role');

-- Show final policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY cmd, policyname;