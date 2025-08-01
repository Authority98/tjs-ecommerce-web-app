/*
  # Fix gift cards RLS policy

  1. Changes
    - Update RLS policy for gift_cards table to allow anonymous users to insert gift cards
    - This allows the frontend to create gift cards without authentication
    - Maintains security by only allowing inserts, not reads/updates/deletes for anonymous users

  2. Security
    - Anonymous users can only INSERT gift cards (for checkout process)
    - Authenticated users can still manage all gift cards
    - No sensitive data exposure to anonymous users
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can manage gift cards" ON gift_cards;

-- Create separate policies for different operations

-- Allow anonymous users to insert gift cards (for checkout)
CREATE POLICY "Anonymous users can create gift cards"
  ON gift_cards
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to manage all gift cards
CREATE POLICY "Authenticated users can manage gift cards"
  ON gift_cards
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comment to document the policy purpose
COMMENT ON POLICY "Anonymous users can create gift cards" ON gift_cards IS 
'Allows anonymous users to create gift cards during checkout process';

COMMENT ON POLICY "Authenticated users can manage gift cards" ON gift_cards IS 
'Allows authenticated users (admin) to view and manage all gift cards';