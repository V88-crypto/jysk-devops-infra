import { useState } from 'react'
import type { FormEvent } from 'react'

import { productService } from '@/features/admin/api/productService'
import { packagingService } from '@/features/admin/api/packagingService'
import { stockService } from '@/features/admin/api/stockService'
import { warehouseService } from '@/features/admin/api/warehouseService'
import { writeOffReasonService } from '@/features/admin/api/writeOffReasonService'
import { writeOffService } from '@/features/admin/api/writeOffService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { DateTimeFields } from '@/features/admin/components/common/DateTimeFields'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'
import { fieldClass, inputClass } from '@/features/admin/components/common/formFieldStyles'
import { useDateTimeValue } from '@/features/admin/hooks/useDateTimeValue'
import { useLineItemRows } from '@/features/admin/hooks/useLineItemRows'

import { createEmptyWriteOffLineItemRow } from './types'
import type { WriteOffLineItemRow } from './types'

interface AddWriteOffFormProps {
  onBack: () => void
  onSaved: () => void
}

export const AddWriteOffForm = ({ onBack, onSaved }: AddWriteOffFormProps) => {
  const { data: products } = useAsyncData(productService.getAll)
  const { data: packagings } = useAsyncData(packagingService.getAll)
  const { data: warehouses } = useAsyncData(warehouseService.getAll)
  const { data: reasons } = useAsyncData(writeOffReasonService.getAll)
  const { data: stockItems } = useAsyncData(stockService.getAll)

  const { date, setDate, hour, setHour, minute, setMinute, toISOString } =
    useDateTimeValue()

  const [warehouseId, setWarehouseId] = useState<number | null>(null)
  const [reasonId, setReasonId] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { rows, updateRow, addRow, removeRow } =
    useLineItemRows<WriteOffLineItemRow>(createEmptyWriteOffLineItemRow)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const warehouse = warehouses?.find((item) => item.id === warehouseId)

    if (!warehouse) {
      return
    }

    const selectedRows = rows.filter((row) => row.productId !== null)

    const productsSummary = selectedRows
      .map(
        (row) =>
          products?.find((product) => product.id === row.productId)?.name ??
          '',
      )
      .filter(Boolean)
      .join(', ')

    const categoryId =
      products?.find((product) => product.id === selectedRows[0]?.productId)
        ?.categoryId ?? 0

    const reason = reasons?.find((item) => item.id === reasonId) ?? null

    const sum = selectedRows.reduce((total, row) => {
      const quantity = Number(row.quantity.replace(',', '.')) || 0
      const costPrice =
        stockItems?.find((item) => item.productId === row.productId)
          ?.costPrice ?? 0

      return total + quantity * costPrice
    }, 0)

    setIsSaving(true)

    try {
      await writeOffService.create({
        date: toISOString(),
        employeeName: "Ім'я",
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        categoryId,
        productsSummary: productsSummary || 'Без товарів',
        reasonId: reason?.id ?? null,
        reasonName: reason?.name ?? null,
        sum,
      })

      onSaved()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPageLayout>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-2xl font-semibold transition-opacity hover:opacity-70"
      >
        <span className="text-lg">‹</span> Додавання списання
      </button>

      <div className="mb-6 border-t border-[#e0e0e0]" />

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="flex flex-col gap-6"
      >
        <DateTimeFields
          label="Дата та час списання"
          date={date}
          hour={hour}
          minute={minute}
          onDateChange={setDate}
          onHourChange={setHour}
          onMinuteChange={setMinute}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <span className="min-w-[220px] text-sm font-medium text-[#333]">
            Склад
          </span>

          <select
            value={warehouseId ?? ''}
            onChange={(event) =>
              setWarehouseId(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            className={`${fieldClass} sm:w-[320px]`}
          >
            <option value="">Виберіть...</option>

            {(warehouses ?? []).map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <span className="min-w-[220px] text-sm font-medium text-[#333]">
            Причина
          </span>

          <select
            value={reasonId ?? ''}
            onChange={(event) =>
              setReasonId(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            className={`${fieldClass} sm:w-[320px]`}
          >
            <option value="">Без причини</option>

            {(reasons ?? []).map((reason) => (
              <option key={reason.id} value={reason.id}>
                {reason.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <span className="min-w-[220px] pt-2 text-sm font-medium text-[#333]">
            Коментар
          </span>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Введіть текст..."
            rows={4}
            className="w-full max-w-[520px] resize-none rounded-[4px] border border-[#d5d5d5] bg-[#f4f4f4] px-3 py-2 text-sm text-[#333] outline-none placeholder:text-[#8a8a8a] focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[#8a8a8a]">
                <th className="px-2 py-2 font-normal">Найменування</th>
                <th className="px-2 py-2 font-normal">Фасування</th>
                <th className="px-2 py-2 font-normal">Кількість</th>
                <th className="px-2 py-2 font-normal">Деталі</th>
                <th className="w-8" />
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-2 py-2">
                    <select
                      value={row.productId ?? ''}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'productId',
                          event.target.value
                            ? Number(event.target.value)
                            : null,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">Виберіть...</option>

                      {(products ?? []).map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-2 py-2">
                    <select
                      value={row.packagingId ?? ''}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'packagingId',
                          event.target.value
                            ? Number(event.target.value)
                            : null,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">Виберіть...</option>

                      {(packagings ?? []).map((packaging) => (
                        <option key={packaging.id} value={packaging.id}>
                          {packaging.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.quantity}
                      onChange={(event) =>
                        updateRow(row.id, 'quantity', event.target.value)
                      }
                      className={inputClass}
                    />
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={row.details}
                      onChange={(event) =>
                        updateRow(row.id, 'details', event.target.value)
                      }
                      className={inputClass}
                    />
                  </td>

                  <td className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label="Видалити рядок"
                      className="text-[#8a8a8a] transition-colors hover:text-[#e31b23]"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="w-fit text-sm font-medium text-primary underline transition-colors hover:text-primary-dark"
        >
          + Додати ще
        </button>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="h-[48px] w-full max-w-[240px] rounded-[4px] bg-primary text-base font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </form>
    </AdminPageLayout>
  )
}
