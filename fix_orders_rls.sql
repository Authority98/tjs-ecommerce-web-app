-- ========================================
-- EMERGENCY FIX FOR ORDERS TABLE RLS
-- ========================================
-- This will fix the "new row violates row-level security policy for table orders" error
-- by ensuring anonymous users can insert orders during checkout
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Copy and paste the SQL commands below
-- 5. Click "Run" to execute
-- ========================================

-- Step 1: Check current RLS status and policies
SELECT 'Current RLS Status:' as info, schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'orders';

SELECT 'Current Policies:' as info;
SELECT 
    policyname, 
    cmd, 
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;

-- Step 2: Remove existing conflicting policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;

-- Step 3: Create new permissive policies
-- Allow anonymous users to insert orders (for checkout)
CREATE POLICY "anon_can_insert_orders" ON orders
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Allow public (including anon) to insert orders
CREATE POLICY "public_can_insert_orders" ON orders
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow authenticated users full access
CREATE POLICY "auth_full_access_orders" ON orders
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Step 4: Grant necessary permissions
GRANT INSERT ON orders TO anon;
GRANT INSERT ON orders TO public;
GRANT ALL ON orders TO authenticated;

-- Step 5: Verify the fix
SELECT 'Final RLS Status:' as check_type, 
       CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_class 
WHERE relname = 'orders';

SELECT 'Final Policies:' as check_type;
SELECT 
    policyname, 
    cmd, 
    roles
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;

SELECT 'Final Permissions:' as check_type;
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'orders'
ORDER BY grantee, privilege_type;

-- ========================================
-- WHAT THIS FIXES:
-- 1. Removes potentially conflicting policies
-- 2. Creates specific policies for anon and public INSERT
-- 3. Ensures authenticated users have full access
-- 4. Grants proper permissions to all roles
-- 5. Orders can now be created during checkout!
-- ========================================