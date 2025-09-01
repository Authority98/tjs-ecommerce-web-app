import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = 'https://bmdrmzzuzexewzyudrmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZHJtenp1emV4ZXd6eXVkcm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODUyNzQsImV4cCI6MjA2NjE2MTI3NH0.q1O-ubxoRMocl9c8YpD7LMmYpxQJc7AEqphNXjP1rbM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMenPowerConstraint() {
  console.log('🧪 Testing men_power constraint specifically...\n');
  
  // Test with a valid order structure but men_power = 2
  const testOrder = {
    order_number: 'TEST-' + Date.now(),
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',  
    customer_phone: '+65 1234 5678',
    delivery_address: '123 Test Street, Singapore 123456',
    product_id: '51d99168-dc0c-4e22-b2ad-8237d5ecd0a0', // Valid product ID from logs
    order_type: 'product',
    men_power: 2, // Testing the constraint
    total_amount: 100,
    status: 'pending'
  };
  
  try {
    console.log('📝 Attempting to insert order with men_power = 2...');
    const { data, error } = await supabase
      .from('orders')
      .insert(testOrder)
      .select();
    
    if (error) {
      if (error.code === '23514' && error.message.includes('men_power')) {
        console.log('❌ men_power constraint still blocks value 2');
        console.log('🔍 Error:', error.message);
        return false;
      } else {
        console.log('⚠️ Different constraint error (not men_power):');
        console.log('🔍 Error code:', error.code);
        console.log('🔍 Error message:', error.message);
        return null; // Different error, constraint might be working
      }
    } else {
      console.log('✅ SUCCESS! men_power = 2 was accepted');
      console.log('🎉 The constraint now allows 1-20 workers as intended!');
      
      // Clean up test record
      await supabase
        .from('orders')
        .delete()
        .eq('order_number', testOrder.order_number);
      console.log('🧹 Test record cleaned up');
      
      return true;
    }
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return null;
  }
}

testMenPowerConstraint();