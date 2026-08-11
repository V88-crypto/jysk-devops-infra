export interface Profile {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  ordersCount: number
  completedOrdersCount: number
  reviewsCount: number
  favoritesCount: number
}

export interface OrderItem {
  id: number
  name: string
  description: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  id: number
  orderNumber: string
  date: string
  status: string
  totalPrice: number
  items: OrderItem[]
}

export interface FavoriteProduct {
  id: number
  name: string
  brand: string
  description: string
  price: number
  oldPrice?: number
  image: string
  discount?: number
  badge?: string
  rating: number
  reviews: number
  available: boolean
}

export interface Review {
  id: number;
  author: string;
  brand: string;
  product: string;
  image: string;
  rating: number;
  review: string;
}