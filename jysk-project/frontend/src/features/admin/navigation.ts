export type AdminNavItemId =
  | 'products'
  | 'categories'
  | 'warehouses'
  | 'stock'
  | 'deliveries'
  | 'transfers'
  | 'writeOffs'
  | 'stores'
  | 'employees'
  | 'clients'
  | 'orders'
  | 'blogs'
  | 'reviews'

export interface AdminNavItem {
  id: AdminNavItemId
  label: string
}

export const TOP_LEVEL_NAV_ITEMS: AdminNavItem[] = [
  { id: 'products', label: 'Товари' },
  { id: 'categories', label: 'Категорії' },
]

export const WAREHOUSE_NAV_ITEMS: AdminNavItem[] = [
  { id: 'warehouses', label: 'Склади' },
  { id: 'stock', label: 'Залишки' },
  { id: 'deliveries', label: 'Поставки' },
  { id: 'transfers', label: 'Переміщення' },
  { id: 'writeOffs', label: 'Списання' },
]

export const BOTTOM_NAV_ITEMS: AdminNavItem[] = [
  { id: 'stores', label: 'Магазини' },
  { id: 'employees', label: 'Співробітники' },
  { id: 'clients', label: 'Клієнти' },
  { id: 'orders', label: 'Замовлення' },
  { id: 'blogs', label: 'Блоги' },
  { id: 'reviews', label: 'Відгуки' },
]
