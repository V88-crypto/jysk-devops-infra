import { useState } from 'react'
import type { FormEvent } from 'react'

import { productService } from '@/features/admin/api/productService'
import { packagingService } from '@/features/admin/api/packagingService'
import { supplierService } from '@/features/admin/api/supplierService'
import { warehouseService } from '@/features/admin/api/warehouseService'
import { deliveryService } from '@/features/admin/api/deliveryService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { DateTimeFields } from '@/features/admin/components/common/DateTimeFields'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'
import { useDateTimeValue } from '@/features/admin/hooks/useDateTimeValue'
import { useLineItemRows } from '@/features/admin/hooks/useLineItemRows'

import {
  createEmptyDeliveryLineItemRow,
  getDeliveryLineItemSumWithoutTax,
  getDeliveryLineItemTotalSum,
} from './types'
import type { DeliveryLineItemRow } from './types'

interface AddDeliveryFormProps {
  onBack: () => void
  onSaved: () => void
}

const fieldClass =
  'h-[44px] w-full rounded-[4px] border border-[#d5d5d5] bg-[#f4f4f4] px-3 text-sm text-[#333] outline-none focus:border-primary'

const inputClass =
  'h-[40px] w-full rounded-[4px] border border-[#d5d5d5] bg-[#f4f4f4] px-2 text-sm text-[#333] outline-none focus:border-primary'

export const AddDeliveryForm = ({ onBack, onSaved }: AddDeliveryFormProps) => {
  const { data: products } = useAsyncData(productService.getAll)
  const { data: packagings } = useAsyncData(packagingService.getAll)
  const { data: suppliers } = useAsyncData(supplierService.getAll)
  const { data: warehouses } = useAsyncData(warehouseService.getAll)

  const { date, setDate, hour, setHour, minute, setMinute, toISOString } =
    useDateTimeValue()

  const [supplierId, setSupplierId] = useState<number | null>(null)
  const [warehouseId, setWarehouseId] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { rows, updateRow, addRow, removeRow } =
    useLineItemRows<DeliveryLineItemRow>(createEmptyDeliveryLineItemRow)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const supplier = suppliers?.find((item) => item.id === supplierId)
    const warehouse = warehouses?.find((item) => item.id === warehouseId)

    if (!supplier || !warehouse) {
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

    const totalSum = rows.reduce(
      (sum, row) => sum + getDeliveryLineItemTotalSum(row),
      0,
    )

    setIsSaving(true)

    try {
      await deliveryService.create({
        date: toISOString(),
        supplierId: supplier.id,
        supplierName: supplier.name,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        categoryId,
        productsSummary: productsSummary || 'Без товарів',
        comment,
        invoiceNumber: `Рахунок №${1200 + Math.floor(Math.random() * 100)}`,
        status: 'unpaid',
        totalSum,
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
        <span className="text-lg">‹</span> Додавання постачання
      </button>

      <div className="mb-6 border-t border-[#e0e0e0]" />

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="flex flex-col gap-6"
      >
        <DateTimeFields
          label="Дата та час постачання"
          date={date}
          hour={hour}
          minute={minute}
          onDateChange={setDate}
          onHourChange={setHour}
          onMinuteChange={setMinute}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <span className="min-w-[220px] text-sm font-medium text-[#333]">
            Постачальник
          </span>

          <select
            value={supplierId ?? ''}
            onChange={(event) =>
              setSupplierId(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            className={`${fieldClass} sm:w-[320px]`}
          >
            <option value="">Виберіть...</option>

            {(suppliers ?? []).map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

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
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[#8a8a8a]">
                <th className="px-2 py-2 font-normal">Найменування</th>
                <th className="px-2 py-2 font-normal">Фасування</th>
                <th className="px-2 py-2 font-normal">Кількість</th>
                <th className="w-6" />
                <th className="px-2 py-2 font-normal">Ціна за одиницю</th>
                <th className="w-6" />
                <th className="px-2 py-2 font-normal">Сума без податку</th>
                <th className="w-6" />
                <th className="px-2 py-2 font-normal">Податок, %</th>
                <th className="w-6" />
                <th className="px-2 py-2 font-normal">Загальна сума</th>
                <th className="w-8" />
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const sumWithoutTax = getDeliveryLineItemSumWithoutTax(row)
                const totalSum = getDeliveryLineItemTotalSum(row)

                return (
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
                        value={row.unitPrice}
                        onChange={(event) =>
                          updateRow(row.id, 'unitPrice', event.target.value)
                        }
                        className={inputClass}
                      />
                    </td>

                    <td className="text-center text-[#8a8a8a]">=</td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        readOnly
                        value={sumWithoutTax.toFixed(2)}
                        className={`${inputClass} bg-[#ececec] text-[#666]`}
                      />
                    </td>

                    <td className="text-center text-[#8a8a8a]">×</td>

                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        value={row.taxRate}
                        onChange={(event) =>
                          updateRow(row.id, 'taxRate', event.target.value)
                        }
                        className={inputClass}
                      />
                    </td>

                    <td className="text-center text-[#8a8a8a]">=</td>

                    <td className="px-2 py-2">
                      <input
                        type="text"
                        readOnly
                        value={totalSum.toFixed(2)}
                        className={`${inputClass} bg-[#ececec] text-[#666]`}
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
                )
              })}
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
