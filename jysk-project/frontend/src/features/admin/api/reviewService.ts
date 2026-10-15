import type { PageResult } from '@/features/admin/hooks/usePagedData'
import type { Review } from '@/features/admin/types/review'
import { apiRequest } from '@/shared/api/httpClient'

interface ReviewResponse {
  id: number
  rating: number
  comment: string | null
  created_at: string
  user: {
    first_name: string
    last_name: string
  }
  variant: {
    sku: string
    product_name: string
  }
}

interface ReviewListResponse {
  items: ReviewResponse[]
  total: number
}

export const reviewService = {
  async getPage(page: number, pageSize: number): Promise<PageResult<Review>> {
    const response = await apiRequest<ReviewListResponse>(
      `/admin/reviews?page=${page}&page_size=${pageSize}`,
    )

    return {
      total: response.total,
      items: response.items.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        authorName: `${review.user.first_name} ${review.user.last_name}`,
        productName: review.variant.product_name,
        sku: review.variant.sku,
      })),
    }
  },

  delete(id: number): Promise<void> {
    return apiRequest<void>(`/admin/reviews/${id}`, { method: 'DELETE' })
  },
}
