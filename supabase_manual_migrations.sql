-- ============================================================
-- MANUAL MIGRATIONS FOR SUPABASE
-- Run these in Supabase SQL Editor (Dashboard → SQL Editor)
-- Execute each section separately or all at once.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Add image column to Category (if not already exists)
-- Migration: 20250224000000_add_category_image
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'Category'
    AND column_name = 'image'
  ) THEN
    ALTER TABLE "Category" ADD COLUMN "image" TEXT;
  END IF;
END $$;


-- ------------------------------------------------------------
-- 2. Create RentalRequest table (if not already exists)
-- Migration: 20250224120000_add_rental_requests
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "RentalRequest" (
    "id" TEXT NOT NULL,
    "chariot_type" TEXT NOT NULL,
    "motorisation" TEXT NOT NULL,
    "capacite_kg" INTEGER,
    "hauteur_m" DOUBLE PRECISION,
    "ville" TEXT,
    "duree_location" TEXT,
    "type_roues" TEXT,
    "type_mat" TEXT,
    "notes" TEXT,
    "client_name" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RentalRequest_pkey" PRIMARY KEY ("id")
);

-- Create indexes (ignore if already exist)
CREATE INDEX IF NOT EXISTS "RentalRequest_status_idx" ON "RentalRequest"("status");
CREATE INDEX IF NOT EXISTS "RentalRequest_createdAt_idx" ON "RentalRequest"("createdAt");


-- ------------------------------------------------------------
-- 3. Trigger to auto-update updatedAt on RentalRequest
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_rental_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rental_request_updated_at ON "RentalRequest";
CREATE TRIGGER rental_request_updated_at
  BEFORE UPDATE ON "RentalRequest"
  FOR EACH ROW
  EXECUTE PROCEDURE update_rental_request_updated_at();


-- ------------------------------------------------------------
-- 4. Seed Chariots categories (occasion & location) if not exist
-- Migration: 20250224130000_seed_chariots_categories
-- ------------------------------------------------------------
INSERT INTO "Category" ("id", "name", "slug", "description", "type", "order", "published", "createdAt", "updatedAt")
SELECT 
  'seed_chariots_de_location_' || substr(md5(random()::text), 1, 12),
  'Chariots de location',
  'chariots-de-location',
  'Chariots disponibles à la location',
  'chariots',
  0,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'chariots-de-location');

INSERT INTO "Category" ("id", "name", "slug", "description", "type", "order", "published", "createdAt", "updatedAt")
SELECT 
  'seed_chariots_occasion_' || substr(md5(random()::text), 1, 12),
  'Chariots d''occasion',
  'chariots-d-occasion',
  'Chariots d''occasion reconditionnés',
  'chariots',
  1,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'chariots-d-occasion');

-- Add Électrique and Thermique as subcategories (run after parent categories exist)
INSERT INTO "Category" ("id", "name", "slug", "type", "parentId", "order", "published", "createdAt", "updatedAt")
SELECT 
  'seed_electrique_loc_' || substr(md5(random()::text), 1, 8),
  'Électrique',
  'electrique-location',
  'chariots',
  (SELECT id FROM "Category" WHERE slug = 'chariots-de-location' LIMIT 1),
  0,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Category" WHERE slug = 'chariots-de-location')
  AND NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'electrique-location');

INSERT INTO "Category" ("id", "name", "slug", "type", "parentId", "order", "published", "createdAt", "updatedAt")
SELECT 
  'seed_thermique_loc_' || substr(md5(random()::text), 1, 8),
  'Thermique',
  'thermique-location',
  'chariots',
  (SELECT id FROM "Category" WHERE slug = 'chariots-de-location' LIMIT 1),
  1,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Category" WHERE slug = 'chariots-de-location')
  AND NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'thermique-location');

INSERT INTO "Category" ("id", "name", "slug", "type", "parentId", "order", "published", "createdAt", "updatedAt")
SELECT 
  'seed_electrique_occ_' || substr(md5(random()::text), 1, 8),
  'Électrique',
  'electrique-occasion',
  'chariots',
  (SELECT id FROM "Category" WHERE slug = 'chariots-d-occasion' LIMIT 1),
  0,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Category" WHERE slug = 'chariots-d-occasion')
  AND NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'electrique-occasion');

INSERT INTO "Category" ("id", "name", "slug", "type", "parentId", "order", "published", "createdAt", "updatedAt")
SELECT 
  'seed_thermique_occ_' || substr(md5(random()::text), 1, 8),
  'Thermique',
  'thermique-occasion',
  'chariots',
  (SELECT id FROM "Category" WHERE slug = 'chariots-d-occasion' LIMIT 1),
  1,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Category" WHERE slug = 'chariots-d-occasion')
  AND NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'thermique-occasion');


-- ------------------------------------------------------------
-- 5. Seed BlogPost with sample posts (images from /images/random-images)
-- Migration: 20250224140000_seed_blog_posts
-- ------------------------------------------------------------
INSERT INTO "BlogPost" ("id", "title", "slug", "excerpt", "content", "image", "published", "createdAt", "updatedAt")
SELECT 
  'blog_seed_1_' || substr(md5(random()::text), 1, 12),
  'Comment choisir la bonne société pour l''entretien de vos équipements de manutention ?',
  'choisir-societe-entretien-manutention',
  'Dans le domaine de la manutention, la fiabilité des équipements est primordiale. Découvrez nos conseils pour choisir le bon partenaire.',
  '<p>Le choix d''une société de maintenance pour vos équipements de manutention est crucial pour garantir la sécurité et la productivité de vos opérations.</p><h2>Les critères essentiels</h2><p>Lors de votre sélection, assurez-vous de vérifier l''expertise technique, les certifications, la disponibilité du service après-vente et la qualité des pièces de rechange utilisées.</p>',
  '/images/random-images/ewwewewescas.webp',
  true,
  '2024-01-15'::timestamp,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "BlogPost" WHERE slug = 'choisir-societe-entretien-manutention');

