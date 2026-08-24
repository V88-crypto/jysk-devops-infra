export interface Supplier {
  id: number
  name: string
}

export interface Packaging {
  id: number
  name: string
}

export interface WriteOffReason {
  id: number
  name: string
}

export type DeliveryStatus = 'paid' | 'unpaid'

export interface Delivery {
  id: number
  number: string
  date: string
  supplierId: number
  supplierName: string
  warehouseId: number
  warehouseName: string
  categoryId: number
  productsSummary: string
  comment: string
  invoiceNumber: string
  status: DeliveryStatus
  totalSum: number
}

export interface Transfer {
  id: number
  date: string
  productsSummary: string
  sum: number
  employeeName: string
  fromWarehouseId: number
  fromWarehouseName: string
  toWarehouseId: number
  toWarehouseName: string
}

export interface WriteOff {
  id: number
  number: string
  date: string
  employeeName: string
  warehouseId: number
  warehouseName: string
  categoryId: number
  productsSummary: string
  reasonId: number | null
  reasonName: string | null
  sum: number
}
