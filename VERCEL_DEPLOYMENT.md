# Deploy to Vercel (GitHub + Supabase)

Simple steps to upload your project to GitHub and host it on Vercel.

---

## Step 1: Supabase Setup (Database)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a project (or use existing)
3. Wait for the database to be ready
4. Go to **Settings → Database**
5. Copy these two connection strings (replace `[YOUR-PASSWORD]` with your DB password):

   - **Connection pooling (Transaction mode)** → use for `DATABASE_URL`
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

| Variable | Value | Where to get it |
|----------|-------|-----------------|
| `DATABASE_URL` | Pooled connection string | Supabase → Settings → Database → Connection pooling |
| `DIRECT_URL` | Direct connection string | Supabase → Settings → Database → Connection string (URI) |
| `NEXTAUTH_SECRET` | Random 32+ chars | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | After first deploy |
| `ADMIN_EMAIL` | Your admin email | Any email |
| `ADMIN_PASSWORD` | Strong password | For admin login |

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
