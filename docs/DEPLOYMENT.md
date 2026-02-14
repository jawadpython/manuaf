# 🚀 Deployment Guide

This guide provides detailed instructions for deploying the Logistec application to Vercel.

## Prerequisites

- GitHub account
- Vercel account ([sign up here](https://vercel.com))
- PostgreSQL database (Supabase, Neon, or Vercel Postgres)

## Step-by-Step Deployment

### 1. Push to GitHub

If you haven't already, create a GitHub repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your repository
4. Vercel will auto-detect Next.js - no configuration needed
5. Click **Deploy**

### 3. Configure Environment Variables

In **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**, add:

#### Required Variables

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-project.vercel.app
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

#### Optional Variables (for image uploads)

```env
BLOB_READ_WRITE_TOKEN=...  # Auto-provided if using Vercel Blob
# OR
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_UPLOAD_PRESET=...
```

### 4. Set Up Database

#### Option A: Vercel Postgres (Recommended)

1. In **Vercel Dashboard** → **Storage** → **Create Database**
2. Select **Postgres**
3. Choose a name and region
4. `DATABASE_URL` and `DIRECT_URL` are automatically added to environment variables

#### Option B: External Database (Supabase/Neon)

1. Create a PostgreSQL database on Supabase or Neon
2. Get the connection strings
3. Add `DATABASE_URL` and `DIRECT_URL` manually in Vercel environment variables

### 5. Run Database Migrations

After the first deployment, you need to initialize the database schema:

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma db push
```

**Option B: Using Vercel Dashboard**

1. Go to **Storage** → Your database → **Query**
2. Copy the schema from `prisma/schema.prisma`
3. Execute the SQL manually

**Option C: Using Prisma Studio (Local)**

```bash
# Pull env vars
vercel env pull .env.local

# Open Prisma Studio
npx prisma studio
```

### 6. Configure Image Storage (Optional)

#### Option A: Vercel Blob

1. In **Vercel Dashboard** → **Storage** → **Create Database**
2. Select **Blob**
3. `BLOB_READ_WRITE_TOKEN` is automatically added

#### Option B: Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Add them to Vercel environment variables

### 7. Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` in environment variables:

- For Vercel default domain: `https://your-project.vercel.app`
- For custom domain: `https://yourdomain.com`

### 8. Redeploy

After adding environment variables, trigger a new deployment:

- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment
- Or push a new commit to trigger automatic deployment

## Post-Deployment Checklist

- [ ] Database schema initialized
- [ ] Environment variables configured
- [ ] Admin credentials set
- [ ] Image storage configured (if needed)
- [ ] `NEXTAUTH_URL` updated
- [ ] Test admin login at `/admin`
- [ ] Test product creation
- [ ] Test image uploads

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check if database allows connections from Vercel IPs
- For Supabase: Ensure project is not paused

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set (32+ characters)
- Check `NEXTAUTH_URL` matches your deployment URL
- Clear browser cookies and try again

### Image Upload Issues

- Verify Blob or Cloudinary credentials are set
- Check file size limits
- Verify CORS settings if using external storage

## Custom Domain Setup

1. In **Vercel Dashboard** → **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` with your custom domain
5. Redeploy

## Environment-Specific Variables

You can set different variables for different environments:

- **Production**: `vercel env add VARIABLE_NAME production`
- **Preview**: `vercel env add VARIABLE_NAME preview`
- **Development**: `vercel env add VARIABLE_NAME development`

## Monitoring

- Check deployment logs in **Vercel Dashboard** → **Deployments**
- Monitor function logs in **Functions** tab
- Set up error tracking (Sentry, etc.) for production

## Support

For issues:
1. Check Vercel [documentation](https://vercel.com/docs)
2. Check Next.js [documentation](https://nextjs.org/docs)
3. Open an issue on GitHub
