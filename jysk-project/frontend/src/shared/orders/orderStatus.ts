export const ORDER_STATUSES = [
  'new',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Нове',
  processing: 'В обробці',
  shipped: 'Відправлено',
  delivered: 'Доставлено',
  cancelled: 'Скасовано',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'text-[#e08a00]',
  processing: 'text-primary',
  shipped: 'text-primary',
  delivered: 'text-[#22aa00]',
  cancelled: 'text-[#e31b23]',
}
