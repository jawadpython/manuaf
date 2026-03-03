-- Run this SQL manually in Supabase SQL Editor if "prisma migrate dev" fails
-- (e.g. database unreachable, connection timeout)
--
-- Copy-paste into: Supabase Dashboard > SQL Editor > New query > Run
--
-- After running, mark the migration as applied:
--   npx prisma migrate resolve --applied 20250302000000_add_quote_requests

CREATE TABLE IF NOT EXISTS "QuoteRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "product" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "QuoteRequest_status_idx" ON "QuoteRequest"("status");
CREATE INDEX IF NOT EXISTS "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");
