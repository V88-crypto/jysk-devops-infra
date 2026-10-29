import { apiRequest } from './httpClient'

interface CartResponse {
  items: {
    variant: {
      id: number
      sku: string
      price: number
    }
    product: {
      id: number
      name: string
      slug: string
    }
    image_url: string | null
    quantity: number
    available: boolean
  }[]
}

export interface CartEntry {
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

const mapCartResponse = (response: CartResponse): CartEntry[] =>
  response.items.map((item) => ({
    id: item.variant.id,
    variantId: item.variant.id,
    name: item.product.name,
    price: item.variant.price,
    imageUrl: item.image_url,
    quantity: item.quantity,
    sku: item.variant.sku,
    productSlug: item.product.slug,
    available: item.available,
  }))

export const cartApi = {
  async list(): Promise<CartEntry[]> {
    return mapCartResponse(await apiRequest<CartResponse>('/cart'))
  },

  async add(variantId: number, quantity: number): Promise<CartEntry[]> {
    return mapCartResponse(
      await apiRequest<CartResponse>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ variant_id: variantId, quantity }),
      }),
    )
  },

  async update(variantId: number, quantity: number): Promise<CartEntry[]> {
    return mapCartResponse(
      await apiRequest<CartResponse>(`/cart/items/${variantId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      }),
    )
  },

  async remove(variantId: number): Promise<void> {
    await apiRequest<void>(`/cart/items/${variantId}`, { method: 'DELETE' })
  },

  async clear(): Promise<void> {
    await apiRequest<void>('/cart', { method: 'DELETE' })
  },
}
