import { mockAttributes } from '../mocks/attributes'
import type { Attribute } from '../../../types/attribute'

const API_DELAY_MS = 500

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export const attributeService = {
  async getAll(): Promise<Attribute[]> {
    await delay(API_DELAY_MS)

    return mockAttributes.map((attribute) => ({ ...attribute }))
  },
}
