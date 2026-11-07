import { ApiError, apiRequest } from './httpClient'
import type {
  BlogCategory,
  BlogContentBlock,
  BlogPost,
} from '@/shared/types/blog'

// The backend caps page_size at 100.
const MAX_PAGE_SIZE = 100

export interface ListResponse<T> {
  items: T[]
  total: number
}

export interface BlogContentBlockResponse {
  id: number
  type: BlogContentBlock['type']
  title: string | null
  body: string | null
  sort_order: number
  images: string[]
}

export interface BlogPostResponse {
  id: number
  slug: string
  title: string
  description: string | null
  image_url: string
  image_alt: string | null
  category: BlogCategory
  keywords: string[]
  is_published: boolean
  content_blocks?: BlogContentBlockResponse[]
}

const mapContentBlock = (
  block: BlogContentBlockResponse,
): BlogContentBlock => ({
  id: block.id,
  type: block.type,
  images: block.images,
  title: block.title ?? '',
  body: block.body ?? '',
})

export const mapBlogPost = (post: BlogPostResponse): BlogPost => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  description: post.description ?? '',
  imageUrl: post.image_url,
  imageAlt: post.image_alt ?? '',
  category: post.category.name,
  categoryId: post.category.id,
  keywords: post.keywords,
  isPublished: post.is_published,
  contentBlocks: post.content_blocks
    ?.slice()
    .sort((first, second) => first.sort_order - second.sort_order)
    .map(mapContentBlock),
})

// A missing post is a normal answer for detail pages, not an error.
export const nullIfNotFound = (error: unknown): null => {
  if (error instanceof ApiError && error.status === 404) {
    return null
  }

  throw error
}

export const blogApi = {
  async getCategories(): Promise<BlogCategory[]> {
    const response =
      await apiRequest<ListResponse<BlogCategory>>('/blog-categories')

    return response.items
  },

  async getPosts(pageSize = MAX_PAGE_SIZE): Promise<BlogPost[]> {
    const response = await apiRequest<ListResponse<BlogPostResponse>>(
      `/blog-posts?page_size=${pageSize}`,
    )

    return response.items.map(mapBlogPost)
  },

  getPost(idOrSlug: string): Promise<BlogPost | null> {
    return apiRequest<BlogPostResponse>(
      `/blog-posts/${encodeURIComponent(idOrSlug)}`,
    )
      .then(mapBlogPost)
      .catch(nullIfNotFound)
  },
}
