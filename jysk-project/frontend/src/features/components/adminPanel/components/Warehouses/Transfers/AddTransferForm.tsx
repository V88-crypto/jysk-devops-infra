import { useState } from 'react'
import type { FormEvent } from 'react'

import { productService } from '@/features/components/adminPanel/services/productService'
import { packagingService } from '@/features/components/adminPanel/services/packagingService'
import { warehouseService } from '@/features/components/adminPanel/services/warehouseService'
import { transferService } from '@/features/components/adminPanel/services/transferService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { DateTimeFields } from '@/features/components/adminPanel/components/common/DateTimeFields'
import { AdminPageLayout } from '@/features/components/adminPanel/components/common/AdminPageLayout'
import { useDateTimeValue } from '@/features/components/adminPanel/hooks/useDateTimeValue'
import { useLineItemRows } from '@/features/components/adminPanel/hooks/useLineItemRows'

import { createEmptyTransferLineItemRow } from './types'
import type { TransferLineItemRow } from './types'

interface AddTransferFormProps {
  onBack: () => void
  onSaved: () => void
}

const fieldClass =
  'h-[44px] w-full rounded-[4px] border border-[#d5d5d5] bg-[#f4f4f4] px-3 text-sm text-[#333] outline-none focus:border-primary'

const inputClass =
  'h-[40px] w-full rounded-[4px] border border-[#d5d5d5] bg-[#f4f4f4] px-2 text-sm text-[#333] outline-none focus:border-primary'

export const AddTransferForm = ({ onBack, onSaved }: AddTransferFormProps) => {
  const { data: products } = useAsyncData(productService.getAll)
  const { data: packagings } = useAsyncData(packagingService.getAll)
  const { data: warehouses } = useAsyncData(warehouseService.getAll)

  const { date, setDate, hour, setHour, minute, setMinute, toISOString } =
    useDateTimeValue()

  const [fromWarehouseId, setFromWarehouseId] = useState<number | null>(null)
  const [toWarehouseId, setToWarehouseId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { rows, updateRow, addRow, removeRow } =
    useLineItemRows<TransferLineItemRow>(createEmptyTransferLineItemRow)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fromWarehouse = warehouses?.find(
      (item) => item.id === fromWarehouseId,
    )
    const toWarehouse = warehouses?.find((item) => item.id === toWarehouseId)

    if (!fromWarehouse || !toWarehouse) {
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

    const totalSum = rows.reduce(
      (sum, row) => sum + (Number(row.sum.replace(',', '.')) || 0),
      0,
    )

    setIsSaving(true)

    try {
      await transferService.create({
        date: toISOString(),
        productsSummary: productsSummary || 'Без товарів',
        sum: totalSum,
        employeeName: "Ім'я",
        fromWarehouseId: fromWarehouse.id,
        fromWarehouseName: fromWarehouse.name,
        toWarehouseId: toWarehouse.id,
        toWarehouseName: toWarehouse.name,
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
        <span className="text-lg">‹</span> Переміщення товарів
      </button>

      <div className="mb-6 border-t border-[#e0e0e0]" />

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="flex flex-col gap-6"
      >
        <DateTimeFields
          label="Дата та час переміщення"
          date={date}
          hour={hour}
          minute={minute}
          onDateChange={setDate}
          onHourChange={setHour}
          onMinuteChange={setMinute}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <span className="min-w-[220px] text-sm font-medium text-[#333]">
            Зі складу
          </span>

          <select
            value={fromWarehouseId ?? ''}
            onChange={(event) =>
              setFromWarehouseId(
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
            На склад
          </span>

          <select
            value={toWarehouseId ?? ''}
            onChange={(event) =>
              setToWarehouseId(
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

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <span className="min-w-[220px] pt-2 text-sm font-medium text-[#333]">
            Коментар
          </span>

          <textarea
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
                <th className="w-6" />
                <th className="px-2 py-2 font-normal">Сума</th>
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

                  <td className="text-center text-[#8a8a8a]">×</td>

                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.sum}
                      onChange={(event) =>
                        updateRow(row.id, 'sum', event.target.value)
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
