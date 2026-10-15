import { Fragment, useCallback, useState } from 'react'

import { orderService } from '@/features/admin/api/orderService'
import type { AdminOrder } from '@/features/admin/types/order'
import { usePagedData } from '@/features/admin/hooks/usePagedData'
import {
  ORDER_STATUSES,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '@/shared/orders/orderStatus'
import type { OrderStatus } from '@/shared/orders/orderStatus'

import { FilterDropdown } from '@/features/admin/components/common/FilterDropdown'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'
import { Pagination } from '@/features/admin/components/common/Pagination'

const PAGE_SIZE = 20

const STATUS_OPTIONS = ORDER_STATUSES.map((status) => ({
  id: status,
  name: ORDER_STATUS_LABELS[status],
}))

const formatPrice = (price: number) =>
  `${price.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} ₴`

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('uk-UA')

export const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const loadPage = useCallback(
    (page: number) => orderService.getPage(page, PAGE_SIZE, statusFilter),
    [statusFilter],
  )
  const { page, setPage, data, error, isLoading, reload, updateItems } =
    usePagedData(loadPage)

  const orders = data?.items ?? []
  const total = data?.total ?? 0

  const handleFilterChange = (status: OrderStatus | null) => {
    setStatusFilter(status)
    setPage(1)
  }

  const handleStatusChange = async (order: AdminOrder, status: OrderStatus) => {
    if (
      status === 'cancelled' &&
      !window.confirm(`Скасувати замовлення №${order.id}?`)
    ) {
      return
    }

    setUpdatingId(order.id)
    setActionError(null)

    try {
      const updated = await orderService.updateStatus(order.id, status)

      if (statusFilter && statusFilter !== updated.status) {
        reload()
      } else {
        updateItems((items) =>
          items.map((item) => (item.id === updated.id ? updated : item)),
        )
      }
    } catch {
      setActionError(`Не вдалося змінити статус замовлення №${order.id}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const renderStatus = () => {
    if (error) {
      return (
        <p className="px-4 py-10 text-center text-[#d33]">
          Не вдалося завантажити замовлення
        </p>
      )
    }

    if (!data) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">Завантаження...</p>
      )
    }

    if (orders.length === 0) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">
          {statusFilter
            ? 'Замовлень з таким статусом немає'
            : 'Замовлень поки немає'}
        </p>
      )
    }

    return null
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Замовлення</h1>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
          {total}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
        <FilterDropdown
          label={statusFilter ? ORDER_STATUS_LABELS[statusFilter] : 'Статус'}
          options={STATUS_OPTIONS}
          selectedId={statusFilter}
          onSelect={handleFilterChange}
        />
      </div>

      {actionError && (
        <p className="mb-4 rounded-md bg-[#fdecec] px-4 py-3 text-sm text-[#d33]">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table
          className={`w-full min-w-[860px] border-collapse text-left text-sm transition-opacity ${
            isLoading && data ? 'opacity-60' : ''
          }`}
        >
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">№</th>
              <th className="px-4 py-3 font-normal">Дата</th>
              <th className="px-4 py-3 font-normal">Клієнт</th>
              <th className="px-4 py-3 font-normal">Товарів</th>
              <th className="px-4 py-3 font-normal">Сума</th>
              <th className="px-4 py-3 font-normal">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const isExpanded = expandedId === order.id
              const itemCount = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              )

              return (
                <Fragment key={order.id}>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="px-4 py-3 font-medium">№{order.id}</td>
                    <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <p>{order.customerName}</p>
                      <p className="text-xs text-[#8a8a8a]">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3">{itemCount} шт.</td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        aria-label={`Статус замовлення №${order.id}`}
                        onChange={(event) =>
                          void handleStatusChange(
                            order,
                            event.target.value as OrderStatus,
                          )
                        }
                        className={`h-[34px] rounded-[4px] border border-[#d5d5d5] bg-[#f4f4f4] px-2 text-sm font-medium outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="text-[#333]"
                          >
                            {ORDER_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : order.id)
                        }
                        aria-expanded={isExpanded}
                        className="text-primary underline transition-colors hover:text-primary-dark"
                      >
                        {isExpanded ? 'Сховати' : 'Деталі'}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
                      <td colSpan={7} className="px-4 py-4">
                        <p className="mb-3 text-[#555]">
                          Адреса доставки: {order.address}
                        </p>

                        <table className="w-full text-sm">
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td className="py-1 pr-4">
                                  {item.productName}
                                </td>
                                <td className="py-1 pr-4 text-[#8a8a8a]">
                                  {item.sku}
                                </td>
                                <td className="py-1 pr-4">
                                  {item.quantity} × {formatPrice(item.price)}
                                </td>
                                <td className="py-1 text-right font-medium">
                                  {formatPrice(item.quantity * item.price)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>

        {renderStatus()}
      </div>

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </AdminPageLayout>
  )
}
