import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = 'https://bmdrmzzuzexewzyudrmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZHJtenp1emV4ZXd6eXVkcm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODUyNzQsImV4cCI6MjA2NjE2MTI3NH0.q1O-ubxoRMocl9c8YpD7LMmYpxQJc7AEqphNXjP1rbM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('orders')
      .select('men_power')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log('📊 Sample men_power values:', data);
    return true;
    
  } catch (err) {
    console.error('💥 Connection test failed:', err);
    return false;
  }
}

async function checkCurrentConstraint() {
  try {
    console.log('🔍 Checking current constraint...');
    
    // Try to insert a record with men_power = 2 to test current constraint
    const testOrderNumber = 'TEST-' + Date.now();
    const { error } = await supabase
      .from('orders')
      .insert({
        order_number: testOrderNumber,
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '+65 1234 5678',
        delivery_address: '123 Test Street, Singapore 123456',
        product_id: null,
        gift_card_id: null,
        order_type: 'product',
        men_power: 2, // This should fail if constraint is still 3-20
        total_amount: 100
      });
    
    if (error) {
      if (error.code === '23514') {
        console.log('⚠️ Current constraint prevents men_power = 2 (constraint violation 23514)');
        console.log('📝 Constraint details:', error.message);
        return false; // Constraint needs to be updated
      } else {
        console.error('❌ Unexpected error:', error);
        return null;
      }
    } else {
      console.log('✅ men_power = 2 was accepted - constraint already allows 1-20 workers');
      // Clean up test record
      await supabase
        .from('orders')
        .delete()
        .eq('order_number', testOrderNumber);
      return true; // Constraint already updated
    }
    
  } catch (err) {
    console.error('💥 Error checking constraint:', err);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting men_power constraint migration check...\n');
  
  // Test connection
  const connected = await testDatabaseConnection();
  if (!connected) {
    console.log('❌ Cannot proceed without database connection');
    return;
  }
  
  console.log('');
  
  // Check current constraint
  const constraintResult = await checkCurrentConstraint();
  
  console.log('');
  
  if (constraintResult === true) {
    console.log('🎉 Constraint is already updated! No migration needed.');
    console.log('✅ The men_power field now accepts values from 1-20 workers.');
  } else if (constraintResult === false) {
    console.log('📋 Constraint needs to be updated.');
    console.log('');
    console.log('🔧 Please execute the following SQL in your Supabase Dashboard:');
    console.log('👉 Go to https://supabase.com/dashboard → SQL Editor');
    console.log('👉 Copy and paste this SQL:');
    console.log('');
    console.log('-- Update men_power constraint to allow 1-20 workers');
    console.log('ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_men_power_check;');
    console.log('ALTER TABLE orders ADD CONSTRAINT orders_men_power_check CHECK (men_power >= 1 AND men_power <= 20);');
    console.log("COMMENT ON COLUMN orders.men_power IS 'Number of workers selected for installation/teardown services (1-20)';");
    console.log('');
    console.log('👉 Click "Run" to execute');
  } else {
    console.log('❓ Unable to determine constraint status. Please check manually.');
  }
}

main();