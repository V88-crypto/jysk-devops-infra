export interface WriteOffLineItemRow {
  id: number
  productId: number | null
  packagingId: number | null
  quantity: string
  details: string
}

export const createEmptyWriteOffLineItemRow = (): Omit<
  WriteOffLineItemRow,
  'id'
> => ({
  productId: null,
  packagingId: null,
  quantity: '',
  details: '',
})
