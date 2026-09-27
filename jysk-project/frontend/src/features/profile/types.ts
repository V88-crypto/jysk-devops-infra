export type OrderStatus =
  | 'new'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: number
  name: string
  sku: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  date: string
  status: OrderStatus
  totalPrice: number
  address: string
  items: OrderItem[]
}

export interface OrderList {
  items: Order[]
  total: number
}

export interface FavoriteProduct {
  variantId: number
  name: string
  sku: string
  price: number
  image: string | null
  inStock: boolean
}

export interface MyReview {
  id: number
  productName: string
  image: string | null
  rating: number
  comment: string | null
  date: string
}

export interface MyReviewList {
  items: MyReview[]
  total: number
}
