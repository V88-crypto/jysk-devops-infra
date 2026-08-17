import { mockCategories } from '../mocks/categories'
import type { Category } from '../../../types/category'

const API_DELAY_MS = 500

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    await delay(API_DELAY_MS)

    return mockCategories.map((category) => ({ ...category }))
  },
}
