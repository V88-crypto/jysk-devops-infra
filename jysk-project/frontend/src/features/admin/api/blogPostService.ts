import { mapBlogPost, nullIfNotFound } from '@/shared/api/blogApi'
import type { BlogPostResponse, ListResponse } from '@/shared/api/blogApi'
import { apiRequest } from '@/shared/api/httpClient'
import type { BlogContentBlock, BlogPost } from '@/shared/types/blog'

// The backend caps page_size at 100.
const PAGE_SIZE = 100

export interface BlogPostInput {
  title: string
  categoryId: number
  description: string | null
  imageUrl: string
  imageAlt: string
  keywords: string[]
  isPublished: boolean
  contentBlocks: BlogContentBlock[]
}

const toBlockBody = (block: BlogContentBlock) =>
  block.type === 'gallery'
    ? { type: 'gallery', images: block.images }
    : { type: 'text', title: block.title || null, body: block.body || null }

const toPostBody = (input: BlogPostInput) =>
  JSON.stringify({
    title: input.title,
    category_id: input.categoryId,
    // Without a description the backend builds one from the first text block.
    description: input.description || null,
    image_url: input.imageUrl,
    image_alt: input.imageAlt || null,
    keywords: input.keywords,
    is_published: input.isPublished,
    content_blocks: input.contentBlocks.map(toBlockBody),
  })

export const blogPostService = {
  async getAll(): Promise<BlogPost[]> {
    const response = await apiRequest<ListResponse<BlogPostResponse>>(
      `/admin/blog-posts?page_size=${PAGE_SIZE}`,
    )

    return response.items.map(mapBlogPost)
  },

  getById(id: number): Promise<BlogPost | null> {
    return apiRequest<BlogPostResponse>(`/admin/blog-posts/${id}`)
      .then(mapBlogPost)
      .catch(nullIfNotFound)
  },

  async create(input: BlogPostInput): Promise<BlogPost> {
    return mapBlogPost(
      await apiRequest<BlogPostResponse>('/admin/blog-posts', {
        method: 'POST',
        body: toPostBody(input),
      }),
    )
  },

  async update(id: number, input: BlogPostInput): Promise<BlogPost> {
    return mapBlogPost(
      await apiRequest<BlogPostResponse>(`/admin/blog-posts/${id}`, {
        method: 'PUT',
        body: toPostBody(input),
      }),
    )
  },

  delete(id: number): Promise<void> {
    return apiRequest<void>(`/admin/blog-posts/${id}`, { method: 'DELETE' })
  },
}
