# Supabase Setup Guide

This guide will help you set up Supabase (PostgreSQL) and connect it to your Next.js project.

## 📋 Prerequisites

- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your project already set up with Prisma

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Sign up/Login to Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up or log in to your account

2. **Create a New Project**
   - Click "New Project"
   - Fill in the details:
     - **Name**: Your project name (e.g., "logistec2")
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose closest to your users
     - **Pricing Plan**: Free tier is fine to start

3. **Wait for Project Setup**
   - This takes 1-2 minutes
   - You'll see a progress indicator

### Step 2: Get Database Connection String

1. **Go to Project Settings**
   - Click on your project
   - Go to **Settings** (gear icon in sidebar)
   - Click **Database**

2. **Get Connection String**
   - Scroll down to "Connection string"
   - Select **URI** tab
   - Copy the connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Replace Password**
   - Replace `[YOUR-PASSWORD]` with the password you created
   - The final string should look like:
     ```
     postgresql://postgres:your_actual_password@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```

### Step 3: Update Prisma Schema

The schema has already been updated to use PostgreSQL. Verify it's correct:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 4: Update Environment Variables

1. **Create/Update `.env` file** in your project root:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin Credentials (for NextAuth)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Image Upload (choose one)
# Option 1: Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Option 2: Vercel Blob
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

2. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator: https://generate-secret.vercel.app/32

### Step 5: Install Dependencies (if needed)

PostgreSQL support is already included in Prisma. No additional packages needed.

### Step 6: Push Schema to Supabase

1. **Stop your dev server** (if running): `Ctrl+C`

2. **Push the schema**:
   ```bash
   npx prisma db push
   ```

   This will:
   - Create all tables in Supabase
   - Set up relationships
   - Create indexes

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Step 7: Verify Connection

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Test the connection**:
   - Go to `http://localhost:3000/admin/login`
   - Try logging in
   - If it works, your database is connected!

### Step 8: (Optional) View Database in Supabase

1. **Go to Table Editor** in Supabase dashboard
2. You should see your tables:
   - `Category`
   - `Product`
   - `Service`
   - `BlogPost`

## 🔐 Security Best Practices

### 1. Use Connection Pooling (Recommended)

For production, use Supabase's connection pooler:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
```

Note: Port `6543` instead of `5432` for connection pooling.

### 2. Environment Variables

- **Never commit `.env` to git**
- Use `.env.local` for local development
- Use environment variables in your hosting platform (Vercel, etc.)

### 3. Database Password

- Store securely
- Use different passwords for dev/staging/production
- Rotate passwords regularly

## 🛠️ Troubleshooting

### Error: "Can't reach database server"

**Solution:**
- Check your internet connection
- Verify the connection string is correct
- Check if Supabase project is active (not paused)

### Error: "password authentication failed"

**Solution:**
- Verify password in connection string matches Supabase password
- Reset password in Supabase dashboard if needed

### Error: "relation does not exist"

**Solution:**
- Run `npx prisma db push` again
- Check if tables were created in Supabase Table Editor

### Error: "too many connections"

**Solution:**
- Use connection pooling (port 6543)
- Add `?pgbouncer=true&connection_limit=1` to connection string

### Database Paused

**Solution:**
- Free tier projects pause after 1 week of inactivity
- Go to Supabase dashboard and click "Restore"

## 📊 Supabase Dashboard Features

### Table Editor
- View and edit data directly
- Useful for testing and debugging

### SQL Editor
- Run custom SQL queries
- Useful for migrations and data manipulation

### Database Settings
- Connection pooling settings
- Backup configuration
- Performance monitoring

## 🚀 Next Steps

After setup:

1. **Create Categories**:
   - Go to `/admin/categories`
   - Create your category structure

2. **Add Products**:
   - Go to `/admin/produits`
   - Add products and assign categories

3. **Set up Services**:
   - Go to `/admin/services`
   - Add your services

## 📝 Quick Reference

### Connection String Format

**Direct Connection:**
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Connection Pooling (Recommended):**
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### Useful Commands

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (GUI for database)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Need Help?** Check Supabase dashboard → Settings → Database for connection details.
