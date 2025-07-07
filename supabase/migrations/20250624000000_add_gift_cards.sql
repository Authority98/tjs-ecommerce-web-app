/*
  # Add gift cards support

  1. New Tables
    - `gift_cards`
      - `id` (uuid, primary key)
      - `amount` (numeric)
      - `recipient_name` (text, optional)
      - `recipient_email` (text, optional)
      - `sender_name` (text, optional)
      - `personal_message` (text, optional)
      - `scheduled_date` (date, optional)
      - `is_for_self` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Schema Changes
    - Modify `orders` table to make `product_id` optional
    - Add `gift_card_id` column to `orders` table
    - Add `order_type` column to distinguish between product and gift card orders

  3. Security
    - Enable RLS on `gift_cards` table
    - Add policies for gift card management
*/

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL CHECK (amount > 0),
  recipient_name text,
  recipient_email text,
  sender_name text,
  personal_message text,
  scheduled_date date,
  is_for_self boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on gift_cards table
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage gift cards
CREATE POLICY "Authenticated users can manage gift cards"
  ON gift_cards
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Modify orders table to support gift cards
DO $$
BEGIN
  -- Make product_id optional
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'product_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE orders ALTER COLUMN product_id DROP NOT NULL;
  END IF;
  
  -- Add gift_card_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'gift_card_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN gift_card_id uuid REFERENCES gift_cards(id) ON DELETE CASCADE;
  END IF;
  
  -- Add order_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'order_type'
  ) THEN
    ALTER TABLE orders ADD COLUMN order_type text NOT NULL DEFAULT 'product' CHECK (order_type IN ('product', 'giftcard'));
  END IF;
END $$;

-- Add constraint to ensure either product_id or gift_card_id is set
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'orders' AND constraint_name = 'orders_product_or_gift_card_check'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_product_or_gift_card_check
    CHECK (
      (order_type = 'product' AND product_id IS NOT NULL AND gift_card_id IS NULL) OR
      (order_type = 'giftcard' AND gift_card_id IS NOT NULL AND product_id IS NULL)
    );
  END IF;
END $$;