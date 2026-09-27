import { mockStockItems } from '@/features/components/adminPanel/mocks/stock'
import type { StockItem } from '@/features/types/stock'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const stockService = {
  async getAll(): Promise<StockItem[]> {
    await mockDelay(API_DELAY_MS)

    return mockStockItems.map((item) => ({ ...item }))
  },
}
