import { mockAttributes } from '../mocks/attributes'
import type { Attribute } from '../../../types/attribute'
import { mockDelay } from '../../../../shared/api/mockDelay'

const API_DELAY_MS = 500

export const attributeService = {
  async getAll(): Promise<Attribute[]> {
    await mockDelay(API_DELAY_MS)

    return mockAttributes.map((attribute) => ({ ...attribute }))
  },
}
