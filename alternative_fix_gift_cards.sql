-- ========================================
-- ALTERNATIVE FIX: DISABLE RLS ON GIFT_CARDS
-- ========================================
-- This is a temporary solution if the RLS policies are not working
-- Use this ONLY if the comprehensive fix didn't work
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase dashboard: https://supabase.com/dashboard
-- 2. Select your project: bmdrmzzuzexewzyudrmr
-- 3. Go to SQL Editor
-- 4. Copy and paste the SQL commands below
-- 5. Click "Run" to execute
-- ========================================

-- Option 1: Completely disable RLS on gift_cards table
-- This removes all security restrictions but allows the app to work
ALTER TABLE gift_cards DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 'RLS Status after disable:' as info, schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'gift_cards';

-- ========================================
-- SECURITY NOTE:
-- This removes all access restrictions on gift_cards table
-- Anyone can read/write gift card data
-- Use this only temporarily while we find a better solution
-- ========================================

-- Alternative Option 2: Grant full permissions to anon role
-- (Run this instead of Option 1 if you want to keep RLS enabled)
-- 
-- GRANT ALL ON gift_cards TO anon;
-- GRANT USAGE ON SEQUENCE gift_cards_id_seq TO anon;
-- 
-- -- Create a simple policy that allows everything for anon
-- CREATE POLICY "allow_all_anon" ON gift_cards
--     FOR ALL 
--     TO anon
--     USING (true)
--     WITH CHECK (true);