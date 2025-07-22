/*
  # Allow null prices in products table

  1. Changes
    - Modify price column to allow null values
    - Remove NOT NULL constraint
    - Keep CHECK constraint for non-null values
*/

-- Drop the existing NOT NULL constraint
ALTER TABLE products ALTER COLUMN price DROP NOT NULL;

-- Update the CHECK constraint to only apply when price is not null
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_price_check;
ALTER TABLE products ADD CONSTRAINT products_price_check
  CHECK (price IS NULL OR price >= 0);