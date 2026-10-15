import { useMemo, useState } from 'react'

import { transferService } from '@/features/admin/api/transferService'
import { warehouseService } from '@/features/admin/api/warehouseService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { FilterDropdown } from '@/features/admin/components/common/FilterDropdown'
import { SearchField } from '@/features/admin/components/common/SearchField'
import { RowEditButton } from '@/features/admin/components/common/RowEditButton'
import { formatDocumentDate } from '@/features/admin/utils/formatDocumentDate'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

interface TransfersListProps {
  onAdd: () => void
}

export const TransfersList = ({ onAdd }: TransfersListProps) => {
  const { data: transfers, isLoading: isTransfersLoading } = useAsyncData(
    transferService.getAll,
  )

  const { data: warehouses, isLoading: isWarehousesLoading } = useAsyncData(
    warehouseService.getAll,
  )

  const [search, setSearch] = useState('')
  const [warehouseId, setWarehouseId] = useState<number | null>(null)

  const isLoading = isTransfersLoading || isWarehousesLoading

  const filteredTransfers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (transfers ?? []).filter((transfer) => {
      const matchesSearch = normalizedSearch
        ? transfer.productsSummary
            .toLocaleLowerCase('uk-UA')
            .includes(normalizedSearch)
        : true

      const matchesWarehouse =
        warehouseId === null ||
        transfer.fromWarehouseId === warehouseId ||
        transfer.toWarehouseId === warehouseId

      return matchesSearch && matchesWarehouse
    })
  }, [transfers, search, warehouseId])

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Переміщення</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-strong px-2 text-sm font-medium text-fg-muted">
            {filteredTransfers.length}
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

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-surface px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />

        <FilterDropdown
          label="Склади"
          options={warehouses ?? []}
          selectedId={warehouseId}
          onSelect={setWarehouseId}
        />

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-fg transition-opacity hover:opacity-70"
        >
          Фільтр <span>+</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md bg-surface shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg-subtle">
              <th className="px-4 py-3 font-normal">Дата ˅</th>
              <th className="px-4 py-3 font-normal">Найменування</th>
              <th className="px-4 py-3 font-normal">Сума</th>
              <th className="px-4 py-3 font-normal">Працівник</th>
              <th className="px-4 py-3 font-normal">Склади</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredTransfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-b border-line last:border-0"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDocumentDate(transfer.date)}
                </td>
                <td className="max-w-[220px] truncate px-4 py-3">
                  {transfer.productsSummary}
                </td>
                <td className="px-4 py-3">{transfer.sum}₴</td>
                <td className="px-4 py-3">{transfer.employeeName}</td>
                <td className="px-4 py-3">{transfer.toWarehouseName}</td>
                <td className="px-4 py-3 text-right">
                  <RowEditButton />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredTransfers.length === 0 && (
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
