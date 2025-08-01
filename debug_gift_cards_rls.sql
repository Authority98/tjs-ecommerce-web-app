-- ========================================
-- DIAGNOSTIC SCRIPT FOR GIFT CARDS RLS ISSUE
-- ========================================
-- Run this in your Supabase SQL Editor to diagnose the problem

-- Step 1: Check if RLS is enabled on gift_cards table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'gift_cards';

-- Step 2: Check current policies on gift_cards table
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
WHERE tablename = 'gift_cards'
ORDER BY policyname;

-- Step 3: Check if the table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'gift_cards' 
ORDER BY ordinal_position;

-- Step 4: Test anonymous role permissions (DIAGNOSTIC ONLY)
-- This will show what the anonymous role can actually do
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'gift_cards';

-- ========================================
-- EXPECTED RESULTS:
-- 1. rowsecurity should be 't' (true)
-- 2. Should see 2 policies for gift_cards
-- 3. Should see table structure with all columns
-- 4. Should see permissions for different roles
-- ========================================