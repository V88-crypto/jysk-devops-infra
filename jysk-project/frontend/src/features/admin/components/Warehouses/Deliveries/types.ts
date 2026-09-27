export interface DeliveryLineItemRow {
  id: number
  productId: number | null
  packagingId: number | null
  quantity: string
  unitPrice: string
  taxRate: string
}

export const createEmptyDeliveryLineItemRow = (): Omit<
  DeliveryLineItemRow,
  'id'
> => ({
  productId: null,
  packagingId: null,
  quantity: '',
  unitPrice: '',
  taxRate: '',
})

export const getDeliveryLineItemSumWithoutTax = (
  row: DeliveryLineItemRow,
): number => {
  const quantity = Number(row.quantity.replace(',', '.')) || 0
  const unitPrice = Number(row.unitPrice.replace(',', '.')) || 0

  return quantity * unitPrice
}

export const getDeliveryLineItemTotalSum = (
  row: DeliveryLineItemRow,
): number => {
  const sumWithoutTax = getDeliveryLineItemSumWithoutTax(row)
  const taxRate = Number(row.taxRate.replace(',', '.')) || 0

  return sumWithoutTax * (1 + taxRate / 100)
}
