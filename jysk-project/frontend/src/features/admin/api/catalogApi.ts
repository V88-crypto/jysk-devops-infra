import type { Attribute } from '@/features/admin/types/attribute'
import type { Category, CategoryInput } from '@/features/admin/types/category'
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

const mapCategory = (category: CategoryResponse): Category => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  parentId: category.parent_id,
})

const toCategoryBody = (input: CategoryInput) =>
  JSON.stringify({
    name: input.name,
    slug: input.slug || null,
    parent_id: input.parentId,
  })

export const catalogApi = {
  async getCategories(): Promise<Category[]> {
    const response =
      await apiRequest<ListResponse<CategoryResponse>>('/admin/categories')

    return response.items.map(mapCategory)
  },

  async createCategory(input: CategoryInput): Promise<Category> {
    const category = await apiRequest<CategoryResponse>('/admin/categories', {
      method: 'POST',
      body: toCategoryBody(input),
    })

    return mapCategory(category)
  },

  async updateCategory(id: number, input: CategoryInput): Promise<Category> {
    const category = await apiRequest<CategoryResponse>(
      `/admin/categories/${id}`,
      { method: 'PUT', body: toCategoryBody(input) },
    )

    return mapCategory(category)
  },

  deleteCategory(id: number): Promise<void> {
    return apiRequest<void>(`/admin/categories/${id}`, { method: 'DELETE' })
  },

  async getAttributes(): Promise<Attribute[]> {
    const response =
      await apiRequest<ListResponse<Attribute>>('/admin/attributes')

    return response.items
  },

  createAttribute(name: string): Promise<Attribute> {
    return apiRequest<Attribute>('/admin/attributes', {
      method: 'POST',
      body: JSON.stringify({ name }),
    })
  },
}
