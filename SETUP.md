# Locono Platform - Next.js Setup Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2.2 Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL script
5. This will create all necessary tables and set up Row Level Security (RLS)

### 2.3 Enable Email Auth

1. Go to Authentication > Settings
2. Enable Email provider
3. Configure email templates (optional)

## Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Do NOT commit `.env.local` to git!

## Step 4: Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## Step 5: Test Authentication

1. Navigate to the homepage
2. Try registering a new customer or vendor
3. Test login functionality

## Database Tables Created

The schema creates the following tables:

- `profiles` - User profiles extending Supabase auth
- `vendors` - Vendor/store information
- `products` - Product listings
- `orders` - Customer orders
- `subscriptions` - Daily subscription orders
- `chats` - Chat conversations
- `messages` - Chat messages
- `reviews` - Product reviews

## API Routes

All routes are now in Next.js API format:

- `/api/auth/register/customer` - Customer registration
- `/api/auth/register/vendor` - Vendor registration
- `/api/auth/login` - User login
- `/api/auth/me` - Get current user
- `/api/auth/profile` - Update profile
- `/api/auth/logout` - Logout
- `/api/products` - Get products with filters
- `/api/products/[id]` - Get product by ID
- `/api/products/search/[query]` - Search products
- `/api/products/category/[category]` - Get by category
- `/api/products/compare` - Compare products

## Authentication Flow

1. User registers/login via Supabase Auth
2. Profile is automatically created in `profiles` table
3. For vendors, a vendor record is created in `vendors` table
4. Session is managed by Supabase Auth
5. API routes verify session using `getServerSession()`

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure `.env.local` exists with both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: Database errors

**Solution**: Make sure you've run the `supabase/schema.sql` script in your Supabase SQL Editor

### Issue: Authentication not working

**Solution**: 
1. Check Supabase Auth is enabled
2. Verify RLS policies are active
3. Check browser console for errors

## Next Steps

1. Create vendor registration page
2. Create product listing pages
3. Implement order checkout flow
4. Add subscription management
5. Build vendor dashboard
6. Build admin dashboard

## Architecture

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for product images)

## Migration from Express

The old Express server (`server.js`) is no longer needed. All routes have been migrated to Next.js API routes in the `app/api/` directory.

