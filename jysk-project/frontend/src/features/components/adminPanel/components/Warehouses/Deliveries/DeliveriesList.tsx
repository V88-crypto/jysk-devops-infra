import { useMemo, useState } from 'react'

import { categoryService } from '../../../services/categoryService'
import { deliveryService } from '../../../services/deliveryService'
import { supplierService } from '../../../services/supplierService'
import { warehouseService } from '../../../services/warehouseService'

import { useAsyncData } from '../../../../../../shared/hooks/useAsyncData'

import { FilterDropdown } from '../../common/FilterDropdown'
import { SearchField } from '../../common/SearchField'
import { RowEditButton } from '../../common/RowEditButton'
import { formatDocumentDate } from '../../../utils/formatDocumentDate'
import { AdminPageLayout } from '../../common/AdminPageLayout'

interface DeliveriesListProps {
  onAdd: () => void
}

const DELIVERY_STATUS_LABEL: Record<'paid' | 'unpaid', string> = {
  paid: 'Оплачено',
  unpaid: 'Неоплачено',
}

export const DeliveriesList = ({ onAdd }: DeliveriesListProps) => {
  const { data: deliveries, isLoading: isDeliveriesLoading } = useAsyncData(
    deliveryService.getAll,
  )

  const { data: suppliers, isLoading: isSuppliersLoading } = useAsyncData(
    supplierService.getAll,
  )

  const { data: warehouses, isLoading: isWarehousesLoading } = useAsyncData(
    warehouseService.getAll,
  )

  const { data: categories, isLoading: isCategoriesLoading } = useAsyncData(
    categoryService.getAll,
  )

  const [search, setSearch] = useState('')
  const [supplierId, setSupplierId] = useState<number | null>(null)
  const [warehouseId, setWarehouseId] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null)

  const isLoading =
    isDeliveriesLoading ||
    isSuppliersLoading ||
    isWarehousesLoading ||
    isCategoriesLoading

  const invoiceOptions = useMemo(() => {
    const uniqueInvoices = Array.from(
      new Set((deliveries ?? []).map((item) => item.invoiceNumber)),
    )

    return uniqueInvoices.map((name) => ({ id: name, name }))
  }, [deliveries])

  const filteredDeliveries = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (deliveries ?? []).filter((delivery) => {
      const matchesSearch = normalizedSearch
        ? delivery.productsSummary
            .toLocaleLowerCase('uk-UA')
            .includes(normalizedSearch) ||
          delivery.supplierName.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true

      const matchesSupplier =
        supplierId === null || delivery.supplierId === supplierId

      const matchesWarehouse =
        warehouseId === null || delivery.warehouseId === warehouseId

      const matchesCategory =
        categoryId === null || delivery.categoryId === categoryId

      const matchesInvoice =
        invoiceNumber === null || delivery.invoiceNumber === invoiceNumber

      return (
        matchesSearch &&
        matchesSupplier &&
        matchesWarehouse &&
        matchesCategory &&
        matchesInvoice
      )
    })
  }, [deliveries, search, supplierId, warehouseId, categoryId, invoiceNumber])

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Постачання</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
            {filteredDeliveries.length}
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

        <FilterDropdown
          label="Постачальник"
          options={suppliers ?? []}
          selectedId={supplierId}
          onSelect={setSupplierId}
        />

        <FilterDropdown
          label="Склад"
          options={warehouses ?? []}
          selectedId={warehouseId}
          onSelect={setWarehouseId}
        />

        <FilterDropdown
          label="Рахунок"
          options={invoiceOptions}
          selectedId={invoiceNumber}
          onSelect={setInvoiceNumber}
        />

        <FilterDropdown
          label="Категорії"
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
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">№</th>
              <th className="px-4 py-3 font-normal">Дата ˅</th>
              <th className="px-4 py-3 font-normal">Постачальник</th>
              <th className="px-4 py-3 font-normal">Склад</th>
              <th className="px-4 py-3 font-normal">Товари</th>
              <th className="px-4 py-3 font-normal">Коментарі</th>
              <th className="px-4 py-3 font-normal">Статус</th>
              <th className="px-4 py-3 font-normal">Сума</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredDeliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className="border-b border-[#f0f0f0] last:border-0"
              >
                <td className="px-4 py-3">{delivery.number}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDocumentDate(delivery.date)}
                </td>
                <td className="px-4 py-3">{delivery.supplierName}</td>
                <td className="px-4 py-3">{delivery.warehouseName}</td>
                <td className="max-w-[160px] truncate px-4 py-3">
                  {delivery.productsSummary}
                </td>
                <td className="px-4 py-3 text-[#8a8a8a]">
                  {delivery.comment || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className="text-primary underline">
                    {DELIVERY_STATUS_LABEL[delivery.status]}
                  </span>
                </td>
                <td className="px-4 py-3">{delivery.totalSum}₴</td>
                <td className="px-4 py-3 text-right">
                  <RowEditButton />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredDeliveries.length === 0 && (
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
