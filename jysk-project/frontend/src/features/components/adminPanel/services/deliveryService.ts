import { mockDeliveries } from '@/features/components/adminPanel/mocks/deliveries'
import type { Delivery } from '@/features/types/warehouseDocs'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const deliveryService = {
  async getAll(): Promise<Delivery[]> {
    await mockDelay(API_DELAY_MS)

    return mockDeliveries.map((delivery) => ({ ...delivery }))
  },

  async create(delivery: Omit<Delivery, 'id' | 'number'>): Promise<Delivery> {
    await mockDelay(API_DELAY_MS)

    const maxId = mockDeliveries.reduce((max, item) => Math.max(max, item.id), 0)

    const createdDelivery: Delivery = {
      ...delivery,
      id: maxId + 1,
      number: String(100 + maxId + 1),
    }

    mockDeliveries.unshift(createdDelivery)

    return { ...createdDelivery }
  },
}
