# Supabase Quick Start

## ⚡ Quick Setup (5 minutes)

### 1. Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - Name: `logistec2` (or your choice)
   - Database Password: **Save this password!**
   - Region: Choose closest
4. Wait 1-2 minutes for setup

### 2. Get Connection String

1. In Supabase dashboard → **Settings** → **Database**
2. Scroll to "Connection string"
3. Click **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password

Example:
```
postgresql://postgres:myPassword123@db.abcdefgh.supabase.co:5432/postgres
```

### 3. Update Your `.env` File

Create/update `.env` in project root:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-this-with-openssl-rand-base64-32

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Update Prisma Schema

The schema is already updated to use PostgreSQL. Just verify:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. Push Schema to Supabase

```bash
# Stop dev server first (Ctrl+C)

# Push schema
npx prisma db push

# Generate client
npx prisma generate

# Start dev server
npm run dev
```

### 6. Test Connection

1. Go to `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. If it works, you're connected! ✅

## 🎯 That's It!

Your database is now connected to Supabase. You can:

- View data in Supabase dashboard → Table Editor
- Manage data through your admin panel
- Use all Prisma features with PostgreSQL

## 🔍 Verify in Supabase

1. Go to Supabase dashboard
2. Click **Table Editor**
3. You should see: `Category`, `Product`, `Service`, `BlogPost`

## ⚠️ Common Issues

**"Can't reach database"**
- Check connection string has correct password
- Verify project is not paused

**"password authentication failed"**
- Double-check password in connection string
- Reset password in Supabase if needed

**"relation does not exist"**
- Run `npx prisma db push` again

---

**Full Guide:** See `SUPABASE_SETUP_GUIDE.md` for detailed instructions.
