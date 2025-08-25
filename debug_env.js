// Debug script to check environment variables
console.log('Environment Variables Check:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET (length: ' + process.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'NOT SET');
console.log('VITE_STRIPE_PUBLISHABLE_KEY:', process.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'SET (length: ' + process.env.VITE_STRIPE_PUBLISHABLE_KEY.length + ')' : 'NOT SET');

// Check if we can import from the supabase lib
try {
  const { supabase } = require('./src/lib/supabase.ts');
  console.log('Supabase client created successfully');
  console.log('Supabase URL from client:', supabase.supabaseUrl);
} catch (error) {
  console.error('Error importing supabase:', error.message);
}