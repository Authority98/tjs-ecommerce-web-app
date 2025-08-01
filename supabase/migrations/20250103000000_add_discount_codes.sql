/*
  # Add discount codes support

  1. New Tables
    - `discount_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `description` (text, optional)
      - `discount_type` (text) - 'percentage' or 'fixed'
      - `discount_value` (numeric) - percentage (0-100) or fixed amount
      - `min_order_amount` (numeric, optional) - minimum order amount to apply discount
      - `max_uses` (integer, optional) - maximum number of times code can be used
      - `used_count` (integer) - number of times code has been used
      - `is_active` (boolean) - whether the code is currently active
      - `valid_from` (timestamptz, optional) - when the code becomes valid
      - `valid_until` (timestamptz, optional) - when the code expires
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Schema Changes
    - Add `discount_code_id` column to `orders` table
    - Add `discount_amount` column to `orders` table

  3. Security
    - Enable RLS on `discount_codes` table
    - Add policies for discount code management
*/

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  min_order_amount numeric DEFAULT 0 CHECK (min_order_amount >= 0),
  max_uses integer CHECK (max_uses > 0),
  used_count integer DEFAULT 0 CHECK (used_count >= 0),
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);

-- Enable RLS on discount_codes table
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage discount codes
CREATE POLICY "Authenticated users can manage discount codes"
  ON discount_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to read active discount codes (for validation)
CREATE POLICY "Anonymous users can read active discount codes"
  ON discount_codes
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Modify orders table to support discount codes
DO $$
BEGIN
  -- Add discount_code_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'discount_code_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount_code_id uuid REFERENCES discount_codes(id) ON DELETE SET NULL;
  END IF;
  
  -- Add discount_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount_amount numeric DEFAULT 0 CHECK (discount_amount >= 0);
  END IF;
END $$;

-- Create function to update discount code usage
CREATE OR REPLACE FUNCTION increment_discount_code_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.discount_code_id IS NOT NULL THEN
    UPDATE discount_codes 
    SET used_count = used_count + 1,
        updated_at = now()
    WHERE id = NEW.discount_code_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically increment usage count
DROP TRIGGER IF EXISTS trigger_increment_discount_usage ON orders;
CREATE TRIGGER trigger_increment_discount_usage
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION increment_discount_code_usage();

-- Add comments to document the table
COMMENT ON TABLE discount_codes IS 'Stores discount codes that can be applied to orders';
COMMENT ON COLUMN discount_codes.code IS 'Unique discount code string';
COMMENT ON COLUMN discount_codes.discount_type IS 'Type of discount: percentage or fixed amount';
COMMENT ON COLUMN discount_codes.discount_value IS 'Discount value: percentage (0-100) or fixed amount';
COMMENT ON COLUMN discount_codes.min_order_amount IS 'Minimum order amount required to use this discount';
COMMENT ON COLUMN discount_codes.max_uses IS 'Maximum number of times this code can be used (NULL = unlimited)';
COMMENT ON COLUMN discount_codes.used_count IS 'Number of times this code has been used';