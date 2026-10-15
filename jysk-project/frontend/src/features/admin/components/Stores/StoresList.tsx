import { useMemo, useState } from 'react'

import { stockService } from '@/features/admin/api/stockService'
import { storeService } from '@/features/admin/api/storeService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { SearchField } from '@/features/admin/components/common/SearchField'
import { RowEditButton } from '@/features/admin/components/common/RowEditButton'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

interface StoresListProps {
  onEdit: (storeId: number) => void
}

export const StoresList = ({ onEdit }: StoresListProps) => {
  const { data: stores, isLoading: isStoresLoading } = useAsyncData(
    storeService.getAll,
  )

  const { data: stockItems, isLoading: isStockLoading } = useAsyncData(
    stockService.getAll,
  )

  const [search, setSearch] = useState('')

  const isLoading = isStoresLoading || isStockLoading

  const warehouseSums = useMemo(() => {
    const sums = new Map<number, number>()

    for (const item of stockItems ?? []) {
      sums.set(
        item.warehouseId,
        (sums.get(item.warehouseId) ?? 0) + item.quantity * item.costPrice,
      )
    }

    return sums
  }, [stockItems])

  const filteredStores = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (stores ?? []).filter((store) =>
      normalizedSearch
        ? store.name.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true,
    )
  }, [stores, search])

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Магазини</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-strong px-2 text-sm font-medium text-fg-muted">
            {filteredStores.length}
          </span>
        </div>

        <button
          type="button"
          className="h-[40px] rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Додати
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-surface px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-fg transition-opacity hover:opacity-70"
        >
          Фільтр <span>+</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md bg-surface shadow-sm">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg-subtle">
              <th className="px-4 py-3 font-normal">№</th>
              <th className="px-4 py-3 font-normal">Назва ˅</th>
              <th className="px-4 py-3 font-normal">Вулиця</th>
              <th className="px-4 py-3 font-normal">№ будинку</th>
              <th className="px-4 py-3 font-normal">Заг. сума товарів</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredStores.map((store, index) => (
              <tr key={store.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{store.name}</td>
                <td className="px-4 py-3">{store.street}</td>
                <td className="px-4 py-3">{store.houseNumber}</td>
                <td className="px-4 py-3">
                  {warehouseSums.get(store.warehouseId) ?? 0}₴
                </td>
                <td className="px-4 py-3 text-right">
                  <RowEditButton onClick={() => onEdit(store.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredStores.length === 0 && (
          <p className="px-4 py-10 text-center text-fg-subtle">
            Нічого не знайдено
          </p>
        )}

        {isLoading && (
          <p className="px-4 py-10 text-center text-fg-subtle">
            Завантаження...
          </p>
        )}
      </div>
    </AdminPageLayout>
  )
}
