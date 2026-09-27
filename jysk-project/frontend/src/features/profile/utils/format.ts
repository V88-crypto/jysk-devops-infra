import type { OrderStatus } from '@/features/profile/types'

export const formatPrice = (value: number) =>
  `${value.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} грн`

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('uk-UA')

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
