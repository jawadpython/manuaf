-- Seed default devis form fields (run after migration)
-- Type, Heures, Capacité for chariots de location/occasion

-- Run after migration. Use ON CONFLICT only if unique on key exists.
INSERT INTO "DevisFormField" ("id", "key", "label", "type", "required", "sortOrder", "showFor", "placeholder", "active", "createdAt", "updatedAt")
SELECT 'seed1', 'chariotType', 'Type', 'text', false, 1, 'chariots-location', 'Ex: Frontal, Rétractable...', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "DevisFormField" WHERE "key" = 'chariotType');
INSERT INTO "DevisFormField" ("id", "key", "label", "type", "required", "sortOrder", "showFor", "placeholder", "active", "createdAt", "updatedAt")
SELECT 'seed2', 'heures', 'Heures', 'text', false, 2, 'chariots-location', 'Ex: 1500 h, 2000 h...', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "DevisFormField" WHERE "key" = 'heures');
INSERT INTO "DevisFormField" ("id", "key", "label", "type", "required", "sortOrder", "showFor", "placeholder", "active", "createdAt", "updatedAt")
SELECT 'seed3', 'capacite', 'Capacité (kg)', 'text', false, 3, 'chariots-location', 'Ex: 2500, 3000...', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "DevisFormField" WHERE "key" = 'capacite');
