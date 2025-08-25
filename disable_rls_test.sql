-- Temporarily disable RLS on inquiries table for testing
-- Run this in Supabase SQL Editor to test if RLS is causing the 400 error

ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;

-- Test insert after disabling RLS
INSERT INTO public.inquiries (
  name,
  email,
  phone,
  address,
  service_name,
  selected_options,
  total_price
) VALUES (
  'RLS Test User',
  'rlstest@example.com',
  '+65 9999 8888',
  '456 RLS Test Street, Singapore',
  'Event Photography',
  '[]'::jsonb,
  750.00
);

-- Check if the insert worked
SELECT * FROM public.inquiries WHERE email = 'rlstest@example.com';

-- Re-enable RLS after testing (uncomment if needed)
-- ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;