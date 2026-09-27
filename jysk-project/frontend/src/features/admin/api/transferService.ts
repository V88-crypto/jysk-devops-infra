import { mockTransfers } from '@/features/admin/mocks/transfers'
import type { Transfer } from '@/features/admin/types/warehouseDocs'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const transferService = {
  async getAll(): Promise<Transfer[]> {
    await mockDelay(API_DELAY_MS)

    return mockTransfers.map((transfer) => ({ ...transfer }))
  },

  async create(transfer: Omit<Transfer, 'id'>): Promise<Transfer> {
    await mockDelay(API_DELAY_MS)

    const maxId = mockTransfers.reduce((max, item) => Math.max(max, item.id), 0)

    const createdTransfer: Transfer = {
      ...transfer,
      id: maxId + 1,
    }

    mockTransfers.unshift(createdTransfer)

    return { ...createdTransfer }
  },
}
