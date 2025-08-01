-- ========================================
-- TARGETED FIX FOR GIFT CARDS RLS CONFLICTS
-- ========================================
-- Issue: Multiple conflicting policies are causing RLS violations
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase dashboard: https://supabase.com/dashboard
-- 2. Select your project: bmdrmzzuzexewzyudrmr
-- 3. Go to SQL Editor
-- 4. Copy and paste ALL the SQL commands below
-- 5. Click "Run" to execute
-- ========================================

-- Step 1: Remove ALL existing conflicting policies
DROP POLICY IF EXISTS "Allow anonymous users to insert gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Allow authenticated users to manage gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Authenticated users can manage gift cards" ON gift_cards;

-- Step 2: Ensure RLS is enabled
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy for anonymous users (INSERT only)
CREATE POLICY "anon_insert_only" ON gift_cards
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Step 4: Create policy for authenticated users (ALL operations)
CREATE POLICY "auth_full_access" ON gift_cards
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Step 5: Grant necessary permissions
GRANT INSERT ON gift_cards TO anon;
GRANT ALL ON gift_cards TO authenticated;

-- Step 6: Verify the clean setup
SELECT 'RLS Status:' as check_type, 
       CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_class 
WHERE relname = 'gift_cards';

SELECT 'Policies Created:' as check_type;
SELECT 
    policyname, 
    cmd, 
    roles
FROM pg_policies 
WHERE tablename = 'gift_cards'
ORDER BY policyname;

-- ========================================
-- WHAT THIS FIXED:
-- 1. Removed ALL conflicting policies
-- 2. Ensured RLS is enabled
-- 3. Created exactly 2 clean policies:
--    - anon_insert_only: Allows anonymous INSERT
--    - auth_full_access: Allows authenticated ALL operations
-- 4. Granted proper permissions
-- 5. No more policy conflicts!
-- ========================================