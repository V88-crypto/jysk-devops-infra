import { mockCategories } from '@/features/components/adminPanel/mocks/categories'
import type { Category } from '@/features/types/category'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const categoryService = {
  async getAll(): Promise<Category[]> {
    await mockDelay(API_DELAY_MS)

    return mockCategories.map((category) => ({ ...category }))
  },
}
