export interface PurchaseOrder {
  id: number
  number: string
  productName: string
  categoryId: number
  categoryName: string
  warehouseId: number
  taxRate: number
  costPrice: number
  price: number
  markup: number
}
