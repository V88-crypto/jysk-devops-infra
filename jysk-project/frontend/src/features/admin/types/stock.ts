export interface Warehouse {
  id: number
  name: string
  address: string
}

export interface StockItem {
  id: number
  productId: number
  productName: string
  categoryId: number
  categoryName: string
  warehouseId: number
  quantity: number
  costPrice: number
  limit: number
}
