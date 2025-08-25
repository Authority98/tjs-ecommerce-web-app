-- Debug script to check current RLS policies and permissions on orders table
-- Run this in Supabase SQL Editor to diagnose the RLS issue

-- 1. Check if RLS is enabled on orders table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'orders';

-- 2. List all current RLS policies on orders table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;

-- 3. Check table permissions for different roles
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'orders'
ORDER BY grantee, privilege_type;

-- 4. Check current user and role
SELECT current_user, current_role;

-- 5. Test if we can insert as different roles (this will show which role is being used)
SELECT 
    'anon' as role_name,
    has_table_privilege('anon', 'orders', 'INSERT') as can_insert
UNION ALL
SELECT 
    'public' as role_name,
    has_table_privilege('public', 'orders', 'INSERT') as can_insert
UNION ALL
SELECT 
    'authenticated' as role_name,
    has_table_privilege('authenticated', 'orders', 'INSERT') as can_insert;

-- 6. Check if there are any conflicting policies from other tables that might affect orders
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
AND (policyname LIKE '%order%' OR tablename LIKE '%order%')
ORDER BY tablename, policyname;

-- 7. Show the exact error by attempting a test insert (this will fail but show the exact policy violation)
-- Uncomment the next line to test (it will fail but show which policy is blocking)
-- INSERT INTO orders (id) VALUES ('test-debug-insert');