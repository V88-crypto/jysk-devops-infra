import { Link, useSearchParams } from 'react-router-dom'

import { formatProductCount } from '@/features/catalog/utils/format'

import { CatalogBreadcrumbs } from './components/CatalogBreadcrumbs'
import { CatalogPagination } from './components/CatalogPagination'
import { ProductGrid } from './components/ProductGrid'
import { PRODUCTS_PAGE_SIZE, useProductList } from './hooks/useProductList'

const SearchResults = ({ query }: { query: string }) => {
  const { page, setPage, data, error, isLoading } = useProductList({
    search: query,
  })

  if (error) {
    return (
      <p className="py-16 text-center text-danger">
        Не вдалося виконати пошук, спробуйте ще раз
      </p>
    )
  }

  if (!data) {
    return <p className="py-16 text-center text-fg-subtle">Пошук...</p>
  }

  if (data.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-[20px]">
          За запитом «{query}» нічого не знайдено
        </p>
        <Link to="/categories" className="text-primary underline">
          Переглянути категорії
        </Link>
      </div>
    )
  }

  return (
    <div className={`transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
      <p className="mb-6 text-center text-fg-subtle">
        Знайдено {formatProductCount(data.total)}
      </p>
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

export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  return (
    <main className="min-h-[60vh] w-full bg-page pb-16 font-sans">
      <div className="mx-auto w-[90%] max-w-[1440px]">
        <CatalogBreadcrumbs items={[{ label: 'Пошук' }]} />

        <h1 className="mb-4 mt-2 text-center font-['Inter'] text-3xl font-bold text-fg md:text-[40px]">
          {query ? `Результати пошуку: «${query}»` : 'Пошук товарів'}
        </h1>

        {query ? (
          <SearchResults query={query} />
        ) : (
          <p className="py-16 text-center text-fg-subtle">
            Введіть назву товару в рядку пошуку
          </p>
        )}
      </div>
    </main>
  )
}
