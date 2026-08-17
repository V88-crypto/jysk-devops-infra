import type { VariantAttribute } from './attribute'

export interface Product {
  id: number
  categoryId: number
  name: string
  slug: string
  description: string
  createdAt: string
  variants: ProductVariant[]
}

export interface ProductVariant {
  id: number
  productId: number
  sku: string
  price: number
  stock: number
  createdAt: string
  images: ProductImage[]
  attributes: VariantAttribute[]
}

export interface ProductImage {
  id: number
  variantId: number
  imageUrl: string
  isPrimary: boolean
  sortOrder: number
  createdAt: string
}
