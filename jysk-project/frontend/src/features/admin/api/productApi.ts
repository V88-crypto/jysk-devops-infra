import type { Product } from '@/features/admin/types/product'
import { apiRequest } from '@/shared/api/httpClient'

interface ProductResponse {
  id: number
  category_id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  variants: {
    id: number
    sku: string
    price: number
    stock: number
    images: {
      id: number
      image_url: string
      is_primary: boolean
      sort_order: number
    }[]
    attributes: {
      id: number
      attribute_id: number
      name: string
      value: string
    }[]
  }[]
}

interface ProductListResponse {
  items: ProductResponse[]
  total: number
}

export interface VariantAttributePayload {
  id?: number
  attributeId?: number
  name?: string
  value: string
}

export interface VariantImagePayload {
  id?: number
  imageUrl: string
  isPrimary: boolean
  sortOrder: number
}

export interface VariantPayload {
  id?: number
  sku: string
  price: number
  stock: number
  attributes: VariantAttributePayload[]
  images: VariantImagePayload[]
}

export interface ProductPayload {
  name: string
  categoryId: number
  description: string | null
  variants: VariantPayload[]
}

export interface ProductPage {
  items: Product[]
  total: number
}

interface ProductQuery {
  search: string
  page: number
  pageSize: number
}

const toProduct = (product: ProductResponse): Product => ({
  id: product.id,
  categoryId: product.category_id,
  name: product.name,
  slug: product.slug,
  description: product.description ?? '',
  createdAt: product.created_at,
  variants: product.variants.map((variant) => ({
    id: variant.id,
    productId: product.id,
    sku: variant.sku,
    price: variant.price,
    stock: variant.stock,
    createdAt: product.created_at,
    images: variant.images.map((image) => ({
      id: image.id,
      variantId: variant.id,
      imageUrl: image.image_url,
      isPrimary: image.is_primary,
      sortOrder: image.sort_order,
      createdAt: product.created_at,
    })),
    attributes: variant.attributes.map((attribute) => ({
      id: attribute.id,
      variantId: variant.id,
      attributeId: attribute.attribute_id,
      value: attribute.value,
    })),
  })),
})

const toRequestBody = (payload: ProductPayload) =>
  JSON.stringify({
    name: payload.name,
    category_id: payload.categoryId,
    description: payload.description,
    variants: payload.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      attributes: variant.attributes.map((attribute) => ({
        id: attribute.id,
        attribute_id: attribute.attributeId,
        name: attribute.name,
        value: attribute.value,
      })),
      images: variant.images.map((image) => ({
        id: image.id,
        image_url: image.imageUrl,
        is_primary: image.isPrimary,
        sort_order: image.sortOrder,
      })),
    })),
  })

export const productApi = {
  async getPage({
    search,
    page,
    pageSize,
  }: ProductQuery): Promise<ProductPage> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })

    if (search) {
      params.set('search', search)
    }

    const response = await apiRequest<ProductListResponse>(
      `/admin/products?${params}`,
    )

    return { items: response.items.map(toProduct), total: response.total }
  },

  async getById(id: number): Promise<Product> {
    return toProduct(await apiRequest<ProductResponse>(`/admin/products/${id}`))
  },

  async create(payload: ProductPayload): Promise<Product> {
    return toProduct(
      await apiRequest<ProductResponse>('/admin/products', {
        method: 'POST',
        body: toRequestBody(payload),
      }),
    )
  },

  async update(id: number, payload: ProductPayload): Promise<Product> {
    return toProduct(
      await apiRequest<ProductResponse>(`/admin/products/${id}`, {
        method: 'PUT',
        body: toRequestBody(payload),
      }),
    )
  },

  delete(id: number): Promise<void> {
    return apiRequest<void>(`/admin/products/${id}`, { method: 'DELETE' })
  },
}
