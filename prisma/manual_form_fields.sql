-- Run this in Supabase SQL Editor if prisma migrate fails
-- Creates DevisFormField table and adds customData to QuoteRequest

-- CreateTable
CREATE TABLE IF NOT EXISTS "DevisFormField" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "showFor" TEXT,
    "placeholder" TEXT,
    "options" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevisFormField_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "customData" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DevisFormField_key_key" ON "DevisFormField"("key");
CREATE INDEX IF NOT EXISTS "DevisFormField_sortOrder_idx" ON "DevisFormField"("sortOrder");

-- Seed default fields (optional)
INSERT INTO "DevisFormField" ("id", "key", "label", "type", "required", "sortOrder", "showFor", "placeholder", "active", "createdAt", "updatedAt")
SELECT 'seed1', 'chariottype', 'Type', 'text', false, 1, 'chariots-location', 'Ex: Frontal, Rétractable...', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "DevisFormField" WHERE "key" = 'chariottype');
INSERT INTO "DevisFormField" ("id", "key", "label", "type", "required", "sortOrder", "showFor", "placeholder", "active", "createdAt", "updatedAt")
SELECT 'seed2', 'heures', 'Heures', 'text', false, 2, 'chariots-location', 'Ex: 1500 h, 2000 h...', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "DevisFormField" WHERE "key" = 'heures');
INSERT INTO "DevisFormField" ("id", "key", "label", "type", "required", "sortOrder", "showFor", "placeholder", "active", "createdAt", "updatedAt")
SELECT 'seed3', 'capacite', 'Capacité (kg)', 'text', false, 3, 'chariots-location', 'Ex: 2500, 3000...', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "DevisFormField" WHERE "key" = 'capacite');
