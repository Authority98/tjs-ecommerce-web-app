import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const supabaseUrl = 'https://bmdrmzzuzexewzyudrmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZHJtenp1emV4ZXd6eXVkcm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODUyNzQsImV4cCI6MjA2NjE2MTI3NH0.q1O-ubxoRMocl9c8YpD7LMmYpxQJc7AEqphNXjP1rbM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function executeMenPowerMigration() {
  try {
    console.log('🔧 Executing men_power constraint migration...');
    
    // Step 1: Drop existing constraint
    console.log('Step 1: Dropping existing constraint...');
    const { error: dropError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_men_power_check;'
    });
    
    if (dropError) {
      console.error('❌ Error dropping constraint:', dropError);
      return;
    }
    console.log('✅ Existing constraint dropped successfully');
    
    // Step 2: Add new constraint (1-20 workers)
    console.log('Step 2: Adding new constraint (1-20 workers)...');
    const { error: addError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE orders ADD CONSTRAINT orders_men_power_check CHECK (men_power >= 1 AND men_power <= 20);'
    });
    
    if (addError) {
      console.error('❌ Error adding constraint:', addError);
      return;
    }
    console.log('✅ New constraint added successfully');
    
    // Step 3: Update column comment
    console.log('Step 3: Updating column comment...');
    const { error: commentError } = await supabase.rpc('exec', {
      sql: "COMMENT ON COLUMN orders.men_power IS 'Number of workers selected for installation/teardown services (1-20)';"
    });
    
    if (commentError) {
      console.error('❌ Error updating comment:', commentError);
      return;
    }
    console.log('✅ Column comment updated successfully');
    
    // Step 4: Verify the constraint
    console.log('Step 4: Verifying constraint...');
    const { data: verifyData, error: verifyError } = await supabase.rpc('exec', {
      sql: `SELECT 
        conname AS constraint_name,
        contype AS constraint_type,
        consrc AS constraint_definition
      FROM pg_constraint 
      WHERE conname = 'orders_men_power_check';`
    });
    
    if (verifyError) {
      console.error('❌ Error verifying constraint:', verifyError);
      return;
    }
    
    console.log('✅ Constraint verification:', verifyData);
    console.log('🎉 Migration completed successfully! The men_power constraint now allows 1-20 workers.');
    
  } catch (err) {
    console.error('💥 Unexpected error during migration:', err);
  }
}

executeMenPowerMigration();