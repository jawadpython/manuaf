# 🚀 Supabase Setup - Step by Step

## Quick Overview

You're migrating from SQLite to Supabase (PostgreSQL). This guide will walk you through the entire process.

## ✅ What You Need

- A Supabase account (free at [supabase.com](https://supabase.com))
- Your database password (you'll create this)
- 5-10 minutes

---

## 📝 Step 1: Create Supabase Account & Project

### 1.1 Sign Up
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email

### 1.2 Create New Project
1. Click **"New Project"** button
2. Fill in the form:
   - **Name**: `logistec2` (or your project name)
   - **Database Password**: 
     - Create a strong password
     - **SAVE THIS PASSWORD** - you'll need it!
     - Example: `MySecurePass123!@#`
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine
3. Click **"Create new project"**
4. Wait 1-2 minutes for setup to complete

---

## 🔑 Step 2: Get Database Connection String

### 2.1 Navigate to Database Settings
1. In your Supabase dashboard, click on your project
2. Click **Settings** (gear icon in left sidebar)
3. Click **Database** in the settings menu

### 2.2 Copy Connection String
1. Scroll down to **"Connection string"** section
2. Click on the **"URI"** tab
3. You'll see something like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 2.3 Replace Password Placeholder
- The connection string has `[YOUR-PASSWORD]` placeholder
- Replace it with the actual password you created
- Example:
  ```
  postgresql://postgres:MySecurePass123!@#@db.abcdefghijklmnop.supabase.co:5432/postgres
  ```

### 2.4 Choose Connection Type

**Option A: Connection Pooling (Recommended for Production)**
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

**Option B: Direct Connection (Simpler for Development)**
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

---

## ⚙️ Step 3: Update Your Project

### 3.1 Prisma Schema (Already Done ✅)
The schema has been updated to use PostgreSQL. It should show:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3.2 Create/Update `.env` File

Create a `.env` file in your project root (if it doesn't exist):

```env
# Database - Supabase
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-this-secret-key

# Admin Login
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password

# Image Upload (choose one)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual Supabase password
- Replace `YOUR_PROJECT_REF` with your project reference (from connection string)

### 3.3 Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env` file.

**Alternative:** If you don't have openssl, use an online generator:
- https://generate-secret.vercel.app/32

---

## 🗄️ Step 4: Push Schema to Supabase

### 4.1 Stop Dev Server
If your dev server is running, stop it with `Ctrl+C`

### 4.2 Push Database Schema

Run these commands in your terminal:

```bash
# Navigate to project directory (if not already there)
cd "C:\Users\Pc\3D Objects\websites.khedma\logistec2"

# Push schema to Supabase
npx prisma db push

# Generate Prisma client
npx prisma generate
```

**What this does:**
- Creates all tables in Supabase
- Sets up relationships and indexes
- Generates Prisma client for your code

**Expected output:**
```
✔ Generated Prisma Client
✔ Pushed database schema
```

### 4.3 Verify Tables Created

1. Go to Supabase dashboard
2. Click **Table Editor** in left sidebar
3. You should see these tables:
   - ✅ `Category`
   - ✅ `Product`
   - ✅ `Service`
   - ✅ `BlogPost`

---

## 🧪 Step 5: Test Connection

### 5.1 Start Dev Server

```bash
npm run dev
```

### 5.2 Test Admin Login

1. Open browser: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. If login works, your database is connected! ✅

### 5.3 Test Database Operations

1. Go to `/admin/categories`
2. Try creating a category
3. If it saves, everything is working! 🎉

---

## 🔍 Troubleshooting

### ❌ "Can't reach database server"

**Possible causes:**
- Wrong connection string
- Wrong password
- Project is paused

**Solutions:**
1. Double-check connection string in `.env`
2. Verify password matches Supabase password
3. Check Supabase dashboard - project might be paused (click "Restore")

### ❌ "password authentication failed"

**Solution:**
1. Verify password in connection string
2. Try resetting password in Supabase:
   - Settings → Database → Reset database password

### ❌ "relation does not exist"

**Solution:**
```bash
npx prisma db push
```

### ❌ "too many connections"

**Solution:**
Use connection pooling (port 6543):
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
```

### ❌ Database Paused (Free Tier)

**Solution:**
- Free tier projects pause after 1 week of inactivity
- Go to Supabase dashboard
- Click "Restore" button

---

## 📊 Supabase Dashboard Features

### Table Editor
- View and edit data directly
- Great for testing and debugging
- Access: Dashboard → Table Editor

### SQL Editor
- Run custom SQL queries
- Useful for migrations
- Access: Dashboard → SQL Editor

### Database Settings
- Connection pooling
- Backups
- Performance monitoring
- Access: Dashboard → Settings → Database

---

## 🎯 Next Steps

After successful setup:

1. **Create Categories**
   - Go to `/admin/categories`
   - Create your category structure

2. **Add Products**
   - Go to `/admin/produits`
   - Add products and assign to categories

3. **Set up Services**
   - Go to `/admin/services`
   - Add your services

---

## 📚 Quick Reference

### Connection String Formats

**Direct (Port 5432):**
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Pooled (Port 6543 - Recommended):**
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### Useful Commands

```bash
# Push schema
npx prisma db push

# Generate client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# View database in browser
npx prisma studio
```

---

## ✅ Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Saved database password
- [ ] Copied connection string
- [ ] Updated `.env` file
- [ ] Generated NEXTAUTH_SECRET
- [ ] Ran `npx prisma db push`
- [ ] Ran `npx prisma generate`
- [ ] Verified tables in Supabase dashboard
- [ ] Tested admin login
- [ ] Created test category/product

---

**Need Help?** 
- Check `SUPABASE_SETUP_GUIDE.md` for detailed guide
- Check `SUPABASE_QUICK_START.md` for quick reference
- Supabase Docs: https://supabase.com/docs
