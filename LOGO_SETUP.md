# Custom WebP Logo Setup

## Steps to add your custom logo:

### 1. Prepare your logo file
- **Format**: WebP (recommended for best compression and quality)
- **Size**: Recommended 40x40px to 80x80px (the component will scale it to 40px height)
- **Background**: Transparent preferred
- **Name**: `logo.webp`

### 2. Place the logo file
Copy your `logo.webp` file to:
```
/Users/usama/Desktop/tjs-ecommerce/public/assets/images/logo.webp
```

### 3. Current implementation details
The Header component now includes:
- **Primary**: WebP logo at `/assets/images/logo.webp`
- **Fallback**: TreePine icon if logo fails to load
- **Animation**: Gentle scale effect on hover (1.05x)
- **Accessibility**: Proper alt text for screen readers

### 4. Alternative formats (optional)
If you want to support multiple formats for better browser compatibility, you can use:

```jsx
<picture>
  <source srcSet="/assets/images/logo.webp" type="image/webp" />
  <source srcSet="/assets/images/logo.png" type="image/png" />
  <img src="/assets/images/logo.png" alt="Twinkle Jingle Logo" className="h-10 w-10 object-contain" />
</picture>
```

### 5. Responsive sizing
Current sizing:
- **Desktop**: 40px height (width auto-scales)
- **Object-fit**: `contain` (preserves aspect ratio)

### 6. Testing
After placing your logo:
1. Refresh the application
2. Check that the logo displays correctly
3. Test the fallback by temporarily renaming the logo file

### 7. Optimization tips
- Use a WebP optimizer to reduce file size
- Consider creating multiple sizes for different pixel densities (@1x, @2x)
- Keep file size under 50KB for fast loading

## File structure:
```
public/
  assets/
    images/
      logo.webp  ← Place your logo here
```

The logo will automatically appear in the header navigation bar!