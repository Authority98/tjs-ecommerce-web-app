-- COMPREHENSIVE DATABASE DIAGNOSTIC SCRIPT
-- Run this in Supabase SQL Editor to understand the current state
-- This will help us identify what's missing or misconfigured

-- ========================================
-- 1. CHECK ALL TABLES AND THEIR STRUCTURE
-- ========================================
SELECT 'TABLE STRUCTURE ANALYSIS' as section;

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('orders', 'products', 'gift_cards', 'delivery_zones', 'discount_codes')
ORDER BY table_name, ordinal_position;

-- ========================================
-- 2. CHECK ALL CONSTRAINTS
-- ========================================
SELECT 'CONSTRAINTS ANALYSIS' as section;

-- Primary keys
SELECT 
    'PRIMARY KEY' as constraint_type,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('orders', 'products', 'gift_cards', 'delivery_zones', 'discount_codes')
ORDER BY tc.table_name;

-- Foreign keys
SELECT 
    'FOREIGN KEY' as constraint_type,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('orders', 'products', 'gift_cards', 'delivery_zones', 'discount_codes')
ORDER BY tc.table_name;

-- Check constraints
SELECT 
    'CHECK CONSTRAINT' as constraint_type,
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('orders', 'products', 'gift_cards', 'delivery_zones', 'discount_codes')
ORDER BY tc.table_name;

-- ========================================
-- 3. CHECK RLS STATUS AND POLICIES
-- ========================================
SELECT 'RLS POLICIES ANALYSIS' as section;

-- RLS status for each table
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
    AND tablename IN ('orders', 'products', 'gift_cards', 'delivery_zones', 'discount_codes')
ORDER BY tablename;

-- All policies
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
WHERE schemaname = 'public'
    AND tablename IN ('orders', 'products', 'gift_cards', 'delivery_zones', 'discount_codes')
ORDER BY tablename, policyname;

-- ========================================
-- 4. CHECK PERMISSIONS
-- ========================================
SELECT 'PERMISSIONS ANALYSIS' as section;

SELECT 
    table_name,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_schema = 'public'
    AND table_name IN ('orders', 'products', 'gift_cards', 'delivery_zones', 'discount_codes')
    AND grantee IN ('anon', 'authenticated', 'public', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- ========================================
-- 5. CHECK SAMPLE DATA
-- ========================================
SELECT 'SAMPLE DATA ANALYSIS' as section;

-- Check if we have any products
SELECT 'products' as table_name, COUNT(*) as record_count FROM products;

-- Check if we have any gift cards
SELECT 'gift_cards' as table_name, COUNT(*) as record_count FROM gift_cards;

-- Check if we have any orders
SELECT 'orders' as table_name, COUNT(*) as record_count FROM orders;

-- Sample product IDs (if any)
SELECT 'Sample Product IDs' as info, id, title FROM products LIMIT 3;

-- Sample gift card IDs (if any)
SELECT 'Sample Gift Card IDs' as info, id, amount, recipient_name, sender_name FROM gift_cards LIMIT 3;

-- ========================================
-- 6. TEST ANONYMOUS ACCESS
-- ========================================
SELECT 'ANONYMOUS ACCESS TEST' as section;

-- This will show what the anonymous user can actually do
SET ROLE anon;

-- Test SELECT permissions
SELECT 'Testing SELECT as anon' as test;
SELECT COUNT(*) as can_select_products FROM products;
SELECT COUNT(*) as can_select_gift_cards FROM gift_cards;
SELECT COUNT(*) as can_select_orders FROM orders;

-- Reset role
RESET ROLE;

SELECT 'DIAGNOSTIC COMPLETE - Review all sections above' as final_status;