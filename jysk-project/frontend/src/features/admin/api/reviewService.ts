import { mockAdminReviews } from '@/features/admin/mocks/reviews'
import type { Review } from '@/features/admin/types/review'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const reviewService = {
  async getAll(): Promise<Review[]> {
    await mockDelay(API_DELAY_MS)

    return mockAdminReviews.map((review) => ({ ...review }))
  },

  async delete(id: number): Promise<void> {
    await mockDelay(API_DELAY_MS)

    const reviewIndex = mockAdminReviews.findIndex((item) => item.id === id)

    if (reviewIndex === -1) {
      throw new Error(`Review with id ${id} was not found`)
    }

    mockAdminReviews.splice(reviewIndex, 1)
  },
}
