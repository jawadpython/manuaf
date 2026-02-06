# Quick Verification Checklist

## ✅ Verify These Steps:

### 1. Supabase Project Status
- [ ] Go to supabase.com/dashboard
- [ ] Project is **ACTIVE** (not paused)
- [ ] If paused, click "Restore" and wait

### 2. Get Correct Connection String
- [ ] Settings → Database → Connection string
- [ ] Click **URI** tab
- [ ] Copy the connection string
- [ ] It should look like:
  ```
  postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  ```
  OR
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
  ```

### 3. Update .env File
- [ ] Replace `[YOUR-PASSWORD]` with actual password
- [ ] Use the EXACT format from Supabase
- [ ] Save the file

### 4. Test Connection
```bash
npx prisma db push
```

### 5. If Still Failing
- [ ] Try port 5432 (direct) instead of 6543 (pooled)
- [ ] Verify password is correct
- [ ] Check Supabase project is not paused
- [ ] Check internet connection

---

**Your connection string format:**
```
postgresql://postgres:Islamsalma123@db.twmhpaeudrtpewwbepum.supabase.co:5432/postgres
```

Make sure:
- ✅ Password is correct: `Islamsalma123`
- ✅ No extra `@` symbols
- ✅ Project is active in Supabase dashboard
