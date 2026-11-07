import type { PageResult } from '@/features/admin/hooks/usePagedData'
import type { AdminOrder } from '@/features/admin/types/order'
import { apiRequest } from '@/shared/api/httpClient'
import { formatOrderAddress } from '@/shared/orders/orderAddress'
import type { OrderDeliveryResponse } from '@/shared/orders/orderAddress'
import type { OrderStatus } from '@/shared/orders/orderStatus'

interface OrderResponse extends OrderDeliveryResponse {
  id: number
  status: OrderStatus
  total_price: number
  created_at: string
  user: {
    first_name: string
    last_name: string
    email: string
  }
  items: {
    id: number
    sku: string
    product_name: string
    quantity: number
    price: number
  }[]
}

interface OrderListResponse {
  items: OrderResponse[]
  total: number
}

const toOrder = (order: OrderResponse): AdminOrder => ({
  id: order.id,
  status: order.status,
  totalPrice: order.total_price,
  createdAt: order.created_at,
  customerName: `${order.user.first_name} ${order.user.last_name}`,
  customerEmail: order.user.email,
  address: formatOrderAddress(order),
  items: order.items.map((item) => ({
    id: item.id,
    sku: item.sku,
    productName: item.product_name,
    quantity: item.quantity,
    price: item.price,
  })),
})

export const orderService = {
  async getPage(
    page: number,
    pageSize: number,
    status: OrderStatus | null,
  ): Promise<PageResult<AdminOrder>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })

    if (status) {
      params.set('status', status)
    }

    const response = await apiRequest<OrderListResponse>(
      `/admin/orders?${params}`,
    )

    return { items: response.items.map(toOrder), total: response.total }
  },

  async updateStatus(id: number, status: OrderStatus): Promise<AdminOrder> {
    return toOrder(
      await apiRequest<OrderResponse>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    )
  },
}
