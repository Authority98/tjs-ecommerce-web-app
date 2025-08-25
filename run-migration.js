import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = 'https://bmdrmzzuzexewzyudrmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZHJtenp1emV4ZXd6eXVkcm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODUyNzQsImV4cCI6MjA2NjE2MTI3NH0.q1O-ubxoRMocl9c8YpD7LMmYpxQJc7AEqphNXjP1rbM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  try {
    console.log('Running migration: add men_power column to orders table...');
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250116010000_add_men_power_to_orders.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Migration SQL:', migrationSQL);
    
    // Try to execute the migration using rpc
    const { data, error } = await supabase.rpc('exec', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('Migration failed:', error);
      return;
    }
    
    console.log('Migration completed successfully!');
    console.log('Result:', data);
    
  } catch (err) {
    console.error('Error running migration:', err);
  }
}

runMigration();