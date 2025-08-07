/*
  # Add Singapore-specific address fields to orders table

  1. New Columns
    - `unit_number` (text, optional) - Singapore unit number like #12-34
    - `building_name` (text, optional) - Building or estate name
    - `street_address` (text, optional) - Main street address
    - `postal_code` (text, optional) - 6-digit Singapore postal code

  2. Notes
    - Keeping existing `delivery_address` field for backward compatibility
    - New fields are optional to not break existing orders
    - Admin panel will continue to display the full delivery_address
    - New orders will populate both old and new fields
*/

-- Add Singapore-specific address fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS unit_number text,
ADD COLUMN IF NOT EXISTS building_name text,
ADD COLUMN IF NOT EXISTS street_address text,
ADD COLUMN IF NOT EXISTS postal_code text;

-- Add comment to document the new fields
COMMENT ON COLUMN orders.unit_number IS 'Singapore unit number (e.g., #12-34)';
COMMENT ON COLUMN orders.building_name IS 'Building or estate name';
COMMENT ON COLUMN orders.street_address IS 'Main street address';
COMMENT ON COLUMN orders.postal_code IS '6-digit Singapore postal code';