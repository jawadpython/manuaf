# Supabase Setup Script
# This script updates your .env file with Supabase connection string

$projectPath = "C:\Users\Pc\3D Objects\websites.khedma\logistec2"
$envPath = Join-Path $projectPath ".env"

# Fixed connection string (removed extra @)
$databaseUrl = "postgresql://postgres:Islamsalma123@db.twmhpaeudrtpewwbepum.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
$nextAuthSecret = "E6ryxFLdK0BEoaUwtaycit4oRlGmQwZciJmBuOKS+to="

Write-Host "🔧 Setting up Supabase connection..." -ForegroundColor Cyan

# Read existing .env or create new
if (Test-Path $envPath) {
    Write-Host "✅ Found existing .env file" -ForegroundColor Green
    $envContent = Get-Content $envPath -Raw
} else {
    Write-Host "📝 Creating new .env file" -ForegroundColor Yellow
    $envContent = ""
}

# Update or add DATABASE_URL
if ($envContent -match "DATABASE_URL=") {
    $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=`"$databaseUrl`""
    Write-Host "✅ Updated DATABASE_URL" -ForegroundColor Green
} else {
    $envContent += "`n# Database - Supabase PostgreSQL`nDATABASE_URL=`"$databaseUrl`"`n"
    Write-Host "✅ Added DATABASE_URL" -ForegroundColor Green
}

# Update or add NEXTAUTH_SECRET
if ($envContent -match "NEXTAUTH_SECRET=") {
    $envContent = $envContent -replace "NEXTAUTH_SECRET=.*", "NEXTAUTH_SECRET=`"$nextAuthSecret`""
    Write-Host "✅ Updated NEXTAUTH_SECRET" -ForegroundColor Green
} else {
    $envContent += "`n# NextAuth`nNEXTAUTH_URL=http://localhost:3000`nNEXTAUTH_SECRET=`"$nextAuthSecret`"`n"
    Write-Host "✅ Added NEXTAUTH_SECRET" -ForegroundColor Green
}

# Ensure NEXTAUTH_URL exists
if (-not ($envContent -match "NEXTAUTH_URL=")) {
    $envContent += "`nNEXTAUTH_URL=http://localhost:3000`n"
}

# Ensure ADMIN credentials exist
if (-not ($envContent -match "ADMIN_EMAIL=")) {
    $envContent += "`n# Admin Credentials`nADMIN_EMAIL=admin@example.com`nADMIN_PASSWORD=change-me`n"
    Write-Host "⚠️  Added default admin credentials - please update ADMIN_PASSWORD!" -ForegroundColor Yellow
}

# Write to file
Set-Content -Path $envPath -Value $envContent.Trim()

Write-Host "`n✅ .env file updated successfully!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Review .env file and update ADMIN_PASSWORD if needed"
Write-Host "2. Run: npx prisma db push"
Write-Host "3. Run: npx prisma generate"
Write-Host "4. Run: npm run dev"
Write-Host "`n"
