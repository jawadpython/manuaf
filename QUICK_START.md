# ⚡ QUICK START - Admin Panel

## 🎯 What You Need to Do RIGHT NOW

### 1️⃣ Create `.env` File

Create a file named `.env` in your project root (same folder as `package.json`) with this:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
DIRECT_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="any-random-string-at-least-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="yourpassword123"
```

**⚠️ IMPORTANT:** 
- Replace `DATABASE_URL` and `DIRECT_URL` with your actual PostgreSQL database connection string
- If you don't have a database, get a free one at: https://neon.tech or https://supabase.com

### 2️⃣ Run These Commands (in order)

```bash
# Stop your dev server first (Ctrl+C if running)

# Set up database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start server
npm run dev
```

### 3️⃣ Open Admin Panel

1. Go to: **http://localhost:3000/admin/login**
2. Login with:
   - Email: `admin@example.com` (or whatever you put in ADMIN_EMAIL)
   - Password: `yourpassword123` (or whatever you put in ADMIN_PASSWORD)

## ✅ That's It!

You should now see the admin dashboard with 3 sections:
- **Produits** - Manage products
- **Services** - Manage services  
- **Blog** - Manage blog posts

---

## 🆘 Need Help?

See `ADMIN_PANEL_GUIDE.md` for detailed instructions and troubleshooting.
