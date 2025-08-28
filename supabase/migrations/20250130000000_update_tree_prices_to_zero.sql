/*
  # Update all tree category products to zero price
  
  This migration sets the price of all products in the 'trees' category to 0,
  similar to what was done for the Bling Bling Christmas tree.
  
  1. Changes
    - Update all products where category = 'trees' to set price = 0
    - This allows trees to show "Price to be determined" in the UI
*/

-- Update all tree category products to have zero price
UPDATE products 
SET price = 0, 
    updated_at = NOW()
WHERE category = 'trees';

-- Log the number of affected rows
DO $$
DECLARE
    affected_count INTEGER;
BEGIN
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RAISE NOTICE 'Updated % tree products to zero price', affected_count;
END $$;