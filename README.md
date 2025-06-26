# 🎄 Twinkle Jingle - Christmas E-commerce Platform

A modern, full-featured e-commerce application specializing in Christmas trees, decorations, and premium ribbons. Built with React, TypeScript, and Supabase for a seamless holiday shopping experience.

![Twinkle Jingle](https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop)

## ✨ Features

### 🎯 Core Functionality
- **Product Catalog**: Browse Christmas trees, decorations, and ribbons
- **Interactive Tree Customization**: Step-by-step tree sizing, type selection, rental periods, and decoration levels
- **Smart Cart System**: Seamless checkout process with customer details and scheduling
- **Admin Dashboard**: Complete order management and product administration
  - Displays static product images for clarity and performance
  - Image slider removed from admin product cards for a streamlined experience
- **Dark/Light Mode**: System-wide theme toggle with persistent preferences

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance-First Design**: Completely removed all animations and motion components for maximum speed
  - Zero animation overhead - instant UI responses
  - Removed all hover effects and transitions for optimal performance
  - Clean, static interface prioritizing functionality over visual effects
- **Toast Notifications**: Beautiful success/error feedback with glass morphism design
- **Auto-Advancing Steps**: Intelligent progression through customization workflow
- **Loading States**: Elegant skeleton loading and progress indicators
- **UI/UX Improvements**: Clean, minimal interface with focus on usability

### 🛡️ Technical Features
- **Type Safety**: Full TypeScript implementation
- **Real-time Database**: Supabase integration for products and orders
- **Performance Optimized**: Fast hover animations and efficient re-rendering
- **Component Architecture**: Modular, reusable component system
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Optimized Performance** - Zero animation overhead for maximum speed
- **React Router 6** - Client-side routing
- **React Hot Toast** - Beautiful notification system

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Real-time subscriptions** - Live data updates
- **Row Level Security** - Secure data access

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Supabase account (for database)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tjs-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     images TEXT[] DEFAULT '{}',
     category TEXT NOT NULL CHECK (category IN ('trees', 'decorations', 'ribbons')),
     color TEXT,
     decorated BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create orders table
   CREATE TABLE orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     customer_name TEXT NOT NULL,
     customer_email TEXT NOT NULL,
     customer_phone TEXT NOT NULL,
     delivery_address TEXT NOT NULL,
     product_data JSONB NOT NULL,
     tree_options JSONB,
     installation_date DATE,
     teardown_date DATE,
     rush_order BOOLEAN DEFAULT false,
     total_amount DECIMAL(10,2) NOT NULL,
     status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
   CREATE POLICY "Orders are viewable by everyone" ON orders FOR SELECT USING (true);
   CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   └── forms/           # Form components
├── pages/               # Route components
│   ├── CategorySelection.tsx
│   ├── ProductPage.tsx
│   ├── TreeCustomization.tsx
│   ├── CheckoutPage.tsx
│   ├── ThankYouPage.tsx
│   └── AdminPage.tsx
├── types/               # TypeScript type definitions
├── lib/                 # External library configurations
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── styles/              # Global styles
```

## 🎯 Key Components

### Product Customization Flow
1. **Category Selection** - Choose between trees, decorations, or ribbons
2. **Product Browsing** - View product catalog with filtering
3. **Tree Customization** (Trees only):
   - Size selection with visual representations
   - Tree type selection (live/artificial varieties)
   - Rental period selection
   - Decoration level customization
4. **Checkout Process** - Customer details and scheduling
5. **Order Confirmation** - Success page with order details

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order statuses
- **Analytics Dashboard**: Order statistics and insights

## 🎨 Design System

### Color Palette
- **Primary**: Purple (`#9333E9`) - Modern, elegant theme
- **Secondary**: Fuchsia (`#D946EF`) - Vibrant accent color
- **Gradient**: Purple to Fuchsia gradients throughout the UI
- **Accent Colors**: Amber (`#F7B541`), Red (`#EF4444`) for actions
- **Neutrals**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, large text for impact
- **Body**: Clean, readable fonts for content
- **UI Elements**: Medium weight for buttons and labels

### Performance Principles
- **Zero Animation Overhead**: Completely removed all motion components and animations
- **Instant Response**: No transitions or hover effects for maximum speed
- **Clean Interface**: Focus on functionality over visual effects
- **Auto-advancement**: Guided user flow with immediate state changes

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for tablet screens
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Large touch targets and gestures

## 🛡️ Security Features

- **Input Validation**: Client and server-side validation
- **SQL Injection Protection**: Parameterized queries via Supabase
- **XSS Prevention**: Proper data sanitization
- **HTTPS**: Secure data transmission

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: WebP support and lazy loading
- **Caching**: Efficient caching strategies
- **Bundle Analysis**: Optimized dependency bundling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Write descriptive component documentation
- Test responsive design across devices
- Maintain consistent code formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern e-commerce platforms
- **Icons**: Lucide React icon library
- **Images**: Pexels and Unsplash for placeholder content
- **Performance**: Optimized for speed with zero animation overhead

## 📞 Support

For support, email support@twinklejingle.com or join our Slack channel.

## 🆕 Recent Updates (Latest Release)

