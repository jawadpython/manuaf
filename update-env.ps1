# Update .env file with Supabase connection pooler
$envPath = ".env"
$content = @"
# Database - Supabase PostgreSQL (Connection Pooler)
DATABASE_URL="postgresql://postgres.twmhpaeudrtpewwbepum:Islamsalma123@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="E6ryxFLdK0BEoaUwtaycit4oRlGmQwZciJmBuOKS+to="

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me

# Image Upload (optional)
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
"@

Set-Content -Path $envPath -Value $content
Write-Host "✅ .env file updated with connection pooler!" -ForegroundColor Green
