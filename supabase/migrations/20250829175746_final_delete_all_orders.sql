-- FINAL DELETE ALL ORDERS MIGRATION
-- This will delete all 73 orders from the database
-- Executed via Supabase CLI on 2025-08-29

BEGIN;

-- Show current count
DO $$
DECLARE
    current_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO current_count FROM orders;
    RAISE NOTICE '🔢 Current order count: %', current_count;
END $$;

-- Delete all orders
DELETE FROM orders;

-- Confirm deletion
DO $$
DECLARE
    remaining_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_count FROM orders;
    RAISE NOTICE '✅ Orders after deletion: %', remaining_count;
    
    IF remaining_count = 0 THEN
        RAISE NOTICE '🎉 SUCCESS: All orders have been deleted!';
    ELSE
        RAISE EXCEPTION '❌ ERROR: % orders still remain', remaining_count;
    END IF;
END $$;

COMMIT;

-- Final verification
SELECT 
    'DELETION COMPLETE' as status,
    COUNT(*) as remaining_orders,
    CURRENT_TIMESTAMP as deleted_at
FROM orders;