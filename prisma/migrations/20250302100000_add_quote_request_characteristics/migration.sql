-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "chariotType" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "heures" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "capacite" TEXT;
