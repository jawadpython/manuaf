'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  type: string
  parentId: string | null
  published?: boolean
  children?: Category[]
}

interface Product {
  id: string
  name: string
  slug: string
  image: string | null
  description: string
  category?: { id: string; name: string; slug?: string; type?: string; parent?: { name: string } | null } | string
  categoryId?: string
  sold?: boolean
}

interface ProductsListProps {
  initialProducts: Product[]
  categories: Category[]
  defaultType?: string // Optional: 'chariots' | 'pieces' | 'all'
  hideTypeFilter?: boolean // Hide type filter when on a specific type page
}

export function ProductsList({ initialProducts, categories, defaultType = 'all', hideTypeFilter = false }: ProductsListProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>(defaultType)

  // Get all categories (flattened for filter dropdown)
  const allCategories = categories.flatMap(cat => [
    cat,
    ...(cat.children || [])
  ])

  // Filter products based on selected category and type
  useEffect(() => {
    let filtered = [...initialProducts]

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => {
        const productCategory = typeof p.category === 'object' ? p.category : null
        if (!productCategory || !productCategory.id) {
          // Try to get category from categoryId
          const productCategoryId = p.categoryId
          if (!productCategoryId) return false
          const cat = categories.find(c => c.id === productCategoryId)
          return cat?.type === selectedType
        }
        
        const cat = categories.find(c => 
          c.id === productCategory.id || 
          c.children?.some(child => child.id === productCategory.id)
        )
        return cat?.type === selectedType
      })
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => {
        const productCategory = typeof p.category === 'object' ? p.category : null
        const productCategoryId = productCategory?.id || p.categoryId
        if (!productCategoryId) return false
        
        const selectedCat = categories.find(c => c.id === selectedCategory)
        if (!selectedCat) return false
        
        return productCategoryId === selectedCategory || 
               selectedCat.children?.some(child => child.id === productCategoryId)
      })
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, selectedType, initialProducts, categories])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setSelectedCategory('all') // Reset category when type changes
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedType('all')
  }

  // Get categories for the selected type
  const typeCategories = selectedType === 'all' 
    ? allCategories 
    : allCategories.filter(cat => {
        const category = categories.find(c => c.id === cat.id || c.children?.some(child => child.id === cat.id))
        return category?.type === selectedType
      })

  // Helper to get category name
  const getCategoryName = (product: Product): string => {
    if (typeof product.category === 'object' && product.category) {
      return product.category.name
    }
    if (typeof product.category === 'string') {
      return product.category
    }
    return 'Non catégorisé'
  }

  // Build category tree for sidebar
  const buildCategoryTree = (cats: Category[]): Category[] => {
    const map = new Map<string, Category>()
    const roots: Category[] = []

    cats.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] })
    })

    cats.forEach((cat) => {
      const node = map.get(cat.id)!
      if (cat.parentId && map.has(cat.parentId)) {
        const parent = map.get(cat.parentId)!
        if (!parent.children) parent.children = []
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots.sort((a, b) => {
      // Filter by selected type
      if (selectedType !== 'all') {
        if (a.type === selectedType && b.type !== selectedType) return -1
        if (a.type !== selectedType && b.type === selectedType) return 1
      }
      return 0
    })
  }

  const categoryTree = buildCategoryTree(categories.filter(c => c.published))

  const renderCategoryMenuItem = (category: Category, level: number = 0) => {
    // Filter by type if selected
    if (selectedType !== 'all' && category.type !== selectedType) {
      return null
    }

    const isSelected = selectedCategory === category.id
    const hasChildren = category.children && category.children.length > 0

    return (
      <div key={category.id}>
        <button
          type="button"
          onClick={() => handleCategoryChange(category.id)}
          className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
            isSelected
              ? 'bg-[var(--accent)] text-white font-semibold'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--accent)]'
          }`}
          style={{ paddingLeft: `${12 + level * 20}px` }}
        >
          {level > 0 && <span className="mr-2">└─</span>}
          {category.name}
        </button>
        {hasChildren && (
          <div className="ml-4">
            {category.children!.map((child) => renderCategoryMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar Menu */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-5 lg:sticky lg:top-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[var(--accent)]">Filtres</h3>
            
            {/* Type Filter - Hidden when hideTypeFilter is true */}
            {!hideTypeFilter && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm"
                >
                  <option value="all">Tous les types</option>
                  <option value="chariots">Chariots</option>
                  <option value="pieces">Pièces de rechange</option>
                </select>
              </div>
            )}

            {/* Category Menu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégories
              </label>
              <div className="space-y-1 max-h-[400px] overflow-y-auto border border-gray-100 rounded-lg p-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[var(--accent)] text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--accent)]'
                  }`}
                >
                  Toutes les catégories
                </button>
                {categoryTree.length > 0 ? (
                  categoryTree.map((category) => renderCategoryMenuItem(category))
                ) : (
                  <p className="text-gray-500 text-xs px-4 py-2">Aucune catégorie disponible</p>
                )}
              </div>
            </div>

            {/* Reset Button */}
            {(selectedCategory !== 'all' || selectedType !== 'all') && (
              <button
                onClick={resetFilters}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Réinitialiser
              </button>
            )}

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produit' : 'produits'}
                {(selectedCategory !== 'all' || selectedType !== 'all') && (
                  <span className="block mt-1 text-[var(--accent)]">
                    sur {initialProducts.length} au total
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg mb-2">Aucun produit trouvé</p>
            <p className="text-gray-500 text-sm">
              Essayez de modifier vos filtres ou{' '}
              <button
                onClick={resetFilters}
                className="text-[var(--accent)] hover:underline font-medium"
              >
                réinitialiser les filtres
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const categoryName = typeof product.category === 'object' && product.category
    ? product.category.name
    : typeof product.category === 'string'
    ? product.category
    : 'Non catégorisé'
  
  const isSold = product.sold || false

  return (
    <Link
      href={`/produits/${product.slug}`}
      className={`group block bg-white overflow-hidden transition-shadow duration-300 hover:shadow-xl ${isSold ? 'opacity-75' : ''}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        <Image
          src={product.image || '/images/products/chr5-min-276x300.jpg'}
          alt={product.name}
          fill
          className="object-contain p-3 sm:p-4 md:p-6 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized={product.image?.startsWith('http') || product.image?.startsWith('/uploads')}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/10 transition-all duration-300"></div>
        {/* Category Badge */}
        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 bg-[var(--accent)] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          {categoryName}
        </span>
        {/* Sold Badge */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white text-xl font-bold uppercase tracking-widest bg-red-600 px-6 py-2 rotate-[-15deg]">
              VENDU
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 border-t-4 border-[var(--accent)]">
        <h3 className="text-[#333333] text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 group-hover:text-[var(--accent)] transition-colors duration-200 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[#666666] text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
          {product.description}
        </p>
        <span className="inline-flex items-center gap-1 sm:gap-2 text-[var(--accent)] text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-200">
          En savoir plus
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
