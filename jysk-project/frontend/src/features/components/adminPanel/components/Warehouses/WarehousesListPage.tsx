import { useMemo, useState } from 'react'

import { stockService } from '@/features/components/adminPanel/services/stockService'
import { warehouseService } from '@/features/components/adminPanel/services/warehouseService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { SearchField } from '@/features/components/adminPanel/components/common/SearchField'
import { RowEditButton } from '@/features/components/adminPanel/components/common/RowEditButton'
import { AdminPageLayout } from '@/features/components/adminPanel/components/common/AdminPageLayout'

export const WarehousesListPage = () => {
  const { data: warehouses, isLoading: isWarehousesLoading } = useAsyncData(
    warehouseService.getAll,
  )

  const { data: stockItems, isLoading: isStockLoading } = useAsyncData(
    stockService.getAll,
  )

  const [search, setSearch] = useState('')

  const isLoading = isWarehousesLoading || isStockLoading

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

  const filteredWarehouses = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (warehouses ?? []).filter((warehouse) =>
      normalizedSearch
        ? warehouse.name.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true,
    )
  }, [warehouses, search])

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Склади</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
            {filteredWarehouses.length}
          </span>
        </div>

        <button
          type="button"
          className="h-[40px] rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Додати
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-[#333] transition-opacity hover:opacity-70"
        >
          Фільтр <span>+</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">№</th>
              <th className="px-4 py-3 font-normal">Назва ˅</th>
              <th className="px-4 py-3 font-normal">Адреса</th>
              <th className="px-4 py-3 font-normal">Сума</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredWarehouses.map((warehouse, index) => (
              <tr
                key={warehouse.id}
                className="border-b border-[#f0f0f0] last:border-0"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{warehouse.name}</td>
                <td className="px-4 py-3">{warehouse.address}</td>
                <td className="px-4 py-3">
                  {warehouseSums.get(warehouse.id) ?? 0}₴
                </td>
                <td className="px-4 py-3 text-right">
                  <RowEditButton />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredWarehouses.length === 0 && (
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
