import { mockStores } from '@/features/components/adminPanel/mocks/stores'
import type { Store } from '@/features/types/store'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const storeService = {
  async getAll(): Promise<Store[]> {
    await mockDelay(API_DELAY_MS)

    return mockStores.map((store) => ({ ...store }))
  },

  async getById(id: number): Promise<Store | null> {
    await mockDelay(API_DELAY_MS)

    const store = mockStores.find((item) => item.id === id)

    return store ? { ...store } : null
  },

  async update(store: Store): Promise<Store> {
    await mockDelay(API_DELAY_MS)

    const storeIndex = mockStores.findIndex((item) => item.id === store.id)

    if (storeIndex === -1) {
      throw new Error(`Store with id ${store.id} was not found`)
    }

    mockStores[storeIndex] = { ...store }

    return { ...store }
  },
}
