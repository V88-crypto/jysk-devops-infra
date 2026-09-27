import { mockBlogCategories } from '@/features/admin/mocks/blogCategories'
import type { BlogCategory } from '@/features/admin/mocks/blogCategories'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const blogCategoryService = {
  async getAll(): Promise<BlogCategory[]> {
    await mockDelay(API_DELAY_MS)

    return mockBlogCategories.map((category) => ({ ...category }))
  },
}
