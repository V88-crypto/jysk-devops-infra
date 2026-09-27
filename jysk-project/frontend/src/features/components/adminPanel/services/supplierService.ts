import { mockSuppliers } from '@/features/components/adminPanel/mocks/suppliers'
import type { Supplier } from '@/features/types/warehouseDocs'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    await mockDelay(API_DELAY_MS)

    return mockSuppliers.map((supplier) => ({ ...supplier }))
  },
}
