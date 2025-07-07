/*
  # Add centrepieces category to products table

  1. Changes
    - Update category check constraint to include 'centrepieces'
*/

-- Drop the existing check constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the new check constraint with centrepieces included
ALTER TABLE products ADD CONSTRAINT products_category_check 
  CHECK (category IN ('decorations', 'ribbons', 'trees', 'centrepieces'));