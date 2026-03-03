# Utiliser uniquement Supabase pour tout le stockage

Ce document explique comment centraliser vos données sur **Supabase uniquement**, afin d’éviter Vercel Blob, Cloudinary, Resend, etc.

---

## Vue d’ensemble

| Composant     | Actuellement                         | Avec Supabase uniquement           |
|---------------|--------------------------------------|-------------------------------------|
| **Base de données** | Supabase (Prisma) ✓                 | Inchangé                            |
| **Images**    | Vercel Blob / Cloudinary             | **Supabase Storage**                |
| **Authentification admin** | NextAuth + credentials        | Optionnel : Supabase Auth           |
| **E-mails**   | Resend (optionnel)                   | Non disponible nativement (voir § E-mails) |

---

## 1. Stockage des images (Supabase Storage)

Supabase Storage remplace Vercel Blob et Cloudinary pour toutes les images (produits, chariots, catégories, services, blog).

### Configuration Supabase

1. **Supabase Dashboard** → **Storage**
2. **New bucket** → nom : `uploads`
3. Activer **Public bucket** (lecture publique pour afficher les images)
4. Ou garder privé et utiliser des URLs signées (plus complexe)

### Variables d’environnement

Ajoutez dans Vercel et `.env` local :

```env
# Supabase – déjà configuré pour la base
SUPABASE_URL="https://VOTRE_PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # Service Role (secret)
```

- **SUPABASE_URL** : Settings → API → Project URL  
- **SUPABASE_SERVICE_ROLE_KEY** : Settings → API → service_role (secret) — ne jamais exposer côté client.

### Règles de sécurité (RLS)

Dans **Storage** → **Policies** pour le bucket `uploads` :

- **SELECT (lecture)** : autoriser tout le monde pour les images publiques.
- **INSERT** : autoriser uniquement les requêtes authentifiées ou utilisant la clé service_role (côté serveur).
- **DELETE** : idem, côté serveur avec la clé service_role.

Exemple de politique pour lecture publique :

```sql
-- Lecture publique des fichiers
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');
```

Pour l’upload, on passe par une API route côté serveur qui utilise `SUPABASE_SERVICE_ROLE_KEY`, donc les règles RLS côté client ne s’appliquent pas.

### Modification du code d’upload

L’API `/api/admin/upload` doit utiliser Supabase Storage au lieu de Vercel Blob / Cloudinary.

Priorité proposée :

1. **Supabase Storage** (si configuré)
2. Cloudinary (si configuré)
3. Vercel Blob (si configuré)
4. Stockage local (uniquement en développement)

Le package `@supabase/supabase-js` sera nécessaire.

---

## 2. Base de données

Déjà gérée par Supabase via Prisma. Aucun changement nécessaire si la configuration actuelle fonctionne.

Rappel : `DATABASE_URL` avec `?pgbouncer=true` pour le pool Transaction mode.

---

## 3. Authentification admin (optionnel)

Actuellement : NextAuth avec email/mot de passe en `.env`.

### Option A : Garder NextAuth (recommandé pour l’instant)

- Pas de migration
- Moins de travail
- Compatible avec l’existant

### Option B : Migrer vers Supabase Auth

- Créer un utilisateur admin dans Supabase Auth
- Adapter le middleware et les pages admin pour utiliser Supabase Auth
- Supprimer NextAuth

Avantage : une seule plateforme (Supabase) pour auth + DB + storage.  
Inconvénient : refactorisation de l’auth admin.

---

## 4. E-mails (limitations Supabase)

Supabase ne fournit pas d’envoi d’e-mails transactionnels (formulaires de contact, devis, demandes de location).

### Ce que propose Supabase

- E-mails d’authentification (confirmation, reset mot de passe) si vous utilisez Supabase Auth.

### Pour les e-mails métier

- **Resend**, **SendGrid**, **Amazon SES**, etc. restent nécessaires.
- Alternative : **Supabase Edge Functions** + un fournisseur d’e-mails (Resend, etc.).

Conclusion : l’e-mail ne peut pas être entièrement géré par Supabase sans service tiers.

---

## 5. Récapitulatif : ce qui peut être centralisé sur Supabase

| Composant | Centralisable sur Supabase ? | Action recommandée |
|-----------|-----------------------------|----------------------|
| Base de données | ✓ Déjà | Aucune |
| Images / fichiers | ✓ Oui | Migrer vers Supabase Storage |
| Auth admin | ✓ Possible | Optionnel : migrer vers Supabase Auth |
| E-mails (contact, devis, location) | ✗ Non natif | Garder Resend ou équivalent |

---

## 6. Variables d’environnement minimales (tout Supabase sauf e-mails)

```env
# Supabase
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://..."
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # Pour upload images côté serveur

# NextAuth (ou supprimer si migration Supabase Auth)
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://votre-app.vercel.app"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="..."

# E-mails (si notifications contact/location)
RESEND_API_KEY="re_..."   # Indispensable pour envoi d’e-mails
EMAIL_FROM="noreply@votredomaine.com"
```

---

## 7. Prochaines étapes pour migrer les images vers Supabase Storage

1. Créer le bucket `uploads` dans Supabase Storage.
2. Ajouter `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans Vercel.
3. Adapter `/api/admin/upload` pour utiliser Supabase Storage en priorité.
4. Tester l’upload depuis l’admin (produits, chariots, catégories).
5. (Optionnel) Migrer l’auth admin vers Supabase Auth.

Si vous le souhaitez, je peux proposer les modifications exactes pour l’API d’upload afin qu’elle utilise Supabase Storage en priorité.
