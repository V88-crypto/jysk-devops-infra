import { mockPackagings } from '@/features/admin/mocks/packagings'
import type { Packaging } from '@/features/admin/types/warehouseDocs'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const packagingService = {
  async getAll(): Promise<Packaging[]> {
    await mockDelay(API_DELAY_MS)

    return mockPackagings.map((packaging) => ({ ...packaging }))
  },
}
