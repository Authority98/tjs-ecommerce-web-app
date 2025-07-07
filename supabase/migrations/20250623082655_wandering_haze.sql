/*
  # Add color and decorated columns to products table

  1. Schema Changes
    - Add `color` column (text, optional)
    - Add `decorated` column (boolean, default false)

  2. Update existing data
    - Set default values for existing products
*/

-- Add color column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'color'
  ) THEN
    ALTER TABLE products ADD COLUMN color text;
  END IF;
END $$;

-- Add decorated column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'decorated'
  ) THEN
    ALTER TABLE products ADD COLUMN decorated boolean DEFAULT false;
  END IF;
END $$;