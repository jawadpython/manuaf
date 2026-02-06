# 🚀 Complete Guide: How to Open the Admin Panel

## 📋 What You Need to Know

**Prisma** is a tool that connects your website to a database (PostgreSQL). It's like a bridge between your code and your data storage.

## ✅ Step-by-Step Setup

### Step 1: Create `.env` File

Create a file named `.env` in the root folder (same level as `package.json`) with this content:

```env
# Database Connection (REQUIRED)
# You need a PostgreSQL database. Free options:
# - Neon: https://neon.tech (free tier available)
# - Supabase: https://supabase.com (free tier available)
# - Vercel Postgres: https://vercel.com/storage/postgres

DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Authentication (REQUIRED)
NEXTAUTH_SECRET="put-any-random-long-string-here-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Admin Login Credentials (REQUIRED)
ADMIN_EMAIL="admin@yourcompany.com"
ADMIN_PASSWORD="your-secure-password-123"
```

**Important:** Replace the values with your actual database credentials and choose your own admin email/password.

### Step 2: Install Dependencies (if not done)

```bash
npm install
```

### Step 3: Set Up Database

**Option A: If you have a PostgreSQL database already:**
```bash
npx prisma db push
```

**Option B: If you need to create a database first:**

1. **Get a free PostgreSQL database:**
   - Go to https://neon.tech and create a free account
   - Create a new project
   - Copy the connection string
   - Paste it in your `.env` file as `DATABASE_URL` and `DIRECT_URL`

2. **Then run:**
   ```bash
   npx prisma db push
   ```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

This creates the code needed to talk to your database.

### Step 5: Start the Development Server

```bash
npm run dev
```

Wait for the message: `✓ Ready on http://localhost:3000`

## 🎯 How to Access the Admin Panel

### Method 1: Direct Login Page
1. Open your browser
2. Go to: **http://localhost:3000/admin/login**
3. Enter your credentials:
   - **Email:** The value you set in `ADMIN_EMAIL` in `.env`
   - **Password:** The value you set in `ADMIN_PASSWORD` in `.env`
4. Click "Connexion"

### Method 2: From the Website
1. Go to: **http://localhost:3000**
2. In the address bar, type: `/admin/login`
3. Login with your credentials

## 🎨 What You'll See After Login

Once logged in, you'll see:

1. **Dashboard** (`/admin`)
   - 3 cards: Produits, Services, Blog
   - Click any card to manage that section

2. **Sidebar Navigation** (left side)
   - Dashboard
   - Produits
   - Services (NEW!)
   - Blog

3. **Admin Features:**
   - ✅ Create new products, services, or blog posts
   - ✅ Edit existing items
   - ✅ Delete items
   - ✅ Upload images
   - ✅ Manage content

## 🔧 Quick Troubleshooting

### ❌ "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm install
npx prisma generate
```

### ❌ "Error: P1001: Can't reach database server"
**Solution:**
- Check your `DATABASE_URL` in `.env` is correct
- Make sure your database is running/accessible
- For free databases (Neon/Supabase), check they're not paused

### ❌ "Non autorisé" (Unauthorized) when accessing admin
**Solution:**
- Make sure you're logged in at `/admin/login`
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` match what you're typing
- Restart the dev server after changing `.env`

### ❌ "Service model not found"
**Solution:**
```bash
npx prisma db push
npx prisma generate
npm run dev
```

### ❌ Pages show but admin panel doesn't work
**Solution:**
- The public website works without a database (uses fallback data)
- The admin panel REQUIRES a database
- Make sure you completed Step 3 (database setup)

## 📝 Quick Reference

### Admin Panel URLs:
- **Login:** http://localhost:3000/admin/login
- **Dashboard:** http://localhost:3000/admin
- **Products:** http://localhost:3000/admin/produits
- **Services:** http://localhost:3000/admin/services
- **Blog:** http://localhost:3000/admin/blog

### Required Commands (in order):
```bash
# 1. Create .env file (see Step 1 above)

# 2. Install dependencies
npm install

# 3. Set up database
npx prisma db push

# 4. Generate Prisma client
npx prisma generate

# 5. Start server
npm run dev
```

### Your Login Credentials:
- **Email:** (from `ADMIN_EMAIL` in `.env`)
- **Password:** (from `ADMIN_PASSWORD` in `.env`)

## ✅ Verification Checklist

Before accessing admin, make sure:

- [ ] `.env` file exists with all required variables
- [ ] Database connection works (`npx prisma db push` succeeded)
- [ ] Prisma client generated (`npx prisma generate` succeeded)
- [ ] Dev server is running (`npm run dev`)
- [ ] You can access http://localhost:3000 (website loads)

## 🆘 Still Having Issues?

1. **Check the terminal** where `npm run dev` is running for error messages
2. **Check browser console** (F12) for JavaScript errors
3. **Verify `.env` file** has all required variables
4. **Restart everything:**
   - Stop dev server (Ctrl+C)
   - Run: `npx prisma generate`
   - Run: `npm run dev`

## 🎉 Success!

Once everything is set up, you can:
- ✅ Manage products from `/admin/produits`
- ✅ Manage services from `/admin/services`
- ✅ Manage blog posts from `/admin/blog`
- ✅ Upload images for any content
- ✅ All changes appear on your public website!
