import { useCallback } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { catalogApi, findCategoryPath } from '@/features/catalog/api/catalogApi'
import type { ProductVariant } from '@/features/catalog/types'
import { useFavorites } from '@/features/catalog/hooks/useFavorites'
import { formatPrice } from '@/features/catalog/utils/format'
import { ApiError } from '@/shared/api/httpClient'
import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { CatalogBreadcrumbs } from './components/CatalogBreadcrumbs'
import { ProductGallery } from './components/ProductGallery'
import { ProductReviews } from './components/ProductReviews'

const variantLabel = (variant: ProductVariant) =>
  variant.attributes.length
    ? variant.attributes.map((attribute) => attribute.value).join(' / ')
    : variant.sku

export const ProductPage = () => {
  const { slug = '' } = useParams()
  const fetchProduct = useCallback(() => catalogApi.getProduct(slug), [slug])
  const { data: product, isLoading, error } = useAsyncData(fetchProduct)
  const { data: categories } = useAsyncData(catalogApi.getCategories)
  const {
    isFavorite,
    toggleFavorite,
    pendingSlug,
    error: favoriteError,
  } = useFavorites()
  // The selected variant lives in the URL (?variant=), so links from the
  // profile open the exact colour or size and the page can be shared.
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedVariantId = Number(searchParams.get('variant')) || null
  const selectVariant = (variantId: number) =>
    setSearchParams({ variant: String(variantId) }, { replace: true })

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-[#f3f3f3] px-4 py-20 text-center text-[#777]">
        Завантаження...
      </main>
    )
  }

  if (!product) {
    const isNotFound = error instanceof ApiError && error.status === 404

    return (
      <main className="min-h-[60vh] bg-[#f3f3f3] px-4 py-20 text-center">
        <p className="mb-4 text-[20px]">
          {isNotFound ? 'Товар не знайдено' : 'Не вдалося завантажити товар'}
        </p>
        <Link to="/categories" className="text-primary underline">
          Перейти до категорій
        </Link>
      </main>
    )
  }

  const variant =
    product.variants.find((item) => item.id === selectedVariantId) ??
    product.variants[0] ??
    null
  const breadcrumbs = [
    { label: 'Категорії', to: '/categories' },
    ...findCategoryPath(categories ?? [], product.categoryId).map((item) => ({
      label: item.name,
      to: `/category/${item.slug}`,
    })),
    { label: product.name },
  ]
  const isProductFavorite = isFavorite(product.slug)

  return (
    <main className="bg-[#f3f3f3] pb-16">
      <div className="mx-auto w-[90%] max-w-[1440px]">
        <CatalogBreadcrumbs items={breadcrumbs} />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery
            key={variant?.id ?? 'none'}
            images={variant?.images ?? []}
            name={product.name}
          />

          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-[28px] font-bold leading-tight lg:text-[40px]">
                {product.name}
              </h1>
              {variant && (
                <p className="mt-1 text-sm text-[#888]">
                  Артикул: {variant.sku}
                </p>
              )}
            </div>

            {variant ? (
              <p className="text-[32px] font-bold">
                {formatPrice(variant.price)}
              </p>
            ) : (
              <p className="text-[#777]">Товар тимчасово недоступний</p>
            )}

            {product.variants.length > 1 && (
              <div>
                <p className="mb-2 font-semibold">Варіант:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectVariant(item.id)}
                      aria-pressed={item.id === variant?.id}
                      className={`rounded-[4px] border px-4 py-2 text-sm transition ${
                        item.id === variant?.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-[#c5c5c5] bg-white hover:border-primary'
                      }`}
                    >
                      {variantLabel(item)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {variant && (
              <p className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    variant.stock > 0 ? 'bg-[#19c514]' : 'bg-red-500'
                  }`}
                />
                {variant.stock > 0
                  ? `В наявності (${variant.stock} шт.)`
                  : 'Немає в наявності'}
              </p>
            )}

            {variant && (
              <div>
                <button
                  type="button"
                  disabled={pendingSlug === product.slug}
                  onClick={() =>
                    void toggleFavorite(product.slug, async () => variant.id)
                  }
                  aria-pressed={isProductFavorite}
                  className="flex h-[48px] items-center gap-2 rounded-[4px] border border-primary px-6 font-semibold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-[20px] leading-none">
                    {isProductFavorite ? '♥' : '♡'}
                  </span>
                  {isProductFavorite ? 'В обраному' : 'Додати в обране'}
                </button>
                {favoriteError && (
                  <p className="mt-2 text-sm text-red-500">{favoriteError}</p>
                )}
              </div>
            )}

            <div className="bg-white p-5">
              <h2 className="mb-3 text-[20px] font-bold">Характеристики</h2>
              {variant && variant.attributes.length > 0 ? (
                <dl className="grid grid-cols-[minmax(120px,40%)_1fr] gap-x-4 gap-y-2">
                  {variant.attributes.map((attribute) => (
                    <div key={attribute.name} className="contents">
                      <dt className="text-[#777]">{attribute.name}</dt>
                      <dd>{attribute.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-[#777]">Характеристики не вказані</p>
              )}
            </div>
          </div>
        </div>

        {product.description && (
          <section className="mt-12">
            <h2 className="mb-4 text-[26px] font-bold lg:text-[32px]">Опис</h2>
            <p className="max-w-[900px] whitespace-pre-line text-[17px] leading-[28px] text-[#444]">
              {product.description}
            </p>
          </section>
        )}

        <ProductReviews slug={product.slug} variantId={variant?.id ?? null} />
      </div>
    </main>
  )
}
