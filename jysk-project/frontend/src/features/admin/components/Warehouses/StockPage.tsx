import { useMemo, useState } from 'react'

import { categoryService } from '@/features/admin/api/categoryService'
import { stockService } from '@/features/admin/api/stockService'
import { warehouseService } from '@/features/admin/api/warehouseService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { FilterDropdown } from '@/features/admin/components/common/FilterDropdown'
import { SearchField } from '@/features/admin/components/common/SearchField'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

export const StockPage = () => {
  const { data: stockItems, isLoading: isStockLoading } = useAsyncData(
    stockService.getAll,
  )

  const { data: warehouses, isLoading: isWarehousesLoading } = useAsyncData(
    warehouseService.getAll,
  )

  const { data: categories, isLoading: isCategoriesLoading } = useAsyncData(
    categoryService.getAll,
  )

  const [search, setSearch] = useState('')
  const [warehouseId, setWarehouseId] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const isLoading = isStockLoading || isWarehousesLoading || isCategoriesLoading

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (stockItems ?? []).filter((item) => {
      const matchesSearch = normalizedSearch
        ? item.productName.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true

      const matchesWarehouse =
        warehouseId === null || item.warehouseId === warehouseId

      const matchesCategory =
        categoryId === null || item.categoryId === categoryId

      return matchesSearch && matchesWarehouse && matchesCategory
    })
  }, [stockItems, search, warehouseId, categoryId])

  return (
    <AdminPageLayout>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Залишки</h1>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-strong px-2 text-sm font-medium text-fg-muted">
          {filteredItems.length}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-surface px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />

        <FilterDropdown
          label="Склад"
          options={warehouses ?? []}
          selectedId={warehouseId}
          onSelect={setWarehouseId}
        />

        <FilterDropdown
          label="Категорія"
          options={categories ?? []}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-fg transition-opacity hover:opacity-70"
        >
          Фільтр <span>+</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md bg-surface shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg-subtle">
              <th className="px-4 py-3 font-normal">Назва ˅</th>
              <th className="px-4 py-3 font-normal">Категорія</th>
              <th className="px-4 py-3 font-normal">Залишки</th>
              <th className="px-4 py-3 font-normal">Собівартість</th>
              <th className="px-4 py-3 font-normal">Сума</th>
              <th className="px-4 py-3 font-normal">Лімит</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">{item.productName}</td>
                <td className="px-4 py-3">{item.categoryName}</td>
                <td className="px-4 py-3">{item.quantity} шт.</td>
                <td className="px-4 py-3">{item.costPrice}₴</td>
                <td className="px-4 py-3">{item.quantity * item.costPrice}₴</td>
                <td className="px-4 py-3">{item.limit} шт.</td>
                <td className="px-4 py-3 text-right">
                  <a
                    href="#"
                    className="text-primary underline transition-colors hover:text-primary-dark"
                  >
                    Постачання
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredItems.length === 0 && (
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
