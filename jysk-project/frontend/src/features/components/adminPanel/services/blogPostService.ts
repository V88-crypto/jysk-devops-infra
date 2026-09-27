import { mockAdminBlogPosts } from '@/features/components/adminPanel/mocks/blogPosts'
import type { BlogPost } from '@/features/types/homePage'
import { mockDelay } from '@/shared/api/mockDelay'

const API_DELAY_MS = 500

export const blogPostService = {
  async getAll(): Promise<BlogPost[]> {
    await mockDelay(API_DELAY_MS)

    return mockAdminBlogPosts.map((post) => ({ ...post }))
  },

  async getById(id: number): Promise<BlogPost | null> {
    await mockDelay(API_DELAY_MS)

    const post = mockAdminBlogPosts.find((item) => item.id === id)

    return post ? { ...post } : null
  },

  async update(post: BlogPost): Promise<BlogPost> {
    await mockDelay(API_DELAY_MS)

    const postIndex = mockAdminBlogPosts.findIndex(
      (item) => item.id === post.id,
    )

    if (postIndex === -1) {
      throw new Error(`Blog post with id ${post.id} was not found`)
    }

    mockAdminBlogPosts[postIndex] = { ...post }

    return { ...post }
  },

  async delete(id: number): Promise<void> {
    await mockDelay(API_DELAY_MS)

    const postIndex = mockAdminBlogPosts.findIndex((item) => item.id === id)

    if (postIndex === -1) {
      throw new Error(`Blog post with id ${id} was not found`)
    }

    mockAdminBlogPosts.splice(postIndex, 1)
  },
}
