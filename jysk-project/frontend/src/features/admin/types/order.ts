import type { OrderStatus } from '@/shared/orders/orderStatus'

export interface AdminOrderItem {
  id: number
  sku: string
  productName: string
  quantity: number
  price: number
}

export interface AdminOrder {
  id: number
  status: OrderStatus
  totalPrice: number
  createdAt: string
  customerName: string
  customerEmail: string
  address: string
  items: AdminOrderItem[]
}
