import { apiRequest } from './httpClient'

export interface FavoriteEntry {
  variantId: number
  productSlug: string
}

interface FavoriteListResponse {
  items: {
    variant: { id: number }
    product: { slug: string }
  }[]
}

export const favoritesApi = {
  async list(): Promise<FavoriteEntry[]> {
    const response = await apiRequest<FavoriteListResponse>('/favorites')

    return response.items.map((item) => ({
      variantId: item.variant.id,
      productSlug: item.product.slug,
    }))
  },

  add(variantId: number): Promise<void> {
    return apiRequest<void>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId }),
    })
  },

  remove(variantId: number): Promise<void> {
    return apiRequest<void>(`/favorites/${variantId}`, { method: 'DELETE' })
  },
}
