-- Fix RLS policy for delivery_configurations table
-- The previous policy was checking auth.role() = 'authenticated' which is incorrect
-- It should check if the user is authenticated

-- Drop the existing incorrect policy
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON delivery_configurations;

-- Create correct policy for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON delivery_configurations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Also allow public read access for delivery configurations
CREATE POLICY "Enable read access for everyone" ON delivery_configurations
  FOR SELECT USING (true);