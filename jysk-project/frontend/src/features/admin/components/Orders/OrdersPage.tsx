import { useMemo, useState } from 'react'

import { categoryService } from '@/features/admin/api/categoryService'
import { purchaseOrderService } from '@/features/admin/api/purchaseOrderService'
import { warehouseService } from '@/features/admin/api/warehouseService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { FilterDropdown } from '@/features/admin/components/common/FilterDropdown'
import { SearchField } from '@/features/admin/components/common/SearchField'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

export const OrdersPage = () => {
  const { data: orders, isLoading: isOrdersLoading } = useAsyncData(
    purchaseOrderService.getAll,
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

  const isLoading =
    isOrdersLoading || isWarehousesLoading || isCategoriesLoading

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (orders ?? []).filter((order) => {
      const matchesSearch = normalizedSearch
        ? order.productName
            .toLocaleLowerCase('uk-UA')
            .includes(normalizedSearch)
        : true

      const matchesWarehouse =
        warehouseId === null || order.warehouseId === warehouseId

      const matchesCategory =
        categoryId === null || order.categoryId === categoryId

      return matchesSearch && matchesWarehouse && matchesCategory
    })
  }, [orders, search, warehouseId, categoryId])

  return (
    <AdminPageLayout>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Замовлення</h1>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
          {filteredOrders.length}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
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
          className="flex items-center gap-1 text-sm font-medium text-[#333] transition-opacity hover:opacity-70"
        >
          Фільтр <span>+</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">Номер замовлення ˅</th>
              <th className="px-4 py-3 font-normal">Категорія</th>
              <th className="px-4 py-3 font-normal">Податок</th>
              <th className="px-4 py-3 font-normal">Собівартість</th>
              <th className="px-4 py-3 font-normal">Ціна</th>
              <th className="px-4 py-3 font-normal">Націнка</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#f0f0f0] last:border-0"
              >
                <td className="px-4 py-3">{order.productName}</td>
                <td className="px-4 py-3">{order.categoryName}</td>
                <td className="px-4 py-3">{order.taxRate} шт.</td>
                <td className="px-4 py-3">{order.costPrice}₴</td>
                <td className="px-4 py-3">{order.price}₴</td>
                <td className="px-4 py-3">{order.markup} шт.</td>
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

        {!isLoading && filteredOrders.length === 0 && (
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
