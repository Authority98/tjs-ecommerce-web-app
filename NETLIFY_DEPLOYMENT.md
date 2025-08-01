# Netlify Deployment Guide

## Environment Variables Setup

To deploy this application on Netlify, you need to configure the following environment variables in your Netlify dashboard:

### Required Environment Variables

1. **VITE_SUPABASE_URL**
   - Value: `https://bmdrmzzuzexewzyudrmr.supabase.co`
   - Description: Your Supabase project URL

2. **VITE_SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZHJtenp1emV4ZXd6eXVkcm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODUyNzQsImV4cCI6MjA2NjE2MTI3NH0.q1O-ubxoRMocl9c8YpD7LMmYpxQJc7AEqphNXjP1rbM`
   - Description: Your Supabase anonymous key

3. **VITE_STRIPE_PUBLISHABLE_KEY**
   - Value: `your_stripe_publishable_key_here`
   - Description: Your Stripe publishable key (test mode)

## How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** > **Environment variables**
4. Click **Add a variable** for each environment variable above
5. Enter the **Key** (variable name) and **Value** exactly as shown above
6. Click **Save**

## Build Settings

Make sure your build settings in Netlify are configured as follows:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18` (set in netlify.toml)

## Troubleshooting

### Card Fields Not Clickable

If the Stripe card fields are not clickable on Netlify, it's likely due to:

1. **Missing environment variables**: Ensure all VITE_* variables are set in Netlify
2. **Incorrect variable names**: Variable names are case-sensitive
3. **Build cache**: Try clearing the build cache and redeploying

### Console Errors

If you see errors like "Cannot read properties of undefined (reading 'match')", this indicates:

1. **Stripe initialization failed**: Usually due to missing VITE_STRIPE_PUBLISHABLE_KEY
2. **Environment variable not loaded**: Check that variables are properly set in Netlify

### Steps to Fix

1. **Set all environment variables** in Netlify dashboard
2. **Clear build cache** in Netlify (Site settings > Build & deploy > Clear cache)
3. **Trigger a new deploy** by pushing a commit or manually triggering
4. **Check browser console** for any remaining errors

## Production Considerations

For production deployment:

1. **Replace test Stripe keys** with live keys
2. **Update Supabase settings** for production if needed
3. **Enable proper security headers** (already configured in netlify.toml)
4. **Test payment flow** thoroughly before going live

## Support

If you continue to experience issues:

1. Check the browser console for specific error messages
2. Verify all environment variables are correctly set
3. Ensure the Netlify build completes successfully
4. Test the application in incognito mode to rule out browser cache issues