/*
  # Add payment_intent_id column to orders table

  1. Changes
    - Add `payment_intent_id` column to `orders` table
    - This column will store the Stripe payment intent ID for tracking payments

  2. Details
    - Column is optional (nullable) to support existing orders
    - Text type to store Stripe payment intent IDs (format: pi_xxxxx)
*/

-- Add payment_intent_id column to orders table
ALTER TABLE orders 
ADD COLUMN payment_intent_id text;

-- Add comment to document the column purpose
COMMENT ON COLUMN orders.payment_intent_id IS 'Stripe payment intent ID for tracking payment status';