### ⚡ Performance Optimization & Bug Fixes (Latest)
- **🚀 Motion Components Removal**: Completely removed all Framer Motion dependencies and components for maximum performance
  - Eliminated all `motion.div`, `motion.img`, and `motion.button` components
  - Removed `AnimatePresence`, hover effects, and transition animations
  - Updated all animation components to use standard HTML elements
  - Zero animation overhead resulting in significantly faster UI responses
- **🐛 TypeScript Error Fixes**: Resolved critical compilation errors
  - Fixed type mismatch in `GiftCardPage.tsx` where `isStepComplete` function returned `string | boolean` instead of `boolean`
  - Corrected deliveryDate validation logic using proper boolean conversion
  - Ensured all function return types match their expected interfaces
- **🧹 Code Cleanup**: Removed all unused motion-related imports and properties
  - Cleaned up hover classes and transition utilities
  - Simplified component interfaces by removing motion props
  - Streamlined codebase for better maintainability

### 🔧 Filter System Overhaul
- **🎯 Universal Color Filters**: Color filtering now works correctly across all categories (trees, decorations, ribbons, centrepieces)
- **🏷️ Category-Specific Filters**: Decoration status filter properly restricted to trees category only
- **🔄 Smart Filter Reset**: Filters automatically reset when switching between categories to prevent cross-contamination
- **📊 Accurate Filter Counts**: Filter badge displays correct count of active filters per category
- **🎨 Complete Filter Coverage**: All product categories now have proper filter functionality:
  - **Trees**: Color, price, and decoration status filters
  - **Decorations**: Color and price filters
  - **Ribbons**: Color and price filters
  - **Centrepieces**: Color and price filters (previously missing)
- **🎛️ Admin Form Fixes**: Pre-decorated toggle in admin product form restricted to trees category only
- **🔍 Consistent Logic**: Unified use of `validCategory` throughout filter implementation for reliability

### UI/UX Improvements
- **🎨 Modern Color Scheme**: Migrated from green to elegant purple/fuchsia theme across all components
- **🧭 Enhanced Navigation**: Replaced text-only menu items with beautiful icon boxes matching category colors
  - Trees: Purple gradient with TreePine icon
  - Decorations: Pink-to-red gradient with Settings icon
  - Ribbons: Blue-to-purple gradient with Ribbon icon
  - Gift Cards: Amber-to-red gradient with Gift icon
- **📱 Mobile-First Navigation**: Fully responsive menu with horizontal scrolling and touch-friendly design
- **🍔 Interactive Hamburger Menu**: Cute mobile navigation with animated menu overlay
  - Smooth slide-down animation with staggered menu item reveals
  - Touch-friendly large icons with bouncy hover effects
  - Animated hamburger button (Menu ↔ X) with rotation
  - Auto-close functionality when menu items are selected
  - Beautiful gradient background matching header design
- **✨ Interactive Animations**: Hover effects with icon rotation, scale animations, and sparkle effects for active items
- **🦶 Minimal Footer**: Added clean copyright footer with proper layout positioning
- **🗂️ Admin Dashboard Overhaul**: Product cards now match user-facing design with compact layouts
- **📱 Responsive Product Cards**: Optimized admin product grid with 4-column layout and proper image styling
- **🎯 Fixed Filter Bug**: Product page filter button now toggles correctly without immediate closure
- **⚙️ Mobile Admin Access**: Admin gear icon hidden on mobile, accessible through hamburger menu

### Functionality Enhancements
- **🎛️ Filter System**: Fixed click-outside detection for filter panels using proper ref management
- **📜 Scrollbar Enhancement**: Added custom scrollbar-hide utility for smooth mobile scrolling
- **💰 Order Summary Pricing**: Added rental pricing display with (+$amount) format in customization
- **🎪 Loading Screen**: Updated background to match app's gradient theme
- **🎉 Configuration Complete**: Replaced static indicator with toast notifications
- **📅 Date Picker Fix**: Removed duplicate calendar icons causing double picker appearance
- **🎄 Tree Customization**: Removed redundant "Choose Your Perfect Size" text for cleaner interface

### Technical Improvements
- **🏗️ Layout Architecture**: Implemented flexbox layout for proper footer positioning
- **🎨 Color Consistency**: Navigation colors now precisely match category box definitions
- **🔧 Component Architecture**: Better separation of concerns in admin components
- **🎭 Animation Consistency**: Unified hover states and transitions across all cards
- **🛡️ Error Handling**: Improved empty states and user feedback
- **⚡ Performance**: Optimized component rendering and reduced unnecessary re-renders
- **📐 Responsive Design**: Enhanced mobile experience with adaptive sizing and spacing
- **🔍 Filter Logic Optimization**: Streamlined filter application logic for better performance and maintainability

## 🔮 Roadmap

### Version 2.0
- [ ] Payment integration (Stripe/PayPal)
- [ ] User authentication and profiles
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Inventory management
- [ ] Multi-language support

### Version 2.5
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Augmented Reality tree preview
- [ ] Social media integration
- [ ] Advanced analytics dashboard

---

**Made with ❤️ for the holiday season** 🎄✨