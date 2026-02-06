/**
 * Migration script to convert string-based categories to relational Category model
 * 
 * Run this after updating the schema:
 * npx tsx prisma/migrate-categories.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateCategories() {
  console.log('🔄 Starting category migration...')

  try {
    // Step 1: Get all unique categories from existing products
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    })

    const uniqueCategories = products.map(p => p.category).filter(Boolean)
    console.log(`📦 Found ${uniqueCategories.length} unique categories:`, uniqueCategories)

    // Step 2: Create Category records for each unique category
    const categoryMap = new Map<string, string>() // old category name -> new category id

    for (const categoryName of uniqueCategories) {
      const slug = categoryName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const category = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: categoryName,
          slug,
          published: true,
        },
      })

      categoryMap.set(categoryName, category.id)
      console.log(`✅ Created category: ${categoryName} (${category.id})`)
    }

    // Step 3: Update all products to use categoryId
    const allProducts = await prisma.product.findMany()

    for (const product of allProducts) {
      const categoryId = categoryMap.get(product.category)
      if (categoryId) {
        await prisma.product.update({
          where: { id: product.id },
          data: { categoryId },
        })
        console.log(`✅ Updated product: ${product.name}`)
      } else {
        console.warn(`⚠️  No category found for product: ${product.name} (category: ${product.category})`)
      }
    }

    console.log('✅ Migration completed successfully!')
    console.log(`📊 Created ${categoryMap.size} categories`)
    console.log(`📊 Updated ${allProducts.length} products`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateCategories()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
