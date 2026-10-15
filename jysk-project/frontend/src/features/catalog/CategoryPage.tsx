import { Link, useParams } from 'react-router-dom'

import {
  catalogApi,
  findCategory,
  findCategoryPath,
} from '@/features/catalog/api/catalogApi'
import { formatProductCount } from '@/features/catalog/utils/format'
import { ApiError } from '@/shared/api/httpClient'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'

import { BlogCarousel } from './components/BlogCarousel'
import { BrandsBlock } from './components/BrandsBlock'
import { CatalogBreadcrumbs } from './components/CatalogBreadcrumbs'
import type { BreadcrumbItem } from './components/CatalogBreadcrumbs'
import { CatalogPagination } from './components/CatalogPagination'
import { ProductGrid } from './components/ProductGrid'
import { PRODUCTS_PAGE_SIZE, useProductList } from './hooks/useProductList'

export const CategoryPage = () => {
  const { slug = '' } = useParams()
  const { data: categories } = useAsyncData(catalogApi.getCategories)
  const { page, setPage, data, error, isLoading } = useProductList({
    category: slug,
  })

  const category = categories
    ? findCategory(categories, (item) => item.slug === slug)
    : null
  const ancestors =
    categories && category
      ? findCategoryPath(categories, category.id).slice(0, -1)
      : []
  const isNotFound =
    (error instanceof ApiError && error.status === 404) ||
    (categories !== null && category === null)

  if (isNotFound) {
    return (
      <main className="min-h-[60vh] bg-[#f3f3f3] px-4 py-20 text-center">
        <p className="mb-4 text-[20px]">Категорію не знайдено</p>
        <Link to="/categories" className="text-primary underline">
          Перейти до категорій
        </Link>
      </main>
    )
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Категорії', to: '/categories' },
    ...ancestors.map((item) => ({
      label: item.name,
      to: `/category/${item.slug}`,
    })),
    { label: category?.name ?? '...' },
  ]

  const renderProducts = () => {
    if (error) {
      return (
        <p className="py-16 text-center text-[#d33]">
          Не вдалося завантажити товари
        </p>
      )
    }

    if (!data) {
      return <p className="py-16 text-center text-[#777]">Завантаження...</p>
    }

    if (data.items.length === 0) {
      return (
        <p className="py-16 text-center text-[#777]">
          У цій категорії поки немає товарів
        </p>
      )
    }

    return (
      <div
        className={`w-full transition-opacity ${isLoading ? 'opacity-60' : ''}`}
      >
        <ProductGrid products={data.items} />
        <CatalogPagination
          page={page}
          pageSize={PRODUCTS_PAGE_SIZE}
          total={data.total}
          onPageChange={setPage}
        />
      </div>
    )
  }

  return (
    <main className="w-full bg-[#f3f3f3] pb-16 font-sans">
      <div className="mx-auto mb-16 w-[90%] max-w-[1440px]">
        <CatalogBreadcrumbs items={breadcrumbs} />

        <div className="mb-8 mt-2 flex flex-col items-center gap-4 md:mb-12">
          <h1 className="text-center font-['Inter'] text-3xl font-bold leading-none text-black md:text-[48px]">
            {category?.name ?? ''}
          </h1>

          {data && (
            <p className="text-[#777]">{formatProductCount(data.total)}</p>
          )}

          {category && category.children.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-2">
              {category.children.map((child) => (
                <li key={child.id}>
                  <Link
                    to={`/category/${child.slug}`}
                    className="block rounded-full border border-[#c5c5c5] bg-white px-4 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {renderProducts()}
      </div>

      <BrandsBlock />
      <BlogCarousel />
      <Prefooter />
    </main>
  )
}
