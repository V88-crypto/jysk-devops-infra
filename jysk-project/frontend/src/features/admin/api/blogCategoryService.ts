import type { ListResponse } from '@/shared/api/blogApi'
import { apiRequest } from '@/shared/api/httpClient'
import type { BlogCategory } from '@/shared/types/blog'

export const blogCategoryService = {
  async getAll(): Promise<BlogCategory[]> {
    const response = await apiRequest<ListResponse<BlogCategory>>(
      '/admin/blog-categories',
    )

    return response.items
  },
}
