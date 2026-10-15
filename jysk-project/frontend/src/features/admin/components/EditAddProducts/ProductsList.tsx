import { useEffect, useState } from 'react'

import { productApi } from '@/features/admin/api/productApi'
import type { ProductPage } from '@/features/admin/api/productApi'
import type { Product } from '@/features/admin/types/product'

import { SearchField } from '@/features/admin/components/common/SearchField'
import { RowEditButton } from '@/features/admin/components/common/RowEditButton'
import { RowDeleteButton } from '@/features/admin/components/common/RowDeleteButton'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'
import {
  IMAGE_FALLBACK_URL,
  productErrorMessage,
} from '@/features/admin/components/EditAddProducts/utils/productHelpers'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

interface ProductsListProps {
  onAdd: () => void
  onEdit: (productId: number) => void
}

type LoadResult =
  | { key: string; status: 'ready'; data: ProductPage }
  | { key: string; status: 'error' }

const formatPrice = (price: number) =>
  `${price.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} ₴`

const primaryImage = (product: Product) => {
  const images = product.variants[0]?.images ?? []

  return (images.find((image) => image.isPrimary) ?? images[0])?.imageUrl
}

export const ProductsList = ({ onAdd, onEdit }: ProductsListProps) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [reloadId, setReloadId] = useState(0)
  const [result, setResult] = useState<LoadResult | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const requestKey = `${debouncedSearch}|${page}|${reloadId}`

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    )

    return () => window.clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    let isActive = true
    const key = `${debouncedSearch}|${page}|${reloadId}`

    productApi
      .getPage({ search: debouncedSearch, page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (isActive) {
          setResult({ key, status: 'ready', data })
        }
      })
      .catch(() => {
        if (isActive) {
          setResult({ key, status: 'error' })
        }
      })

    return () => {
      isActive = false
    }
  }, [debouncedSearch, page, reloadId])

  const isLoading = result?.key !== requestKey
  const productPage = result?.status === 'ready' ? result.data : null
  const products = productPage?.items ?? []
  const total = productPage?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Видалити товар «${product.name}»?`)) {
      return
    }

    setDeletingId(product.id)
    setActionError(null)

    try {
      await productApi.delete(product.id)

      if (products.length === 1 && page > 1) {
        setPage((current) => current - 1)
      } else {
        setReloadId((current) => current + 1)
      }
    } catch (error) {
      setActionError(productErrorMessage(error, 'Не вдалося видалити товар'))
    } finally {
      setDeletingId(null)
    }
  }

  const renderStatus = () => {
    if (result?.status === 'error' && !isLoading) {
      return (
        <p className="px-4 py-10 text-center text-[#d33]">
          Не вдалося завантажити товари
        </p>
      )
    }

    if (!productPage) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">Завантаження...</p>
      )
    }

    if (products.length === 0) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">
          Нічого не знайдено
        </p>
      )
    }

    return null
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Товари</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
            {total}
          </span>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="h-[40px] rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Додати
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
        <SearchField
          value={search}
          onChange={handleSearchChange}
          placeholder="Пошук за назвою"
        />
      </div>

      {actionError && (
        <p className="mb-4 rounded-md bg-[#fdecec] px-4 py-3 text-sm text-[#d33]">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table
          className={`w-full min-w-[720px] border-collapse text-left text-sm transition-opacity ${
            isLoading && productPage ? 'opacity-60' : ''
          }`}
        >
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="w-[64px] px-4 py-3 font-normal">Фото</th>
              <th className="px-4 py-3 font-normal">Назва</th>
              <th className="px-4 py-3 font-normal">Артикул</th>
              <th className="px-4 py-3 font-normal">Ціна</th>
              <th className="px-4 py-3 font-normal">Залишок</th>
              <th className="px-4 py-3" />
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const variant = product.variants[0]
              const imageUrl = primaryImage(product)

              return (
                <tr
                  key={product.id}
                  className="border-b border-[#f0f0f0] last:border-0"
                >
                  <td className="px-4 py-2">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.src = IMAGE_FALLBACK_URL
                        }}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <span className="block h-10 w-10 rounded bg-[#f0f0f0]" />
                    )}
                  </td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{variant?.sku ?? '—'}</td>
                  <td className="px-4 py-3">
                    {variant ? formatPrice(variant.price) : '—'}
                  </td>
                  <td className="px-4 py-3">{variant?.stock ?? 0} шт.</td>
                  <td className="px-4 py-3 text-right">
                    <RowEditButton onClick={() => onEdit(product.id)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowDeleteButton
                      disabled={deletingId === product.id}
                      onClick={() => void handleDelete(product)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {renderStatus()}
      </div>

      {total > PAGE_SIZE && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#555]">
          <span>
            Показано {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} з {total}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={page <= 1}
              className="h-[34px] rounded-[4px] border border-[#d5d5d5] bg-white px-3 transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹ Назад
            </button>

            <span>
              {page} / {pageCount}
            </span>

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= pageCount}
              className="h-[34px] rounded-[4px] border border-[#d5d5d5] bg-white px-3 transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Далі ›
            </button>
          </div>
        </div>
      )}
    </AdminPageLayout>
  )
}
