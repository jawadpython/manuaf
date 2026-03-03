# Fix: "Oups ! Une erreur s'est produite" after deployment

If you see generic errors on the site after deploying (adding products, chariots, loading pages), the cause is almost always **Prisma + PgBouncer prepared statement conflict**.

---

## Root cause

Supabase's **Transaction mode** pooler (port 6543) does not support prepared statements. Prisma uses them by default, which triggers errors like:

- `prepared statement "s0" already exists`
- Generic "Oups ! Une erreur s'est produite"

---

## Fix: Add `pgbouncer=true` to DATABASE_URL

1. Go to **Vercel** → Your project → **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Edit it and ensure the URL ends with `?pgbouncer=true` (or `&pgbouncer=true` if there are already query params)

**Correct format (Transaction mode, port 6543):**

```
postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

If your URL is:

```
postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:6543/postgres
```

Add `?pgbouncer=true` before any other params, or append `&pgbouncer=true`:

```
postgresql://postgres.PROJECT_REF:PASSWORD@REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
```

4. Save the variable
5. **Redeploy** the project (Vercel → Deployments → ... on latest → Redeploy)

---

## Alternative: Use Session mode (port 5432)

If `pgbouncer=true` still causes issues, use Supabase's **Session mode** pooler instead:

1. In Supabase Dashboard → **Settings** → **Database**
2. Find **Connection pooling** → **Session mode** (port 5432)
3. Copy that URI
4. Set `DATABASE_URL` in Vercel to this Session mode URI (no `pgbouncer=true` needed)

Session mode supports prepared statements but handles fewer concurrent connections. For most apps it works fine.

---

## Verify

After redeploying:

1. Visit `/admin`
2. Try adding a product or chariot
3. Browse products and chariots pages

If errors persist, check `/admin/log` for database connection status.

---

## Fix: "Erreur lors de l'enregistrement local" (image upload)

When uploading product/chariot images in admin on Vercel, local file storage does **not** work (Vercel's filesystem is read-only).

### Solution: Configure cloud storage

**Option A: Vercel Blob (recommended)**

1. Go to **Vercel** → Your project → **Storage**
2. Click **Create Database** → **Blob**
3. Create a Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add it in **Settings** → **Environment Variables**
6. Redeploy

**Option B: Cloudinary**

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. From Dashboard, copy: Cloud name, API Key, API Secret
3. Add in Vercel: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4. Redeploy
