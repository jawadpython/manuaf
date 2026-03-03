-- CreateTable
CREATE TABLE "DevisFormField" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevisFormField_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN IF NOT EXISTS "customData" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "DevisFormField_key_key" ON "DevisFormField"("key");

-- CreateIndex
CREATE INDEX "DevisFormField_sortOrder_idx" ON "DevisFormField"("sortOrder");
