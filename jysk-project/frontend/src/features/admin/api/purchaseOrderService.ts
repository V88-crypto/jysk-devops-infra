import { mockPurchaseOrders } from '@/features/admin/mocks/purchaseOrders'
import type { PurchaseOrder } from '@/features/admin/types/purchaseOrder'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const purchaseOrderService = {
  async getAll(): Promise<PurchaseOrder[]> {
    await mockDelay(API_DELAY_MS)

    return mockPurchaseOrders.map((order) => ({ ...order }))
  },
}
