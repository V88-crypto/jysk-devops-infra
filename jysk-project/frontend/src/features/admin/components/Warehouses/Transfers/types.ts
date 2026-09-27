export interface TransferLineItemRow {
  id: number
  productId: number | null
  packagingId: number | null
  quantity: string
  sum: string
}

export const createEmptyTransferLineItemRow = (): Omit<
  TransferLineItemRow,
  'id'
> => ({
  productId: null,
  packagingId: null,
  quantity: '',
  sum: '',
})
