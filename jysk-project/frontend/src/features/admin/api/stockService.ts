import { mockStockItems } from '@/features/admin/mocks/stock'
import type { StockItem } from '@/features/admin/types/stock'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const stockService = {
  async getAll(): Promise<StockItem[]> {
    await mockDelay(API_DELAY_MS)

    return mockStockItems.map((item) => ({ ...item }))
  },
}
