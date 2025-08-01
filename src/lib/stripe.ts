import { loadStripe } from '@stripe/stripe-js';
import { config } from './config';

// Get the publishable key from configuration
const stripePublishableKey = config.stripe.publishableKey;

// Validate that the key exists
if (!stripePublishableKey) {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
  if (config.isProduction) {
    console.error('This will cause payment functionality to fail in production');
  }
}

// Initialize Stripe with your publishable key
export const stripe = stripePublishableKey ? loadStripe(stripePublishableKey) : null;