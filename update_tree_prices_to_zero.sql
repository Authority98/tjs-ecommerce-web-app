-- Update all tree category products to zero price
-- Run this SQL in your Supabase dashboard SQL editor

-- Update all tree category products to have zero price
UPDATE products 
SET price = 0, 
    updated_at = NOW()
WHERE category = 'trees';

-- Check the results
SELECT 
    id,
    title,
    price,
    category,
    updated_at
FROM products 
WHERE category = 'trees'
ORDER BY title;