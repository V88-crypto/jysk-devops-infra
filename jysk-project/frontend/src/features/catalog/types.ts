export interface CategoryNode {
  id: number
  name: string
  slug: string
  children: CategoryNode[]
}

export interface ProductSummary {
  id: number
  name: string
  slug: string
  priceFrom: number | null
  imageUrl: string | null
}

export interface ProductVariant {
  id: number
  sku: string
  price: number
  stock: number
  images: string[]
  attributes: { name: string; value: string }[]
}

export interface ProductDetail {
  id: number
  categoryId: number
  name: string
  slug: string
  description: string | null
  variants: ProductVariant[]
}

export interface ProductReview {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  author: string
}

export interface ProductReviewList {
  items: ProductReview[]
  total: number
  averageRating: number
}

export interface Page<T> {
  items: T[]
  total: number
}

export interface CartItem {
  id: number
  variantId: number
  name: string
  price: number
  imageUrl: string | null
  quantity: number
  sku: string
  productSlug: string
  available: boolean
}
