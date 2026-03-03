# Update .env file with Supabase connection pooler (local use only)
# Replace YOUR_PASSWORD and YOUR_PROJECT_REF with your actual Supabase credentials
$envPath = ".env"
$content = @"
# Database - Supabase PostgreSQL
# Get from: Supabase Dashboard → Settings → Database → Connection string
# Pooled (for app): use port 6543 with pgbouncer=true
# Direct (for migrations): use port 5432
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
"@

Set-Content -Path $envPath -Value $content
Write-Host "✅ .env file created. Replace placeholders with your real credentials!" -ForegroundColor Green
