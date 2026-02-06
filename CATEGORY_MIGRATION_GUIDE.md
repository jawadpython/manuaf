# Category Migration Guide

## 📋 Overview

This guide explains the refactoring from string-based categories to a hierarchical relational Category model.

## ✅ What Was Changed

### 1. Database Schema (`prisma/schema.prisma`)

**Before:**
```prisma
model Product {
  category String  // Simple string field
}
```

**After:**
```prisma
model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  parentId    String?
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  order       Int        @default(0)
  published   Boolean    @default(true)
  // ... timestamps
}

model Product {
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  // ... other fields
}
```

### 2. API Routes

**New Routes:**
- `GET /api/admin/categories` - List all categories (admin)
- `POST /api/admin/categories` - Create category (admin)
- `PUT /api/admin/categories/[id]` - Update category (admin)
- `DELETE /api/admin/categories/[id]` - Delete category (admin)
- `GET /api/categories` - Public categories API

**Updated Routes:**
- Product API now uses `categoryId` instead of `category` string
- Products include category relation in responses

### 3. Admin Components

**New:**
- `CategoryManager` - Full CRUD for categories
- `CategoryForm` - Form with parent selection
- `/admin/categories` page

**Updated:**
- `ProductForm` - Now uses category dropdown from DB
- `ProductsManager` - Displays category hierarchy

### 4. Data Functions (`src/lib/data.ts`)

**New Functions:**
- `getAllCategories()` - Get all published categories with hierarchy
- `getCategoryBySlug(slug)` - Get category with products
- `getProductsByCategory(categorySlug)` - Filter products by category

**Updated Functions:**
- All product functions now include category relation
- Backward compatibility: products still have `category` string field for fallback

### 5. Public Pages

**Updated:**
- `/produits` - Now displays products grouped by category hierarchy
- Product cards show category name from relation
- Filtering by category/subcategory works automatically

## 🔄 Migration Steps

### Step 1: Update Database Schema

```bash
# Stop your dev server first (Ctrl+C)

# Push the new schema (this will fail if you have existing data)
npx prisma db push
```

**⚠️ Important:** If you have existing products with string categories, you need to migrate them first.

### Step 2: Run Migration Script

The migration script (`prisma/migrate-categories.ts`) will:
1. Extract unique category names from existing products
2. Create Category records for each unique category
3. Update all products to use `categoryId` foreign key

**Run the migration:**
```bash
# Install tsx if not already installed
npm install -D tsx

# Run migration script
npx tsx prisma/migrate-categories.ts
```

**OR manually migrate:**
1. Go to `/admin/categories`
2. Create categories matching your existing product categories
3. Edit each product and assign it to the correct category

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Restart Server

```bash
npm run dev
```

## ⚠️ Breaking Changes

### 1. Product Model Change
- **Before:** `product.category` was a string
- **After:** `product.categoryId` is a foreign key, `product.category` is a relation object
- **Impact:** Product API now requires `categoryId` instead of `category` string
- **Migration:** Run migration script or manually update products

### 2. Product Form Change
- **Before:** Text input for category
- **After:** Dropdown selecting from database categories
- **Impact:** Cannot create products without existing categories
- **Solution:** Create categories first in `/admin/categories`

### 3. Public Pages
- **Before:** Hardcoded category filtering (`p.category === 'Électrique'`)
- **After:** Dynamic filtering based on category hierarchy
- **Impact:** Products are now grouped by database categories
- **Migration:** Categories are automatically used if they exist

### 4. API Response Format
- **Before:** `{ category: "Électrique" }`
- **After:** `{ categoryId: "xxx", category: { id: "xxx", name: "Électrique", ... } }`
- **Impact:** Frontend code expecting string category needs updates
- **Solution:** Backward compatibility layer in `lib/data.ts` adds `category` string field

## 🛡️ Backward Compatibility

The refactoring includes backward compatibility:

1. **Data Layer:** `getAllProducts()` returns products with both:
   - `categoryId` (new)
   - `category` (string, for backward compatibility)

2. **Fallback Data:** If database is unavailable, fallback products still work

3. **Gradual Migration:** You can migrate products one by one through admin panel

## 📝 Example Category Structure

```
Chariots (parent)
  ├── Électrique (child)
  │   ├── Chariots frontaux
  │   └── Transpalettes
  └── Thermique (child)
      ├── Diesel
      └── GPL

Pièces de rechange (parent)
  ├── Batteries (child)
  ├── Accessoires (child)
  └── Commandes (child)
```

## 🎯 Best Practices Implemented

✅ **No Hardcoded Categories** - All categories come from database  
✅ **No Direct DB Access** - All access through API routes or server components  
✅ **Clean Relations** - Proper Prisma relations with cascade delete  
✅ **SEO-Friendly Slugs** - Auto-generated slugs for categories  
✅ **Hierarchical Support** - Parent-child relationships (max 2 levels)  
✅ **Published/Draft** - Categories can be hidden from public  
✅ **Validation** - Prevents circular references and deep nesting  

## 🔍 Verification Checklist

After migration, verify:

- [ ] Categories page loads at `/admin/categories`
- [ ] Can create root categories (no parent)
- [ ] Can create subcategories (with parent)
- [ ] Product form shows category dropdown
- [ ] Products display with correct categories
- [ ] Public products page groups by category
- [ ] Category filtering works on subcategory pages

## 🆘 Troubleshooting

### "Category model not found"
- Run: `npx prisma generate`
- Restart dev server

### "Foreign key constraint fails"
- Make sure categories exist before assigning to products
- Run migration script to create categories from existing products

### "Products show 'Non catégorisé'"
- Products need to be assigned to categories
- Edit products in admin and select a category

### "Cannot delete category with products"
- This is by design (data integrity)
- Reassign products to other categories first
- Or delete products, then delete category

## 📚 Next Steps

1. **Create Categories:** Go to `/admin/categories` and create your category structure
2. **Assign Products:** Edit products and assign them to categories
3. **Organize Hierarchy:** Create parent categories and subcategories as needed
4. **Test Public Pages:** Verify products display correctly grouped by category

---

**Need Help?** Check the code comments in:
- `prisma/schema.prisma` - Schema definition
- `src/lib/data.ts` - Data fetching functions
- `src/app/api/admin/categories/` - API implementation
