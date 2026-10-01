export interface Review {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  authorName: string
  productName: string
  sku: string
}
