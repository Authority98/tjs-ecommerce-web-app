-- EXECUTE ORDER DELETION NOW
-- Deletes all 73 orders from the Christmas eCommerce database
-- Executed via Supabase CLI migration system
-- Date: 2025-08-29 18:01:04

-- Start transaction
BEGIN;

-- Count orders before deletion
DO $$
DECLARE
    before_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO before_count FROM orders;
    RAISE NOTICE '🔢 Orders before deletion: %', before_count;
END $$;

-- Execute the deletion
DELETE FROM orders;

-- Count orders after deletion and confirm
DO $$
DECLARE
    after_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO after_count FROM orders;
    RAISE NOTICE '✅ Orders after deletion: %', after_count;
    
    IF after_count = 0 THEN
        RAISE NOTICE '🎉 SUCCESS: All orders have been deleted from the database!';
        RAISE NOTICE '📅 Deletion completed at: %', CURRENT_TIMESTAMP;
    ELSE
        RAISE EXCEPTION '❌ FAILURE: % orders still remain in database', after_count;
    END IF;
END $$;

-- Commit the transaction
COMMIT;

-- Final verification query
SELECT 
    'ORDER_DELETION_COMPLETE' as operation,
    COUNT(*) as remaining_orders,
    CURRENT_TIMESTAMP as completed_at
FROM orders;