# Supabase Connection Troubleshooting

## Current Status
- ✅ .env file updated with: `postgresql://postgres:Islamsalma123@db.twmhpaeudrtpewwbepum.supabase.co:5432/postgres`
- ❌ Connection test failed: "Can't reach database server"

## Most Common Causes

### 1. Project is Paused (Free Tier)
**This is the #1 cause!**

Free tier Supabase projects pause after 1 week of inactivity.

**Solution:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Check your project status
3. If you see "Paused" or "Restore" button, click it
4. Wait 1-2 minutes for restoration
5. Try connection again

### 2. Wrong Password
**Verify the password is correct:**

1. Go to Supabase Dashboard → Settings → Database
2. Check "Database password" section
3. If unsure, click "Reset database password"
4. Update your `.env` file with the new password

### 3. Connection String Format
**Get the EXACT connection string from Supabase:**

1. Supabase Dashboard → Settings → Database
2. Scroll to "Connection string"
3. Click **"URI"** tab (not Session mode)
4. Copy the EXACT string shown
5. Replace `[YOUR-PASSWORD]` with your actual password
6. Update `.env` file

### 4. Network/Firewall Issues
**Check:**
- Internet connection is working
- Firewall isn't blocking port 5432
- Try from different network
- Try using mobile hotspot

### 5. Project Not Fully Initialized
**Wait a bit:**
- New projects take 1-2 minutes to fully initialize
- Check Supabase dashboard for "Setting up..." status

## Quick Fix Steps

### Step 1: Verify Project Status
```
1. Open: https://supabase.com/dashboard
2. Click on your project
3. Check if it says "Active" or "Paused"
4. If paused → Click "Restore" → Wait 2 minutes
```

### Step 2: Get Fresh Connection String
```
1. Settings → Database
2. Connection string → URI tab
3. Copy the string
4. Replace [YOUR-PASSWORD] with: Islamsalma123
5. Should look like:
   postgresql://postgres:Islamsalma123@db.twmhpaeudrtpewwbepum.supabase.co:5432/postgres
```

### Step 3: Update .env File
Make sure your `.env` has:
```env
DATABASE_URL="postgresql://postgres:Islamsalma123@db.twmhpaeudrtpewwbepum.supabase.co:5432/postgres"
```

### Step 4: Test Again
```bash
npx prisma db push
```

## Alternative: Try Connection Pooling

If direct connection doesn't work, try pooling (port 6543):

```env
DATABASE_URL="postgresql://postgres:Islamsalma123@db.twmhpaeudrtpewwbepum.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
```

## Verify Connection String Format

Your connection string should be:
```
postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

Where:
- `PASSWORD` = Your database password (Islamsalma123)
- `PROJECT_REF` = Your project reference (twmhpaeudrtpewwbepum)

**Important:** 
- No extra `@` symbols
- No spaces
- Password should be URL-encoded if it has special characters

## Test Connection Manually

You can test if the connection works using a PostgreSQL client:

```bash
# Using psql (if installed)
psql "postgresql://postgres:Islamsalma123@db.twmhpaeudrtpewwbepum.supabase.co:5432/postgres"
```

Or use an online tool like:
- [ElephantSQL](https://www.elephantsql.com/) - Test connection
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL GUI

## Next Steps

1. **Check Supabase Dashboard** - Is project active?
2. **Verify Password** - Does it match in Supabase settings?
3. **Get Fresh Connection String** - Copy from Supabase dashboard
4. **Update .env** - Use exact string from Supabase
5. **Test Again** - Run `npx prisma db push`

## Still Not Working?

1. **Check Supabase Logs:**
   - Dashboard → Logs → Database
   - Look for connection errors

2. **Try Different Connection Method:**
   - Use Supabase's connection pooler (port 6543)
   - Or try the "Session mode" connection string

3. **Contact Support:**
   - Supabase Discord: https://discord.supabase.com
   - Supabase GitHub: https://github.com/supabase/supabase

---

**Most likely issue:** Project is paused. Check Supabase dashboard first!
