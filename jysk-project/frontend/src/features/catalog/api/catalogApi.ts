import type {
  CategoryNode,
  Page,
  ProductDetail,
  ProductReviewList,
  ProductSummary,
} from '@/features/catalog/types'
import { apiRequest } from '@/shared/api/httpClient'

interface ProductListResponse {
  items: {
    id: number
    name: string
    slug: string
    price_from: number | null
    image_url: string | null
  }[]
  total: number
}

interface ProductDetailResponse {
  id: number
  category_id: number
  name: string
  slug: string
  description: string | null
  variants: {
    id: number
    sku: string
    price: number
    stock: number
    images: { image_url: string; sort_order: number }[]
    attributes: { name: string; value: string }[]
  }[]
}

interface ReviewListResponse {
  items: {
    id: number
    rating: number
    comment: string | null
    created_at: string
    author: string
  }[]
  total: number
  average_rating: number
}

interface ProductQuery {
  category?: string
  search?: string
  page: number
  pageSize: number
}

export const catalogApi = {
  getCategories(): Promise<CategoryNode[]> {
    return apiRequest<CategoryNode[]>('/categories')
  },

  async getProducts({
    category,
    search,
    page,
    pageSize,
  }: ProductQuery): Promise<Page<ProductSummary>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })

    if (category) {
      params.set('category', category)
    }

    if (search) {
      params.set('search', search)
    }

    const response = await apiRequest<ProductListResponse>(
      `/products?${params}`,
    )

    return {
      total: response.total,
      items: response.items.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        priceFrom: product.price_from,
        imageUrl: product.image_url,
      })),
    }
  },

  async getProduct(slug: string): Promise<ProductDetail> {
    const product = await apiRequest<ProductDetailResponse>(
      `/products/${encodeURIComponent(slug)}`,
    )

    return {
      id: product.id,
      categoryId: product.category_id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        images: variant.images
          .slice()
          .sort((first, second) => first.sort_order - second.sort_order)
          .map((image) => image.image_url),
        attributes: variant.attributes,
      })),
    }
  },

  async getReviews(slug: string): Promise<ProductReviewList> {
    const response = await apiRequest<ReviewListResponse>(
      `/products/${encodeURIComponent(slug)}/reviews?page_size=100`,
    )

    return {
      total: response.total,
      averageRating: response.average_rating,
      items: response.items.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        author: review.author,
      })),
    }
  },

  createReview(
    variantId: number,
    rating: number,
    comment: string | null,
  ): Promise<void> {
    return apiRequest<void>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, rating, comment }),
    })
  },
}

export const findCategory = (
  categories: CategoryNode[],
  match: (category: CategoryNode) => boolean,
): CategoryNode | null => {
  for (const category of categories) {
    if (match(category)) {
      return category
    }

    const child = findCategory(category.children, match)

    if (child) {
      return child
    }
  }

  return null
}

// Path from the top-level category down to the one with the given id.
export const findCategoryPath = (
  categories: CategoryNode[],
  categoryId: number,
): CategoryNode[] => {
  for (const category of categories) {
    if (category.id === categoryId) {
      return [category]
    }

    const childPath = findCategoryPath(category.children, categoryId)

    if (childPath.length) {
      return [category, ...childPath]
    }
  }

  return []
}
