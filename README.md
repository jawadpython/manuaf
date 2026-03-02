# Logistec — Site Intralogistique Premium

Site web moderne pour une entreprise d'intralogistique et de manutention, développé avec Next.js 16 et TypeScript.

## 🚀 Technologies

- **Next.js 16** (App Router) - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling
- **Prisma** - ORM pour PostgreSQL
- **NextAuth.js** - Authentification
- **Vercel Blob** / **Cloudinary** - Stockage d'images

## 📋 Prérequis

- Node.js 18+ et npm
- PostgreSQL (Supabase, Neon, ou Vercel Postgres)
- Compte Vercel (pour le déploiement)

## 🛠️ Installation locale

1. **Cloner le repository**

```bash
git clone <your-repo-url>
cd logistec2
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Copier `env.example.txt` vers `.env` et remplir les valeurs :

```bash
cp env.example.txt .env
```

Éditer `.env` avec vos valeurs :

```env
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="generate-a-random-secret-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

**Générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

4. **Configurer la base de données**

**Options de base de données PostgreSQL (gratuites) :**
- [Neon](https://neon.tech) — Postgres serverless
- [Vercel Postgres](https://vercel.com/storage/postgres) — via le dashboard Vercel
- [Supabase](https://supabase.com) — Postgres hébergé

**Initialiser le schéma :**

```bash
npx prisma db push
npx prisma generate
```

5. **Lancer le serveur de développement**

```bash
npm run dev
```

(Le script `dev` utilise `--webpack` pour éviter une erreur de résolution Tailwind lorsque le projet est dans un dossier parent. Pour utiliser Turbopack : `npm run dev:turbo`.)

Le site sera accessible sur :
- **Site public** : http://localhost:3000
- **Admin panel** : http://localhost:3000/admin
- **Connexion admin** : Utilisez les identifiants définis dans `.env`

## 🚀 Déploiement sur Vercel

### Étape 1 : Préparer le repository

1. Créer un nouveau repository sur GitHub
2. Pousser votre code :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Importer votre repository GitHub
3. Vercel détecte automatiquement Next.js — aucune configuration supplémentaire requise
4. Cliquer sur **Deploy**

### Étape 3 : Configurer les variables d'environnement

Dans **Vercel Dashboard** > **Settings** > **Environment Variables**, ajouter :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL Postgres (pooled) | `postgresql://...` |
| `DIRECT_URL` | URL Postgres directe (migrations) | `postgresql://...` |
| `NEXTAUTH_SECRET` | Secret aléatoire (32+ caractères) | Généré avec `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL du site en production | `https://your-domain.vercel.app` |
| `ADMIN_EMAIL` | Email de connexion admin | `admin@example.com` |
| `ADMIN_PASSWORD` | Mot de passe admin sécurisé | `your-secure-password` |
| `BLOB_READ_WRITE_TOKEN` | (Optionnel) Token Vercel Blob | Auto-généré si vous utilisez Blob |

### Étape 4 : Configurer la base de données

**Option A : Vercel Postgres (Recommandé)**
1. Dans **Vercel Dashboard** > **Storage** > **Create Database** > **Postgres**
2. Les variables `DATABASE_URL` et `DIRECT_URL` sont injectées automatiquement

**Option B : Base de données externe**
- Utiliser Supabase, Neon, ou autre fournisseur PostgreSQL
- Ajouter manuellement `DATABASE_URL` et `DIRECT_URL` dans les variables d'environnement

### Étape 5 : Configurer le stockage d'images (Optionnel)

**Option A : Vercel Blob (Recommandé)**
1. Dans **Vercel Dashboard** > **Storage** > **Create Database** > **Blob**
2. Le token `BLOB_READ_WRITE_TOKEN` est ajouté automatiquement

**Option B : Cloudinary**
- Créer un compte sur [Cloudinary](https://cloudinary.com)
- Ajouter `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Étape 6 : Exécuter les migrations

Après le premier déploiement, exécuter le schéma Prisma :

**Option A : Via Vercel CLI**
```bash
npx vercel env pull .env.local
npx prisma db push
```

**Option B : Via Vercel Dashboard**
1. Aller dans **Storage** > votre base de données > **Query**
2. Exécuter le schéma Prisma manuellement

### Étape 7 : Mettre à jour NEXTAUTH_URL

Une fois le domaine personnalisé configuré, mettre à jour `NEXTAUTH_URL` dans les variables d'environnement avec votre URL finale.

## 📁 Structure du projet

```
logistec2/
├── src/
│   ├── app/              # Pages et routes (App Router)
│   │   ├── admin/        # Pages d'administration
│   │   ├── produits/     # Pages produits publics
│   │   └── api/          # API routes
│   ├── components/       # Composants React réutilisables
│   │   ├── admin/        # Composants admin
│   │   ├── layout/       # Header, Footer, Navigation
│   │   └── products/     # Composants produits
│   ├── lib/              # Utilitaires
│   │   ├── auth.ts       # Configuration NextAuth
│   │   ├── prisma.ts     # Client Prisma
│   │   └── data.ts       # Fonctions de récupération de données
│   └── types/            # Types TypeScript
├── prisma/
│   └── schema.prisma     # Schéma de base de données
├── public/               # Fichiers statiques
└── .env                  # Variables d'environnement (non commité)
```

## 🎯 Fonctionnalités

- ✅ Gestion de produits (Chariots et Pièces de rechange)
- ✅ Système de catégories hiérarchique
- ✅ Blog intégré
- ✅ Panel d'administration sécurisé
- ✅ Upload d'images (Vercel Blob / Cloudinary)
- ✅ Design responsive et moderne
- ✅ Filtrage par catégories
- ✅ Statut "Vendu" pour les chariots

## 🔒 Sécurité

- Authentification via NextAuth.js
- Variables d'environnement pour les secrets
- Protection des routes admin
- Validation des données côté serveur

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter ESLint
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 🆘 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.

---

**Développé avec ❤️ en utilisant Next.js et TypeScript**