INSERT INTO "BlogPost" ("id", "title", "slug", "excerpt", "content", "image", "published", "createdAt", "updatedAt")
SELECT 
  'blog_seed_2_' || substr(md5(random()::text), 1, 12),
  'Louer des chariots supplémentaires lors d''un pic de saisonnalité',
  'louer-chariots-pic-saisonnalite',
  'En tant qu''acteur majeur du secteur de la logistique, vous devez anticiper les périodes de forte activité. Voici comment gérer vos besoins.',
  '<p>Les pics de saisonnalité peuvent mettre à rude épreuve votre flotte de chariots élévateurs. La location de chariots supplémentaires est une solution flexible et économique.</p><h2>Avantages de la location</h2><p>La location vous permet d''adapter votre capacité de manutention sans investissement lourd.</p>',
  '/images/random-images/Gemini_Generated_Image_1wsmpf1wsmpf1wsm.webp',
  true,
  '2024-01-10'::timestamp,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "BlogPost" WHERE slug = 'louer-chariots-pic-saisonnalite');

INSERT INTO "BlogPost" ("id", "title", "slug", "excerpt", "content", "image", "published", "createdAt", "updatedAt")
SELECT 
  'blog_seed_3_' || substr(md5(random()::text), 1, 12),
  'Optimiser la gestion de sa logistique lors d''un pic de saisonnalité',
  'optimiser-logistique-saisonnalite',
  'Lorsqu''un pic de saisonnalité survient, la gestion de la logistique devient un défi majeur. Découvrez nos stratégies d''optimisation.',
  '<p>Une gestion efficace de la logistique pendant les périodes de forte activité est essentielle pour maintenir la satisfaction client et la rentabilité.</p><h2>Stratégies d''optimisation</h2><p>Optimisez vos flux en réorganisant votre entrepôt.</p>',
  '/images/random-images/Gemini_Generated_Image_25w09h25w09h25w0.webp',
  true,
  '2024-01-05'::timestamp,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "BlogPost" WHERE slug = 'optimiser-logistique-saisonnalite');

INSERT INTO "BlogPost" ("id", "title", "slug", "excerpt", "content", "image", "published", "createdAt", "updatedAt")
SELECT 
  'blog_seed_4_' || substr(md5(random()::text), 1, 12),
  'Chariots électriques vs thermiques : lequel choisir pour votre entrepôt ?',
  'chariots-electriques-vs-thermiques',
  'Comparaison des chariots électriques et thermiques pour vous aider à faire le bon choix selon vos contraintes d''utilisation.',
  '<p>Le choix entre un chariot électrique et un chariot thermique dépend de nombreux facteurs : utilisation intérieure ou extérieure, durée de travail quotidienne, budget.</p><h2>Chariots électriques</h2><p>Idéaux pour les espaces fermés, silencieux, sans émission directe.</p>',
  '/images/random-images/Gemini_Generated_Image_8j8nlm8j8nlm8j8n.webp',
  true,
  '2024-01-02'::timestamp,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "BlogPost" WHERE slug = 'chariots-electriques-vs-thermiques');

INSERT INTO "BlogPost" ("id", "title", "slug", "excerpt", "content", "image", "published", "createdAt", "updatedAt")
SELECT 
  'blog_seed_5_' || substr(md5(random()::text), 1, 12),
  'Les avantages du reconditionnement de chariots élévateurs',
  'avantages-reconditionnement-chariots',
  'Découvrez pourquoi le reconditionnement de vos chariots peut vous faire économiser tout en garantissant des performances optimales.',
  '<p>Le reconditionnement professionnel prolonge la durée de vie de vos équipements tout en réduisant vos coûts d''investissement.</p><h2>Économies substantielles</h2><p>Un chariot reconditionné coûte jusqu''à 50 % moins cher qu''un neuf.</p>',
  '/images/random-images/Gemini_Generated_Image_94i3jy94i3jy94i3.webp',
  true,
  '2023-12-28'::timestamp,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "BlogPost" WHERE slug = 'avantages-reconditionnement-chariots');

INSERT INTO "BlogPost" ("id", "title", "slug", "excerpt", "content", "image", "published", "createdAt", "updatedAt")
SELECT 
  'blog_seed_6_' || substr(md5(random()::text), 1, 12),
  'Sécurité en entrepôt : les bonnes pratiques de manutention',
  'securite-entrepot-bonnes-pratiques',
  'La sécurité en entrepôt passe par des équipements adaptés et des formations régulières. Voici nos recommandations.',
  '<p>La manutention en entrepôt présente des risques qu''il convient de maîtriser par une combinaison d''équipements conformes et de formations du personnel.</p><h2>Équipements</h2><p>Vérifiez régulièrement l''état de vos chariots et transpalettes.</p>',
  '/images/random-images/Gemini_Generated_Image_9gg7mn9gg7mn9gg7.webp',
  true,
  '2023-12-20'::timestamp,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "BlogPost" WHERE slug = 'securite-entrepot-bonnes-pratiques');


-- ------------------------------------------------------------
-- DONE. Verify with:
-- SELECT * FROM "RentalRequest" LIMIT 1;
-- SELECT * FROM "Category" WHERE type = 'chariots';
-- SELECT * FROM "BlogPost";
-- ------------------------------------------------------------
