'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  type: string
  parentId: string | null
  children?: Category[]
}

interface Product {
  id: string
  name: string
  slug: string
  image: string | null
  description: string
  category?: { id: string; name: string; parent?: { name: string } | null }
  categoryId?: string
  sold?: boolean
}

interface ProductFilterProps {
  categories: Category[]
  products: Product[]
  onFilterChange: (filteredProducts: Product[]) => void
}

export function ProductFilter({ categories, products, onFilterChange }: ProductFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Get all categories (flattened for filter dropdown)
  const allCategories = categories.flatMap(cat => [
    cat,
    ...(cat.children || [])
  ])

  // Filter products based on selected category and type
  const filterProducts = (categoryId: string, type: string) => {
    let filtered = [...products]

    // Filter by type
    if (type !== 'all') {
      filtered = filtered.filter(p => {
        const productCategoryId = (typeof (p as { category?: { id?: string }; categoryId?: string }).category === 'object' ? (p as { category?: { id?: string } }).category?.id : undefined) || (p as { categoryId?: string }).categoryId
        const productCategory = categories.find(c => 
          c.id === productCategoryId || 
          c.children?.some(child => child.id === productCategoryId)
        )
        return productCategory?.type === type
      })
    }

    // Filter by category
    if (categoryId !== 'all') {
      filtered = filtered.filter(p => {
        const productCategoryId = (typeof (p as { category?: { id?: string }; categoryId?: string }).category === 'object' ? (p as { category?: { id?: string } }).category?.id : undefined) || (p as { categoryId?: string }).categoryId
        return productCategoryId === categoryId || 
               categories.find(c => c.id === categoryId)?.children?.some(child => child.id === productCategoryId)
      })
    }

    onFilterChange(filtered)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    filterProducts(categoryId, selectedType)
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setSelectedCategory('all') // Reset category when type changes
    filterProducts('all', type)
  }

  // Get categories for the selected type
  const typeCategories = selectedType === 'all' 
    ? allCategories 
    : allCategories.filter(cat => {
        const category = categories.find(c => c.id === cat.id || c.children?.some(child => child.id === cat.id))
        return category?.type === selectedType
      })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filtrer par type
          </label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="chariots">Chariots</option>
            <option value="pieces">Pièces de rechange</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filtrer par catégorie
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            disabled={selectedType === 'all' && typeCategories.length === 0}
          >
            <option value="all">Toutes les catégories</option>
            {typeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.parentId ? '  └─ ' : ''}{category.name}
              </option>
            ))}
          </select>
        </div>

        {(selectedCategory !== 'all' || selectedType !== 'all') && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedType('all')
                onFilterChange(products)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
