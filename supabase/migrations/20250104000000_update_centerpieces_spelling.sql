-- Migration: Update "centrepieces" to "centerpieces" for American English spelling
-- Date: 2025-01-04

-- Step 1: Drop the old constraint first to allow updates
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Step 2: Update existing products with centrepieces category to centerpieces
UPDATE products 
SET category = 'centerpieces' 
WHERE category = 'centrepieces';

-- Step 3: Add the new constraint with updated spelling
ALTER TABLE products ADD CONSTRAINT products_category_check 
CHECK (category IN ('decorations', 'ribbons', 'trees', 'centerpieces'));