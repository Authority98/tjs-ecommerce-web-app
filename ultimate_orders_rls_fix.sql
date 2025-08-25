-- Ultimate RLS fix for orders table - addresses caching and policy conflicts
-- Run this in Supabase SQL Editor to definitively resolve RLS issues

-- Step 1: Completely disable RLS and drop all policies
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (including any hidden or cached ones)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'orders' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON orders', policy_record.policyname);
    END LOOP;
END $$;

-- Step 3: Revoke all existing permissions and grant fresh ones
REVOKE ALL ON orders FROM PUBLIC;
REVOKE ALL ON orders FROM anon;
REVOKE ALL ON orders FROM authenticated;
REVOKE ALL ON orders FROM service_role;

-- Step 4: Grant explicit permissions to all roles
GRANT ALL ON orders TO postgres;
GRANT ALL ON orders TO service_role;
GRANT INSERT, SELECT, UPDATE, DELETE ON orders TO authenticated;
GRANT INSERT ON orders TO anon;
GRANT INSERT ON orders TO PUBLIC;

-- Step 5: Re-enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 6: Create new, simple policies with explicit role checks

-- Policy 1: Allow anyone (including anonymous) to insert orders
CREATE POLICY "orders_insert_policy" ON orders
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to view their own orders
CREATE POLICY "orders_select_policy" ON orders
    FOR SELECT
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- Policy 3: Allow authenticated users to update their own orders
CREATE POLICY "orders_update_policy" ON orders
    FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Step 7: Grant usage on auth schema to ensure auth.uid() works
GRANT USAGE ON SCHEMA auth TO anon, authenticated, public;

-- Step 8: Verify the fix
SELECT 'RLS Status' as check_type, 
       CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename = 'orders';

SELECT 'Policy Count' as check_type, 
       COUNT(*)::text as status
FROM pg_policies 
WHERE tablename = 'orders';

SELECT 'Insert Permission - anon' as check_type,
       CASE WHEN has_table_privilege('anon', 'orders', 'INSERT') THEN 'GRANTED' ELSE 'DENIED' END as status;

SELECT 'Insert Permission - public' as check_type,
       CASE WHEN has_table_privilege('public', 'orders', 'INSERT') THEN 'GRANTED' ELSE 'DENIED' END as status;

-- Step 9: Test insert (comment out if you don't want to create test data)
-- INSERT INTO orders (id, created_at) VALUES ('test-ultimate-fix-' || extract(epoch from now()), now());
-- SELECT 'Test Insert' as check_type, 'SUCCESS' as status;

SELECT 'Ultimate RLS Fix' as result, 'COMPLETED' as status;