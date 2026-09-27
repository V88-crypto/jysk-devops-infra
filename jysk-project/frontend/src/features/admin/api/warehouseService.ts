import { mockWarehouses } from '@/features/admin/mocks/warehouses'
import type { Warehouse } from '@/features/admin/types/stock'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const warehouseService = {
  async getAll(): Promise<Warehouse[]> {
    await mockDelay(API_DELAY_MS)

    return mockWarehouses.map((warehouse) => ({ ...warehouse }))
  },
}
