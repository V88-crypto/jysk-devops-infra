import { mockClients } from '../mocks/clients'
import type { Client } from '../../../types/client'
import { mockDelay } from '../../../../shared/api/mockDelay'

const API_DELAY_MS = 500

export const clientService = {
  async getAll(): Promise<Client[]> {
    await mockDelay(API_DELAY_MS)

    return mockClients.map((client) => ({ ...client }))
  },

  async delete(id: number): Promise<void> {
    await mockDelay(API_DELAY_MS)

    const clientIndex = mockClients.findIndex((item) => item.id === id)

    if (clientIndex === -1) {
      throw new Error(`Client with id ${id} was not found`)
    }

    mockClients.splice(clientIndex, 1)
  },
}
