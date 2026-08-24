import { mockWriteOffReasons } from '../mocks/writeOffReasons'
import type { WriteOffReason } from '../../../types/warehouseDocs'
import { mockDelay } from '../../../../shared/api/mockDelay'

const API_DELAY_MS = 500

export const writeOffReasonService = {
  async getAll(): Promise<WriteOffReason[]> {
    await mockDelay(API_DELAY_MS)

    return mockWriteOffReasons.map((reason) => ({ ...reason }))
  },
}
