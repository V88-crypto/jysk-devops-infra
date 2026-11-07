import type { AuthUser } from '@/shared/api/authService'
import { apiRequest } from '@/shared/api/httpClient'
import type {
  FavoriteProduct,
  MyReviewList,
  Order,
  OrderList,
} from '@/features/profile/types'
import { formatOrderAddress } from '@/shared/orders/orderAddress'
import type { OrderDeliveryResponse } from '@/shared/orders/orderAddress'
import type { OrderStatus } from '@/shared/orders/orderStatus'

const MAX_PAGE_SIZE = 100

interface PageResponse<T> {
  items: T[]
  total: number
}

interface OrderResponse extends OrderDeliveryResponse {
  id: number
  status: OrderStatus
  total_price: number
  created_at: string
  items: {
    id: number
    sku: string
    product_name: string
    quantity: number
    price: number
  }[]
}

interface FavoriteResponse {
  variant: {
    id: number
    sku: string
    price: number
    stock: number
  }
  product: {
    name: string
    slug: string
  }
  image_url: string | null
}

interface MyReviewResponse {
  id: number
  rating: number
  comment: string | null
  created_at: string
  variant: {
    id: number
  }
  product: {
    name: string
    slug: string
  }
  image_url: string | null
}

export interface ProfileUpdatePayload {
  firstName: string
  lastName: string
  phone: string | null
}

const mapOrder = (order: OrderResponse): Order => ({
  id: order.id,
  date: order.created_at,
  status: order.status,
  totalPrice: order.total_price,
  address: formatOrderAddress(order),
  items: order.items.map((item) => ({
    id: item.id,
    name: item.product_name,
    sku: item.sku,
    quantity: item.quantity,
    price: item.price,
  })),
})

export const profileApi = {
  async getOrders(): Promise<OrderList> {
    const response = await apiRequest<PageResponse<OrderResponse>>(
      `/orders?page_size=${MAX_PAGE_SIZE}`,
    )

    return {
      total: response.total,
      items: response.items.map(mapOrder),
    }
  },

  async cancelOrder(orderId: number): Promise<Order> {
    return mapOrder(
      await apiRequest<OrderResponse>(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
      }),
    )
  },

  async getFavorites(): Promise<FavoriteProduct[]> {
    const response =
      await apiRequest<PageResponse<FavoriteResponse>>('/favorites')

    return response.items.map((favorite) => ({
      variantId: favorite.variant.id,
      productSlug: favorite.product.slug,
      name: favorite.product.name,
      sku: favorite.variant.sku,
      price: favorite.variant.price,
      image: favorite.image_url,
      inStock: favorite.variant.stock > 0,
    }))
  },

  removeFavorite(variantId: number): Promise<void> {
    return apiRequest<void>(`/favorites/${variantId}`, { method: 'DELETE' })
  },

  async getReviews(): Promise<MyReviewList> {
    const response = await apiRequest<PageResponse<MyReviewResponse>>(
      `/users/me/reviews?page_size=${MAX_PAGE_SIZE}`,
    )

    return {
      total: response.total,
      items: response.items.map((review) => ({
        id: review.id,
        productName: review.product.name,
        productSlug: review.product.slug,
        variantId: review.variant.id,
        image: review.image_url,
        rating: review.rating,
        comment: review.comment,
        date: review.created_at,
      })),
    }
  },

  uploadAvatar(file: File): Promise<AuthUser> {
    const body = new FormData()
    body.append('file', file)

    return apiRequest<AuthUser>('/users/me/avatar', { method: 'POST', body })
  },

  deleteAvatar(): Promise<void> {
    return apiRequest<void>('/users/me/avatar', { method: 'DELETE' })
  },

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiRequest<void>('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    })
  },

  updateProfile(payload: ProfileUpdatePayload): Promise<AuthUser> {
    return apiRequest<AuthUser>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({
        first_name: payload.firstName,
        last_name: payload.lastName,
        phone: payload.phone,
      }),
    })
  },
}
