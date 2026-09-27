import type { SyntheticEvent } from 'react'

export interface AttributeFormRow {
  id: number
  attributeId: number | null
  name: string
  value: string
}

export interface EditProductFormState {
  sku: string
  name: string
  categoryId: string
  shortDescription: string
  detailedDescription: string
  price: string
  discount: string
  alwaysLowPrice: boolean
  isNew: boolean
  deliveryAvailable: boolean
  isGreatOffer: boolean
  attributes: AttributeFormRow[]
  imageUrls: string[]
}

export interface FlagOptionProps {
  checked: boolean
  disabled: boolean
  label: string
  tone?: 'teal' | 'black'
  onChange: (checked: boolean) => void
}

export interface AttributeRowProps {
  row: AttributeFormRow
  disabled: boolean
  onChange: (rowId: number, field: 'name' | 'value', value: string) => void
}

export interface PhotoPreviewProps {
  imageUrl: string
  imageIndex: number
  onError: (event: SyntheticEvent<HTMLImageElement>) => void
}
