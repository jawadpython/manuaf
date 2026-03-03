'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  type: string
  parentId: string | null
  published?: boolean
  order?: number
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

/** Collect category id and all descendant ids recursively */
function getAllDescendantIds(categories: Category[], categoryId: string): Set<string> {
  const ids = new Set<string>([categoryId])
  const addDescendants = (parentId: string) => {
    categories.forEach((c) => {
      if (c.parentId === parentId) {
        ids.add(c.id)
        addDescendants(c.id)
      }
    })
  }
  addDescendants(categoryId)
  return ids
}

interface ProductsListProps {
  initialProducts: Product[]
  categories: Category[]
  defaultType?: string // Optional: 'chariots' | 'pieces' | 'all'
  defaultCategory?: string // Optional: category id to preselect (e.g. from ?category=slug)
  hideTypeFilter?: boolean // Hide type filter when on a specific type page
  hideCategoryFilter?: boolean // Hide category filter when on a specific category page
}

export function ProductsList({ initialProducts, categories, defaultType = 'all', defaultCategory, hideTypeFilter = false, hideCategoryFilter = false }: ProductsListProps) {
  // Validate defaultCategory exists in categories
  const validDefaultCategory = defaultCategory && categories.some((c) => c.id === defaultCategory)
    ? defaultCategory
    : 'all'
  const [selectedCategory, setSelectedCategory] = useState<string>(validDefaultCategory)

  // Sync when defaultCategory changes (e.g. URL ?category= changes)
  useEffect(() => {
    setSelectedCategory(validDefaultCategory)
  }, [validDefaultCategory])
  const [selectedType, setSelectedType] = useState<string>(defaultType)

  // Categories filtered by selected type (for tree and product filtering)
  const categoriesForType = useMemo(() => {
    if (selectedType === 'all') return categories.filter((c) => c.published)
    return categories.filter((c) => c.published && c.type === selectedType)
  }, [categories, selectedType])

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts]

    if (selectedType !== 'all') {
      filtered = filtered.filter((p) => {
        const productCategory = typeof p.category === 'object' ? p.category : null
        const productCategoryId = productCategory?.id ?? p.categoryId
        if (!productCategoryId) return false
        const cat = categories.find((c) => c.id === productCategoryId)
        return cat?.type === selectedType
      })
    }

    if (selectedCategory !== 'all') {
      const allowedIds = getAllDescendantIds(categories, selectedCategory)
      filtered = filtered.filter((p) => {
        const productCategoryId =
          (typeof p.category === 'object' && p.category?.id) || p.categoryId
        return productCategoryId && allowedIds.has(productCategoryId)
      })
    }

    return filtered
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
    setSelectedType(hideTypeFilter ? defaultType : 'all')
  }

  // Build category tree for sidebar (only categories of selected type)
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

    const sortNodes = (nodes: Category[]) =>
      nodes.sort((a, b) => {
        const orderA = a.order ?? 0
        const orderB = b.order ?? 0
        if (orderA !== orderB) return orderA - orderB
        return (a.name || '').localeCompare(b.name || '')
      })
    const sortTree = (nodes: Category[]) => {
      sortNodes(nodes)
      nodes.forEach((n) => n.children?.length && sortTree(n.children))
    }
    sortTree(roots)
    return roots
  }

  const categoryTree = buildCategoryTree(categoriesForType)

  /** Product count per category (includes descendants) */
  const categoryProductCount = useMemo(() => {
    const counts = new Map<string, number>()
    const countFor = (catId: string) => {
      if (counts.has(catId)) return counts.get(catId)!
      const ids = getAllDescendantIds(categories, catId)
      const count = initialProducts.filter((p) => {
        const pcid = (typeof p.category === 'object' && p.category?.id) || p.categoryId
        return pcid && ids.has(pcid)
      }).length
      counts.set(catId, count)
      return count
    }
    categoriesForType.forEach((c) => countFor(c.id))
    return counts
  }, [categories, categoriesForType, initialProducts])

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [expandedSubcategoryIds, setExpandedSubcategoryIds] = useState<Set<string>>(new Set())

  /** Auto-expand path to selected category when defaultCategory changes */
  useEffect(() => {
    if (validDefaultCategory === 'all') return
    const idsToExpand = new Set<string>()
    const result = { parent: null as Category | null }
    const findPath = (nodes: Category[], targetId: string, path: string[]): boolean => {
      for (const n of nodes) {
        if (n.id === targetId) {
          path.forEach((id) => idsToExpand.add(id))
          return true
        }
        const kids = n.children ?? []
        if (kids.length > 0 && findPath(kids, targetId, [...path, n.id])) {
          result.parent = n
          return true
        }
      }
      return false
    }
    findPath(categoryTree, validDefaultCategory, [])
    setExpandedIds((prev) => new Set([...prev, ...idsToExpand]))
    const p = result.parent
    if (p && (p.children ?? []).length > VISIBLE_SUBCATS) {
      setExpandedSubcategoryIds((prev) => new Set([...prev, p.id]))
    }
  }, [validDefaultCategory, categoryTree])

  const getPathToCategory = (targetId: string, nodes: Category[], path: string[] = []): string[] | null => {
    for (const n of nodes) {
      if (n.id === targetId) return path
      const kids = n.children || []
      const found = getPathToCategory(targetId, kids, [...path, n.id])
      if (found) return found
    }
    return null
  }

  const toggleExpand = (id: string, isCurrentlyExpanded: boolean) => {
    setExpandedIds((prev) => {
      if (isCurrentlyExpanded) {
        const next = new Set(prev)
        next.delete(id)
        return next
      }
      const path = getPathToCategory(id, categoryTree) || []
      return new Set([...path, id])
    })
  }

  const collapseAll = () => setExpandedIds(new Set())

  const toggleShowAllSubcategories = (id: string) => {
    setExpandedSubcategoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const VISIBLE_SUBCATS = 5

  const renderCategoryTreeNode = (category: Category, level: number = 0) => {
    const isSelected = selectedCategory === category.id
    const children = category.children || []
    const hasChildren = children.length > 0
    const isExpanded = expandedIds.has(category.id)
    const showAllSubcats = expandedSubcategoryIds.has(category.id)
    const visibleChildren = hasChildren && children.length > VISIBLE_SUBCATS && !showAllSubcats
      ? children.slice(0, VISIBLE_SUBCATS)
      : children
    const hasMoreSubcats = hasChildren && children.length > VISIBLE_SUBCATS && !showAllSubcats
    const count = categoryProductCount.get(category.id) ?? 0

    return (
      <div key={category.id} className="min-w-0">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            handleCategoryChange(category.id)
            if (hasChildren) {
              toggleExpand(category.id, isExpanded)
            } else {
              const path = getPathToCategory(category.id, categoryTree) || []
              const isUnderExpandedBranch = path.some((pid) => expandedIds.has(pid))
              if (!isUnderExpandedBranch) collapseAll()
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCategoryChange(category.id)
              if (hasChildren) {
                toggleExpand(category.id, isExpanded)
              } else {
                const path = getPathToCategory(category.id, categoryTree) || []
                const isUnderExpandedBranch = path.some((pid) => expandedIds.has(pid))
                if (!isUnderExpandedBranch) collapseAll()
              }
            }
            if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
              e.preventDefault()
              toggleExpand(category.id, true)
            }
            if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
              e.preventDefault()
              toggleExpand(category.id, false)
            }
          }}
          className={`group flex items-center gap-2 w-full text-left py-2.5 pr-3 pl-4 text-sm border-b border-gray-100 border-l-4 -ml-px transition-all duration-200 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 ${
            isSelected
              ? 'bg-[var(--accent)]/10 text-[var(--foreground)] font-semibold border-l-[var(--accent)]'
              : 'border-l-transparent text-[var(--foreground-muted)] hover:bg-gray-50/80'
          }`}
          style={{ paddingLeft: `calc(1rem + ${level * 1.25}rem)` }}
          title={category.name}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(category.id, isExpanded)
              }}
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200/80 transition-transform duration-200 ease-in-out"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Réduire' : 'Développer'}
            >
              <svg
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ease-in-out ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <span className="w-5 flex-shrink-0" />
          )}
          <span className="truncate flex-1 min-w-0">{category.name}</span>
          {count > 0 && (
            <span className={`flex-shrink-0 text-xs tabular-nums ${isSelected ? 'text-[var(--foreground)]/70' : 'text-gray-400'}`}>
              {count}
            </span>
          )}
        </div>
        {hasChildren && (
          <div
            className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
            style={{ maxHeight: isExpanded ? 3000 : 0 }}
          >
            {visibleChildren.map((child) => renderCategoryTreeNode(child, level + 1))}
            {(hasMoreSubcats || (hasChildren && showAllSubcats && children.length > VISIBLE_SUBCATS)) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleShowAllSubcategories(category.id)
                }}
                className="w-full text-left py-2 pr-3 pl-4 text-xs font-medium text-[var(--accent)] hover:underline transition-colors duration-200"
                style={{ paddingLeft: `calc(1rem + ${(level + 1) * 1.25}rem + 1.25rem)` }}
              >
                {showAllSubcats ? 'Voir moins' : `Voir tout (${children.length})`}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  const showSidebar = !hideTypeFilter || !hideCategoryFilter

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar Menu */}
      {showSidebar && (
      <aside className="w-full lg:w-80 lg:-ml-[2cm] flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden lg:sticky lg:top-6 shadow-sm" role="region" aria-label="Filtres de produits">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <span className="flex h-8 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
            <h3 className="text-base font-semibold uppercase tracking-widest text-[var(--foreground-muted)]">
              Affiner la recherche
            </h3>
          </div>

          <div className="p-5">
            {/* Type Filter - Hidden when hideTypeFilter is true */}
            {!hideTypeFilter && (
              <div className="mb-5">
                <label htmlFor="filter-type" className="block text-xs font-medium text-gray-500 mb-2">
                  Type de produit
                </label>
                <select
                  id="filter-type"
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full h-11 px-4 text-sm text-[var(--foreground)] bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0 focus:border-transparent transition-colors duration-150"
                >
                  <option value="all">Tous les types</option>
                  <option value="chariots">Chariots</option>
                  <option value="pieces">Pièces de rechange</option>
                </select>
              </div>
            )}

            {/* Category Menu */}
            {!hideCategoryFilter && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-3">
                Catégorie
              </p>
              <nav className="border border-gray-100 rounded-md overflow-hidden" aria-label="Catégories">
                <div className="max-h-[min(28rem,70vh)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      handleCategoryChange('all')
                      collapseAll()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCategoryChange('all')
                      }
                    }}
                    className={`flex items-center justify-between gap-2 w-full text-left py-2.5 pr-3 pl-4 text-sm border-b border-gray-100 border-l-4 -ml-px transition-all duration-200 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 ${
                      selectedCategory === 'all'
                        ? 'bg-[var(--accent)]/10 text-[var(--foreground)] font-semibold border-l-[var(--accent)]'
                        : 'border-l-transparent text-[var(--foreground-muted)] hover:bg-gray-50/80'
                    }`}
                  >
                    <span>Toutes les catégories</span>
                    {initialProducts.length > 0 && (
                      <span className={`text-xs tabular-nums flex-shrink-0 ${selectedCategory === 'all' ? 'text-[var(--foreground)]/70' : 'text-gray-400'}`}>
                        {initialProducts.length}
                      </span>
                    )}
                  </div>
                  {categoryTree.length > 0 ? (
                    <div>
                      {categoryTree.map((category) => renderCategoryTreeNode(category))}
                    </div>
                  ) : (
                    <p className="text-[var(--foreground-subtle)] text-sm px-4 py-5">Aucune catégorie disponible</p>
                  )}
                </div>
              </nav>
            </div>
            )}

            {/* Reset & Results */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
              {(selectedCategory !== 'all' || (selectedType !== 'all' && !hideTypeFilter)) && (
                <button
                  onClick={resetFilters}
                  type="button"
                  className="w-full h-10 text-sm font-medium text-gray-600 hover:text-[var(--foreground)] border border-gray-200 hover:border-gray-300 rounded-md transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1"
                >
                  Réinitialiser les filtres
                </button>
              )}
              <p className="text-xs text-gray-400">
                <span className="font-medium text-gray-500">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1 ? 'produit' : 'produits'}
                {(selectedCategory !== 'all' || (selectedType !== 'all' && !hideTypeFilter)) && (
                  <span className="block mt-0.5 text-gray-400">
                    sur {initialProducts.length} au total
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </aside>
      )}

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

  const imageUrls = product.image
    ? product.image.split(/[|\r\n]+/).map((u) => u.trim()).filter(Boolean)
    : []
  const mainImage = imageUrls[0] || '/images/products/chr5-min-276x300.jpg'

  return (
    <Link
      href={`/produits/${product.slug}`}
      className={`group block bg-white overflow-hidden transition-shadow duration-300 hover:shadow-xl ${isSold ? 'opacity-75' : ''}`}
    >
      {/* Image */}
      <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] overflow-hidden bg-[#f8f8f8]">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-contain p-3 sm:p-4 md:p-6 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized={mainImage.startsWith('http') || mainImage.startsWith('/uploads')}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/10 transition-all duration-300"></div>
        {/* Category Badge */}
        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 bg-[var(--accent)] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          {categoryName}
        </span>
        {/* Sold Badge */}
        {isSold && (
          <div className="absolute top-0 right-0 w-[6.5rem] h-[6.5rem] overflow-hidden pointer-events-none z-10">
            <div
              className="absolute left-0 top-0 w-48 bg-red-600 flex items-center justify-center py-3 text-white text-sm font-bold uppercase tracking-widest"
              style={{
                transform: 'translate(-20px, 20px) rotate(45deg)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                textShadow: '0 0 1px rgba(0,0,0,0.5)',
              }}
            >
              Vendu
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 border-t-4 border-[var(--accent)]">
        <h3 className="text-[var(--grey)] text-xs md:text-sm font-bold mb-1 sm:mb-2 group-hover:text-[var(--accent)] transition-colors duration-200 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[var(--grey)] text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
          {product.description}
        </p>
        <span className="en-savoir-plus inline-flex items-center gap-1 sm:gap-2 text-[var(--accent)] text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-wider group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-200">
          En savoir plus
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
