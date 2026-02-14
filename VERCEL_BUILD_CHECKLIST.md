# Vercel Build Checklist

This project has been audited for Vercel deployment. Follow this checklist for a successful build.

## Build status

- **Next.js build**: `npx next build` completes successfully (TypeScript, static generation, and routes compile).
- **Lint**: No ESLint errors in `src/`.
- **Merge conflicts**: No `<<<<<<<` / `=======` / `>>>>>>>` markers in the codebase.
- **Hydration**: Footer year and Header logo use `suppressHydrationWarning` where needed.

## Required environment variables (Vercel)

Set these in **Vercel** → **Project** → **Settings** → **Environment Variables** for **Production**, **Preview**, and **Development** (or at least Production + Preview):

| Variable           | Required | Description |
|--------------------|----------|-------------|
| `DATABASE_URL`     | Yes      | PostgreSQL connection string (pooled URL for serverless, e.g. port 6543 with Supabase/Neon). |
| `DIRECT_URL`       | Yes      | Direct PostgreSQL URL (no pooling), used by Prisma for migrations. |
| `NEXTAUTH_SECRET`  | Yes      | Random secret for NextAuth (e.g. `openssl rand -base64 32`). |
| `NEXTAUTH_URL`      | Yes      | Full URL of the app (e.g. `https://your-app.vercel.app`). |
| `ADMIN_EMAIL`      | Yes      | Admin login email. |
| `ADMIN_PASSWORD`   | Yes      | Admin login password. |

**Important:** Static pages (e.g. `/`, `/produits/chariots/location`) are generated at **build** time and call the database. So `DATABASE_URL` and `DIRECT_URL` must be set **before** the first build on Vercel, or the build will fail when Prisma runs and pages fetch data.

## Optional (uploads)

- **Vercel Blob**: set `BLOB_READ_WRITE_TOKEN` if you use Vercel Blob for uploads.
- **Cloudinary**: set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and optionally `CLOUDINARY_API_SECRET` / `CLOUDINARY_UPLOAD_PRESET` if you use Cloudinary.

## After deployment

1. Run migrations once (e.g. locally with `vercel env pull` then `npx prisma db push`, or via your DB provider).
2. Open `https://your-app.vercel.app` and test: home, produits (location/occasion), contact, admin login.

See **DEPLOYMENT.md** for full step-by-step deployment and database setup.
