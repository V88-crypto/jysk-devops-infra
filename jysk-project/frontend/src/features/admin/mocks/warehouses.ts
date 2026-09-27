import type { Warehouse } from '@/features/admin/types/stock'

export const mockWarehouses: Warehouse[] = [
  { id: 1, name: 'Склад №1 (Київ)', address: 'вул. Промислова, 12, Київ' },
  { id: 2, name: 'Склад №2 (Львів)', address: 'вул. Городоцька, 45, Львів' },
  {
    id: 3,
    name: 'Загальний склад',
    address: 'Північний бульвар, 2а, Івано-Франківськ',
  },
]
