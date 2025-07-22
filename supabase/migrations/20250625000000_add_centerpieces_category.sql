-- Add centerpieces category to products table

-- Drop existing check constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the new check constraint with centerpieces included
ALTER TABLE products ADD CONSTRAINT products_category_check
CHECK (category IN ('decorations', 'ribbons', 'trees', 'centerpieces'));