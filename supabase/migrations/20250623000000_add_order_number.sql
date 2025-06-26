/*
  # Add order_number field to orders table

  1. Changes
    - Add `order_number` column to `orders` table
    - Make it unique and not null
    - Add index for faster lookups
*/

-- First add the column without constraints
ALTER TABLE orders ADD COLUMN order_number text;

-- Update existing orders with generated order numbers (if any exist)
UPDATE orders 
SET order_number = 'TJ-' || EXTRACT(EPOCH FROM created_at)::bigint::text || '-' || UPPER(SUBSTRING(MD5(id::text) FROM 1 FOR 3))
WHERE order_number IS NULL;

-- Now add the constraints
ALTER TABLE orders ALTER COLUMN order_number SET NOT NULL;
ALTER TABLE orders ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);

-- Create index for faster order number lookups
CREATE INDEX idx_orders_order_number ON orders(order_number);