export interface Attribute {
  id: number
  name: string
}

export interface VariantAttribute {
  id: number
  variantId: number
  attributeId: number
  value: string
}
