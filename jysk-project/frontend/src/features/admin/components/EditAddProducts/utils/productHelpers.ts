import type {
  VariantAttributePayload,
  VariantImagePayload,
} from '@/features/admin/api/productApi'
import type { Attribute } from '@/features/admin/types/attribute'
import type { Category } from '@/features/admin/types/category'
import type {
  Product,
  ProductImage,
  ProductVariant,
} from '@/features/admin/types/product'
import { ApiError } from '@/shared/api/httpClient'

import type {
  AttributeFormRow,
  EditProductFormState,
} from '@/features/admin/components/EditAddProducts/types/productForm'

export const IMAGE_FALLBACK_URL = '/images/category-placeholder.svg'

export const MAX_PRODUCT_IMAGES = 4

export const emptyAttributeRows = (): AttributeFormRow[] => {
  return [1, 2, 3].map((rowNumber) => ({
    id: -rowNumber,
    attributeId: null,
    name: '',
    value: '',
  }))
}

export const emptyProductFormState = (): EditProductFormState => {
  return {
    sku: '',
    name: '',
    categoryId: '',
    shortDescription: '',
    detailedDescription: '',
    price: '',
    stock: '',
    discount: '',
    alwaysLowPrice: false,
    isNew: false,
    deliveryAvailable: false,
    isGreatOffer: true,
    attributes: emptyAttributeRows(),
    imageUrls: [],
  }
}

export const normalizeName = (value: string): string => {
  return value.trim().toLocaleLowerCase('uk-UA')
}

export const getFirstVariant = (product: Product): ProductVariant | null => {
  return product.variants[0] ?? null
}

export const getAttributeName = (
  attributeId: number,
  attributes: Attribute[],
): string => {
  return (
    attributes.find((attribute) => attribute.id === attributeId)?.name ?? ''
  )
}

export const categoryLabel = (
  category: Category,
  categories: Category[],
): string => {
  const parent = categories.find((item) => item.id === category.parentId)

  return parent ? `${parent.name} › ${category.name}` : category.name
}

export const parsePrice = (value: string): number =>
  Number(value.replace(',', '.'))

export const parseStock = (value: string): number =>
  value.trim() === '' ? 0 : Number(value)

export const validateProductForm = (
  form: EditProductFormState,
): string | null => {
  if (!form.sku.trim()) {
    return 'Введіть артикул'
  }

  if (!form.name.trim()) {
    return 'Введіть назву товару'
  }

  if (!form.categoryId) {
    return 'Виберіть категорію'
  }

  const price = parsePrice(form.price)

  if (!Number.isFinite(price) || price <= 0) {
    return 'Введіть коректну ціну'
  }

  const stock = parseStock(form.stock)

  if (!Number.isInteger(stock) || stock < 0) {
    return 'Залишок має бути цілим числом від 0'
  }

  return null
}

export const formDescription = (form: EditProductFormState): string | null =>
  form.detailedDescription.trim() || form.shortDescription.trim() || null

export const toAttributePayloads = (
  rows: AttributeFormRow[],
): VariantAttributePayload[] =>
  rows
    .filter((row) => row.name.trim() && row.value.trim())
    .map((row) => ({
      id: row.id > 0 ? row.id : undefined,
      attributeId: row.attributeId ?? undefined,
      name: row.attributeId === null ? row.name.trim() : undefined,
      value: row.value.trim(),
    }))

export const toImagePayloads = (
  imageUrls: string[],
  existingImages: ProductImage[],
): VariantImagePayload[] =>
  imageUrls.slice(0, MAX_PRODUCT_IMAGES).map((imageUrl, imageIndex) => ({
    id: existingImages.find((image) => image.imageUrl === imageUrl)?.id,
    imageUrl,
    isPrimary: imageIndex === 0,
    sortOrder: imageIndex,
  }))

export const productErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (error instanceof ApiError) {
    if (error.status === 409 && error.message.includes('SKU')) {
      return 'Товар з таким артикулом вже існує'
    }

    if (error.status === 409 && error.message.includes('slug')) {
      return 'Товар з такою назвою вже існує'
    }

    if (error.status === 409 && error.message.includes('заказах')) {
      return 'Товар уже є в замовленнях, його не можна видалити'
    }

    if (error.status === 404) {
      return 'Товар не знайдено'
    }
  }

  return fallback
}
