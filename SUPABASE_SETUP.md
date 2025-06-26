# Supabase Storage Setup

To fix the broken image previews when adding products, you need to create a storage bucket in your Supabase project.

## Steps to create the storage bucket:

1. Go to your Supabase project dashboard at https://supabase.com
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the bucket name to: `product-images`
5. Make sure the bucket is **Public** (so images can be displayed)
6. Click **Create bucket**

## Bucket Configuration:
- **Name**: `product-images`
- **Public**: Yes (required for image display)
- **File size limit**: 5MB (handled by the app)
- **Allowed file types**: Images (jpg, png, gif, webp, etc.)

## Security (Optional):
You can add RLS (Row Level Security) policies later if needed, but for now, making the bucket public is the simplest approach for product images.

## Verification:
Once the bucket is created, try uploading an image through the admin panel. The image should now display properly in the preview.

## Troubleshooting:
- If you see "Storage bucket not configured" error, make sure the bucket name is exactly `product-images`
- If images don't load, check that the bucket is set to public
- Check the browser console for any CORS or permission errors