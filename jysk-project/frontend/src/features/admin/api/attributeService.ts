import { mockAttributes } from '@/features/admin/mocks/attributes'
import type { Attribute } from '@/features/admin/types/attribute'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const attributeService = {
  async getAll(): Promise<Attribute[]> {
    await mockDelay(API_DELAY_MS)

    return mockAttributes.map((attribute) => ({ ...attribute }))
  },
}
