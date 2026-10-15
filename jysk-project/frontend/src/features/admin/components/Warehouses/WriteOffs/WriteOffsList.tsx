import { useMemo, useState } from 'react'

import { categoryService } from '@/features/admin/api/categoryService'
import { warehouseService } from '@/features/admin/api/warehouseService'
import { writeOffReasonService } from '@/features/admin/api/writeOffReasonService'
import { writeOffService } from '@/features/admin/api/writeOffService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { FilterDropdown } from '@/features/admin/components/common/FilterDropdown'
import { SearchField } from '@/features/admin/components/common/SearchField'
import { RowEditButton } from '@/features/admin/components/common/RowEditButton'
import { formatDocumentDate } from '@/features/admin/utils/formatDocumentDate'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

interface WriteOffsListProps {
  onAdd: () => void
}

export const WriteOffsList = ({ onAdd }: WriteOffsListProps) => {
  const { data: writeOffs, isLoading: isWriteOffsLoading } = useAsyncData(
    writeOffService.getAll,
  )

  const { data: warehouses, isLoading: isWarehousesLoading } = useAsyncData(
    warehouseService.getAll,
  )

  const { data: categories, isLoading: isCategoriesLoading } = useAsyncData(
    categoryService.getAll,
  )

  const { data: reasons, isLoading: isReasonsLoading } = useAsyncData(
    writeOffReasonService.getAll,
  )

  const [search, setSearch] = useState('')
  const [warehouseId, setWarehouseId] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [reasonId, setReasonId] = useState<number | null>(null)

  const isLoading =
    isWriteOffsLoading ||
    isWarehousesLoading ||
    isCategoriesLoading ||
    isReasonsLoading

  const filteredWriteOffs = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (writeOffs ?? []).filter((writeOff) => {
      const matchesSearch = normalizedSearch
        ? writeOff.productsSummary
            .toLocaleLowerCase('uk-UA')
            .includes(normalizedSearch)
        : true

      const matchesWarehouse =
        warehouseId === null || writeOff.warehouseId === warehouseId

      const matchesCategory =
        categoryId === null || writeOff.categoryId === categoryId

      const matchesReason = reasonId === null || writeOff.reasonId === reasonId

      return (
        matchesSearch && matchesWarehouse && matchesCategory && matchesReason
      )
    })
  }, [writeOffs, search, warehouseId, categoryId, reasonId])

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Списання</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-strong px-2 text-sm font-medium text-fg-muted">
            {filteredWriteOffs.length}
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

        <FilterDropdown
          label="Категорії"
          options={categories ?? []}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />

        <FilterDropdown
          label="Причина"
          options={reasons ?? []}
          selectedId={reasonId}
          onSelect={setReasonId}
        />

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-fg transition-opacity hover:opacity-70"
        >
          Фільтр <span>+</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md bg-surface shadow-sm">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg-subtle">
              <th className="px-4 py-3 font-normal">№</th>
              <th className="px-4 py-3 font-normal">Дата ˅</th>
              <th className="px-4 py-3 font-normal">Працівник</th>
              <th className="px-4 py-3 font-normal">Склад</th>
              <th className="px-4 py-3 font-normal">Товари</th>
              <th className="px-4 py-3 font-normal">Причина</th>
              <th className="px-4 py-3 font-normal">Сума</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredWriteOffs.map((writeOff) => (
              <tr
                key={writeOff.id}
                className="border-b border-line last:border-0"
              >
                <td className="px-4 py-3">{writeOff.number}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDocumentDate(writeOff.date)}
                </td>
                <td className="px-4 py-3">{writeOff.employeeName}</td>
                <td className="px-4 py-3">{writeOff.warehouseName}</td>
                <td className="max-w-[160px] truncate px-4 py-3">
                  {writeOff.productsSummary}
                </td>
                <td className="px-4 py-3 text-fg-subtle">
                  {writeOff.reasonName ?? '—'}
                </td>
                <td className="px-4 py-3">{writeOff.sum}₴</td>
                <td className="px-4 py-3 text-right">
                  <RowEditButton />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredWriteOffs.length === 0 && (
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
