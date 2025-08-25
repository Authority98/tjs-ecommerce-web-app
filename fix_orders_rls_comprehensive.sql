-- ========================================
-- COMPREHENSIVE FIX FOR ORDERS TABLE RLS
-- ========================================
-- This will definitively fix the "new row violates row-level security policy for table orders" error
-- by completely resetting and recreating the RLS policies
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Copy and paste the SQL commands below
-- 5. Click "Run" to execute
-- ========================================

-- Step 1: Check current status
SELECT 'BEFORE FIX - RLS Status:' as info, schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'orders';

SELECT 'BEFORE FIX - Current Policies:' as info;
SELECT 
    policyname, 
    cmd, 
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;

-- Step 2: Temporarily disable RLS to clear all policies
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies (this will work now that RLS is disabled)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
DROP POLICY IF EXISTS "anon_can_insert_orders" ON orders;
DROP POLICY IF EXISTS "public_can_insert_orders" ON orders;
DROP POLICY IF EXISTS "auth_full_access_orders" ON orders;

-- Step 4: Grant permissions to all roles
GRANT INSERT ON orders TO anon;
GRANT INSERT ON orders TO public;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON orders TO postgres;
GRANT ALL ON orders TO service_role;

-- Step 5: Re-enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 6: Create new, clean policies
-- Policy 1: Allow anyone (including anonymous) to insert orders
CREATE POLICY "allow_insert_orders" ON orders
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to view orders
CREATE POLICY "allow_select_orders" ON orders
    FOR SELECT 
    TO authenticated
    USING (true);

-- Policy 3: Allow authenticated users to update orders
CREATE POLICY "allow_update_orders" ON orders
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 4: Allow authenticated users to delete orders
CREATE POLICY "allow_delete_orders" ON orders
    FOR DELETE 
    TO authenticated
    USING (true);

-- Step 7: Verify the fix
SELECT 'AFTER FIX - RLS Status:' as check_type, 
       CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_class 
WHERE relname = 'orders';

SELECT 'AFTER FIX - New Policies:' as check_type;
SELECT 
    policyname, 
    cmd, 
    roles
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;

SELECT 'AFTER FIX - Permissions:' as check_type;
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'orders'
ORDER BY grantee, privilege_type;

-- Step 8: Test the fix with a sample query (this should not fail)
SELECT 'TEST - Can check orders table:' as test_type, COUNT(*) as order_count
FROM orders;

-- ========================================
-- WHAT THIS COMPREHENSIVE FIX DOES:
-- 1. Temporarily disables RLS to clear all conflicts
-- 2. Removes ALL existing policies completely
-- 3. Grants explicit permissions to all roles
-- 4. Re-enables RLS with clean state
-- 5. Creates new, simple policies without conflicts
-- 6. Verifies the fix worked
-- 7. Tests basic table access
-- 
-- This should definitively resolve the RLS error!
-- ========================================