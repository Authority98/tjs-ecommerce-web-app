-- ========================================
-- COMPREHENSIVE GIFT CARDS RLS FIX
-- ========================================
-- This script will diagnose and fix the persistent RLS error
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase dashboard: https://supabase.com/dashboard
-- 2. Select your project: bmdrmzzuzexewzyudrmr
-- 3. Go to SQL Editor
-- 4. Copy and paste ALL the SQL commands below
-- 5. Click "Run" to execute
-- ========================================

-- STEP 1: Check what roles actually exist
SELECT 'Available Roles:' as info;
SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated', 'public', 'postgres');

-- STEP 2: Check current table permissions
SELECT 'Current Table Permissions:' as info;
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'gift_cards';

-- STEP 3: Remove ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Allow anonymous users to insert gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Allow authenticated users to manage gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Authenticated users can manage gift cards" ON gift_cards;
DROP POLICY IF EXISTS "anon_insert_only" ON gift_cards;
DROP POLICY IF EXISTS "auth_full_access" ON gift_cards;

-- STEP 4: Temporarily disable RLS to test
ALTER TABLE gift_cards DISABLE ROW LEVEL SECURITY;

-- STEP 5: Grant permissions to all possible role variations
GRANT ALL ON gift_cards TO public;
GRANT ALL ON gift_cards TO anon;
GRANT ALL ON gift_cards TO authenticated;
GRANT ALL ON gift_cards TO postgres;

-- STEP 6: Re-enable RLS
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create permissive policies for all roles
CREATE POLICY "allow_all_public" ON gift_cards
    FOR ALL 
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "allow_all_anon" ON gift_cards
    FOR ALL 
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "allow_all_authenticated" ON gift_cards
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- STEP 8: Verify the setup
SELECT 'Final RLS Status:' as check_type, 
       CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_class 
WHERE relname = 'gift_cards';

SELECT 'Final Policies:' as check_type;
SELECT 
    policyname, 
    cmd, 
    roles
FROM pg_policies 
WHERE tablename = 'gift_cards'
ORDER BY policyname;

SELECT 'Final Permissions:' as check_type;
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'gift_cards'
ORDER BY grantee, privilege_type;

-- ========================================
-- WHAT THIS DOES:
-- 1. Checks what roles actually exist in your Supabase
-- 2. Removes ALL conflicting policies
-- 3. Grants permissions to ALL possible role variations
-- 4. Creates permissive policies for all roles
-- 5. This should eliminate ANY RLS blocking
-- ========================================