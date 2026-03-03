# Deploy to Vercel (GitHub + Supabase)

Simple steps to upload your project to GitHub and host it on Vercel.

---

## Step 1: Supabase Setup (Database)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a project (or use existing)
3. Wait for the database to be ready
4. Go to **Settings → Database**
5. Copy these two connection strings (replace `[YOUR-PASSWORD]` with your DB password):

   - **Connection pooling (Transaction mode)** → use for `DATABASE_URL` — **you must append `?pgbouncer=true`** to avoid Prisma errors (see checklist below)
   - **Direct connection (Session mode)** → use for `DIRECT_URL`

6. Keep the Supabase project **Active** (free tier pauses after inactivity)

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

| Variable | What it does | Where to get it |
|----------|--------------|-----------------|
| `DATABASE_URL` | Connects the app to your Supabase database (pooled = many connections, fast) | Supabase → Settings → Database → **Connection pooling** (Transaction mode, port 6543) → URI **+ add `?pgbouncer=true`** at the end (required for Prisma) |
| `DIRECT_URL` | Used by Prisma for migrations only (direct connection) | Supabase → Settings → Database → **Connection string** → URI (port 5432) |
| `NEXTAUTH_SECRET` | Encrypts session cookies – without it, admin login breaks | Run in terminal: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your site URL – needed for auth redirects | Use `https://your-project.vercel.app` (update after first deploy) |
| `ADMIN_EMAIL` | Email used to log in to `/admin` | Choose any email (e.g. `admin@manuaf.com`) |
| `ADMIN_PASSWORD` | Password for admin login | Choose a strong password |

### Optional variables (used if set)

| Variable | What it does | Where to get it |
|----------|--------------|-----------------|
| `BLOB_READ_WRITE_TOKEN` | Upload product images in admin (Vercel Blob) | Vercel Dashboard → Storage → Blob → Create store |
| `CLOUDINARY_CLOUD_NAME` | Alternative image upload (Cloudinary) | cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | cloudinary.com dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | cloudinary.com dashboard |
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
DATABASE_URL       = (from Supabase, pooled, port 6543) + ?pgbouncer=true
DIRECT_URL         = (from Supabase, direct, port 5432)
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
