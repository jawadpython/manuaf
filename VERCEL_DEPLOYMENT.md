# Deploy to Vercel

This project is configured for Vercel deployment. Follow these steps.

---

## Prerequisites

- **Database**: Neon (via Vercel Storage) or Supabase
- **Node.js**: 18+

---

## Step 1: Database Setup

### Option A: Neon (via Vercel)

1. Vercel → Your project → **Storage** → **Create Database**
2. Choose **Neon** (Postgres)
3. Connect to your project — Vercel auto-adds `Neon_data_DATABASE_URL` and `Neon_data_DATABASE_URL_UNPOOLED`
4. The Prisma schema uses these variables by default

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. Get connection strings from **Settings → Database**
3. Add in Vercel: `DATABASE_URL` (pooled + `?pgbouncer=true`) and `DIRECT_URL` (direct)
4. **Important**: Edit `prisma/schema.prisma` — change `url` to `env("DATABASE_URL")` and `directUrl` to `env("DIRECT_URL")`

---

## Step 2: GitHub Upload

1. Create a repo on [github.com](https://github.com) (e.g. `logistec-manuaf`)
2. In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**Important:** `.env` is in `.gitignore` — it is **not** pushed to GitHub. Keep secrets only in Vercel.

---

## Step 3: Vercel Deployment

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub)
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Framework: **Next.js** (auto-detected)
5. Before deploying, go to **Settings → Environment Variables** and add:

### Required variables (must have)

**If using Neon** (Vercel Storage): `Neon_data_DATABASE_URL` and `Neon_data_DATABASE_URL_UNPOOLED` are auto-injected.

**If using Supabase**: Add these manually:

| Variable | What it does | Where to get it |
|----------|--------------|-----------------|
| `Neon_data_DATABASE_URL` | Pooled DB connection (or use `DATABASE_URL` if you changed schema) | Supabase → Settings → Database → Connection pooling (port 6543) **+ `?pgbouncer=true`** |
| `Neon_data_DATABASE_URL_UNPOOLED` | Direct DB connection (or use `DIRECT_URL`) | Supabase → Settings → Database → Direct connection (port 5432) |
| `NEXTAUTH_SECRET` | Encrypts session cookies – without it, admin login breaks | Run in terminal: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your site URL – needed for auth redirects | Use `https://your-project.vercel.app` (update after first deploy) |
| `ADMIN_EMAIL` | Email used to log in to `/admin` | Choose any email (e.g. `admin@manuaf.com`) |
| `ADMIN_PASSWORD` | Password for admin login | Choose a strong password |

### Image uploads (required for admin product/chariot images)

**Local storage does NOT work on Vercel.** You must configure one of:

| Variable | What it does | Where to get it |
|----------|--------------|-----------------|
| `BLOB_READ_WRITE_TOKEN` | ✅ Recommended: Upload images (Vercel Blob) | Vercel Dashboard → **Storage** → **Blob** → Create store → Copy token |
| `CLOUDINARY_CLOUD_NAME` | Alternative (Cloudinary) | cloudinary.com → Dashboard → Cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | cloudinary.com dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | cloudinary.com dashboard |

See also: `DEPLOYMENT_FIX.md` if you see "Erreur lors de l'enregistrement local".

### Other optional variables (used if set)
| `RESEND_API_KEY` | Send emails (contact form, rental requests) | resend.com → API Keys |
| `EMAIL_FROM` | Sender address for emails | Your verified domain (e.g. `noreply@manuaf.com`) |

6. Click **Deploy**

---

## Step 4: Database Schema (if new database)

If your Supabase database is empty, run locally (with `.env` configured):

```bash
npx prisma db push
```

---

## Step 5: Final Checks

- [ ] Update `NEXTAUTH_URL` in Vercel to your final URL
- [ ] Supabase project is active (unpause if needed)
- [ ] Visit `https://your-project.vercel.app/admin` and log in
- [ ] Test contact forms, product pages, etc.

---

## Optional: Custom Domain

1. Vercel → **Settings → Domains**
2. Add your domain
3. Update `NEXTAUTH_URL` to your custom domain

---

## Security Notes

- **Never** put real passwords or keys in code or docs
- `.env` is ignored by git — keep it local only
- All production secrets go in **Vercel** → Environment Variables
- Generate a new `NEXTAUTH_SECRET` for each environment

---

## Vercel variables checklist

Add these in Vercel → Project → Settings → Environment Variables:

```
# Database – Neon auto-injects Neon_data_*. For Supabase, add:
Neon_data_DATABASE_URL         = (pooled URL + ?pgbouncer=true)
Neon_data_DATABASE_URL_UNPOOLED = (direct connection URL)
NEXTAUTH_SECRET    = (run: openssl rand -base64 32)
NEXTAUTH_URL       = https://YOUR_APP.vercel.app
ADMIN_EMAIL        = your@email.com
ADMIN_PASSWORD     = your-secure-password

# Optional – image upload in admin
BLOB_READ_WRITE_TOKEN  = (Vercel Blob token)
# OR
CLOUDINARY_CLOUD_NAME  = your-cloud-name
CLOUDINARY_API_KEY     = your-key
CLOUDINARY_API_SECRET  = your-secret

# Optional – email notifications
RESEND_API_KEY     = re_xxxxx
EMAIL_FROM         = noreply@yourdomain.com
```
