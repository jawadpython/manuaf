-- Run this in Supabase SQL Editor if prisma migrate fails
-- Adds Type, Heures, Capacité fields to QuoteRequest for chariots de location

ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "chariotType" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "heures" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "capacite" TEXT;
