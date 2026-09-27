import { blogCatalog, blogRoomFilters } from '@/features/blogPage/mocks/blogCatalog'
import type { BlogPost } from '@/features/types/homePage'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 400

export const blogPageService = {
  async getCatalog(): Promise<BlogPost[]> {
    await mockDelay(API_DELAY_MS)

    return blogCatalog.map((post) => ({ ...post }))
  },

  async getPostById(id: number): Promise<BlogPost | null> {
    await mockDelay(API_DELAY_MS)

    const post = blogCatalog.find((item) => item.id === id)

    return post ? { ...post } : null
  },

  async getRoomFilters() {
    await mockDelay(API_DELAY_MS)

    return blogRoomFilters.map((item) => ({ ...item }))
  },
}
