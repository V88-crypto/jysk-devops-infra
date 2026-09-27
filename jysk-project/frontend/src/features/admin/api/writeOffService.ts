import { mockWriteOffs } from '@/features/admin/mocks/writeOffs'
import type { WriteOff } from '@/features/admin/types/warehouseDocs'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const writeOffService = {
  async getAll(): Promise<WriteOff[]> {
    await mockDelay(API_DELAY_MS)

    return mockWriteOffs.map((writeOff) => ({ ...writeOff }))
  },

  async create(writeOff: Omit<WriteOff, 'id' | 'number'>): Promise<WriteOff> {
    await mockDelay(API_DELAY_MS)

    const maxId = mockWriteOffs.reduce((max, item) => Math.max(max, item.id), 0)

    const createdWriteOff: WriteOff = {
      ...writeOff,
      id: maxId + 1,
      number: String(100 + maxId + 1),
    }

    mockWriteOffs.unshift(createdWriteOff)

    return { ...createdWriteOff }
  },
}
