-- Test inserting a simple record into inquiries table
-- Run this in Supabase SQL Editor to test if the table works

INSERT INTO public.inquiries (
  name,
  email,
  phone,
  address,
  service_name,
  selected_options,
  total_price
) VALUES (
  'Test User',
  'test@example.com',
  '+65 1234 5678',
  '123 Test Street, Singapore',
  'Wedding Photography',
  '[]'::jsonb,
  500.00
);

-- Check if the insert worked
SELECT * FROM public.inquiries ORDER BY created_at DESC LIMIT 1;