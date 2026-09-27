import { useMemo, useState } from 'react'

import { productService } from '@/features/components/adminPanel/services/productService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { SearchField } from '@/features/components/adminPanel/components/common/SearchField'
import { RowEditButton } from '@/features/components/adminPanel/components/common/RowEditButton'
import { RowDeleteButton } from '@/features/components/adminPanel/components/common/RowDeleteButton'
import { AdminPageLayout } from '@/features/components/adminPanel/components/common/AdminPageLayout'

interface ProductsListProps {
  onAdd: () => void
  onEdit: (productId: number) => void
}

export const ProductsList = ({ onAdd, onEdit }: ProductsListProps) => {
  const { data: products, isLoading } = useAsyncData(productService.getAll)

  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  )

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (products ?? []).filter((product) => {
      if (deletedIds.has(product.id)) {
        return false
      }

      return normalizedSearch
        ? product.name.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true
    })
  }, [products, deletedIds, search])

  const handleDelete = async (id: number) => {
    setDeletingId(id)

    try {
      await productService.delete(id)
      setDeletedIds((current) => new Set(current).add(id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Товари</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
            {filteredProducts.length}
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
        <SearchField value={search} onChange={setSearch} />
      </div>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">Назва ˅</th>
              <th className="px-4 py-3 font-normal">Артикул</th>
              <th className="px-4 py-3 font-normal">Ціна</th>
              <th className="px-4 py-3 font-normal">Залишок</th>
              <th className="px-4 py-3" />
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => {
              const variant = product.variants[0]

              return (
                <tr
                  key={product.id}
                  className="border-b border-[#f0f0f0] last:border-0"
                >
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{variant?.sku ?? '—'}</td>
                  <td className="px-4 py-3">
                    {variant ? `${variant.price}₴` : '—'}
                  </td>
                  <td className="px-4 py-3">{variant?.stock ?? 0} шт.</td>
                  <td className="px-4 py-3 text-right">
                    <RowEditButton onClick={() => onEdit(product.id)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowDeleteButton
                      disabled={deletingId === product.id}
                      onClick={() => void handleDelete(product.id)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {!isLoading && filteredProducts.length === 0 && (
          <p className="px-4 py-10 text-center text-[#8a8a8a]">
            Нічого не знайдено
          </p>
        )}

        {isLoading && (
          <p className="px-4 py-10 text-center text-[#8a8a8a]">
            Завантаження...
          </p>
        )}
      </div>
    </AdminPageLayout>
  )
}
