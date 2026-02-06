-- Add 'sold' column to Product table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "sold" BOOLEAN NOT NULL DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS "Product_sold_idx" ON "Product"("sold");
