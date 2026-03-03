# Fix Database Connection Error

## Error: "Can't reach database server"

This usually means your Supabase project is **paused** (common on free tier).

## Quick Fix Steps:

### 1. Check and Restore Supabase Project

1. Go to: https://supabase.com/dashboard
2. Log in to your account
3. Find your project in the list
4. If you see a "Paused" status or a "Restore" button:
   - Click **"Restore"** or **"Resume"**
   - Wait 1-2 minutes for the project to restart
5. Once restored, try accessing your admin panel again

### 2. Verify Connection String

After restoring, verify your `.env` file has the correct connection string:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

Get the exact strings from Supabase Dashboard → Settings → Database → Connection string (URI).

### 3. Test Connection

After restoring, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. If Still Not Working

If the project is active but still can't connect:

1. **Check Supabase Dashboard:**
   - Go to Settings → Database
   - Verify the connection string matches your `.env`

2. **Try Direct Connection:**
   - In Supabase Dashboard → Settings → Database
   - Copy the "Connection string" (not the pooler)
   - Update your `.env` with the direct connection string

3. **Check Network:**
   - Ensure your firewall isn't blocking the connection
   - Try from a different network if possible

## Prevention

To prevent pausing:
- Use Supabase Pro plan (paid)
- Or regularly access your project to keep it active
- Set up a cron job to ping your database periodically

## Need Help?

If the issue persists:
1. Check Supabase status: https://status.supabase.com
2. Check your Supabase project logs in the dashboard
3. Verify your database credentials are correct
