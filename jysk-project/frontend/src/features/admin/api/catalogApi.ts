import type { Attribute } from '@/features/admin/types/attribute'
import type { Category } from '@/features/admin/types/category'
import { apiRequest } from '@/shared/api/httpClient'

interface ListResponse<T> {
  items: T[]
}

interface CategoryResponse {
  id: number
  name: string
  slug: string
  parent_id: number | null
}

export const catalogApi = {
  async getCategories(): Promise<Category[]> {
    const response =
      await apiRequest<ListResponse<CategoryResponse>>('/admin/categories')

    return response.items.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parent_id,
    }))
  },

  async getAttributes(): Promise<Attribute[]> {
    const response =
      await apiRequest<ListResponse<Attribute>>('/admin/attributes')

    return response.items
  },
}
