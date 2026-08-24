import { mockClientGroups } from '../mocks/clientGroups'
import type { ClientGroup } from '../../../types/client'
import { mockDelay } from '../../../../shared/api/mockDelay'

const API_DELAY_MS = 500

export const clientGroupService = {
  async getAll(): Promise<ClientGroup[]> {
    await mockDelay(API_DELAY_MS)

    return mockClientGroups.map((group) => ({ ...group }))
  },
}
