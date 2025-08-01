/*
  # Fix gift cards RLS policy - Final Fix

  1. Changes
    - Ensure RLS is enabled on gift_cards table
    - Drop all existing policies and recreate them properly
    - Allow anonymous users to insert gift cards (for checkout process)
    - Allow authenticated users to manage all gift cards

  2. Security
    - Anonymous users can only INSERT gift cards (for checkout process)
    - Authenticated users can view and manage all gift cards
    - No sensitive data exposure to anonymous users
*/

-- Ensure RLS is enabled on gift_cards table
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anonymous users can create gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Authenticated users can manage gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Anyone can view gift cards" ON gift_cards;

-- Allow anonymous users to insert gift cards (for checkout)
CREATE POLICY "Anonymous users can create gift cards"
  ON gift_cards
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all gift cards
CREATE POLICY "Authenticated users can view gift cards"
  ON gift_cards
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update gift cards
CREATE POLICY "Authenticated users can update gift cards"
  ON gift_cards
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete gift cards
CREATE POLICY "Authenticated users can delete gift cards"
  ON gift_cards
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comments to document the policies
COMMENT ON POLICY "Anonymous users can create gift cards" ON gift_cards IS 
'Allows anonymous users to create gift cards during checkout process';

COMMENT ON POLICY "Authenticated users can view gift cards" ON gift_cards IS 
'Allows authenticated users (admin) to view all gift cards';

COMMENT ON POLICY "Authenticated users can update gift cards" ON gift_cards IS 
'Allows authenticated users (admin) to update gift cards';

COMMENT ON POLICY "Authenticated users can delete gift cards" ON gift_cards IS 
'Allows authenticated users (admin) to delete gift cards';