# Setup Instructions - Admin Panel

## ⚠️ Important: You need to complete these steps to see the changes

### Step 1: Stop the Development Server
If your dev server is running (`npm run dev`), **stop it first** (Ctrl+C in the terminal).

### Step 2: Update Database Schema
Run the Prisma migration to add the Service model to your database:

```bash
npx prisma migrate dev --name add_service_model
```

**OR** if you prefer to push without creating a migration file:

```bash
npx prisma db push
```

### Step 3: Generate Prisma Client
After the migration, generate the Prisma client:

```bash
npx prisma generate
```

### Step 4: Restart Development Server
Start your dev server again:

```bash
npm run dev
```

### Step 5: Access Admin Panel
1. Navigate to: `http://localhost:3000/admin/login`
2. Login with your credentials from `.env`:
   - Email: `ADMIN_EMAIL` value
   - Password: `ADMIN_PASSWORD` value
3. You should now see:
   - Dashboard with 3 cards: Produits, Services, Blog
   - Services link in the sidebar navigation
   - Full CRUD interface for Services

## 🔍 Troubleshooting

### If you see "Service model not found" errors:
- Make sure you ran `npx prisma db push` or `npx prisma migrate dev`
- Make sure you ran `npx prisma generate`
- Restart your dev server

### If the admin panel doesn't load:
- Check that your `.env` file has:
  ```
  ADMIN_EMAIL=your-email@example.com
  ADMIN_PASSWORD=your-password
  NEXTAUTH_SECRET=your-secret
  NEXTAUTH_URL=http://localhost:3000
  ```

### If you see middleware errors:
- Make sure `middleware.ts` exists in the root directory
- Restart the dev server after creating middleware

### If images don't upload:
- The upload will work with local storage by default
- For Cloudinary: Add credentials to `.env`
- For Vercel Blob: Add token to `.env`

## ✅ Verification Checklist

After completing the steps above, you should be able to:

- [ ] Access `/admin/login` and login successfully
- [ ] See the dashboard with 3 cards (Produits, Services, Blog)
- [ ] Click on "Services" and see the Services management page
- [ ] Create a new service
- [ ] Edit an existing service
- [ ] Delete a service
- [ ] Upload images for services

## 📝 Quick Commands Summary

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Update database
npx prisma db push

# 3. Generate Prisma client
npx prisma generate

# 4. Start dev server
npm run dev
```

Then visit: `http://localhost:3000/admin/login`
