import type { Attribute } from '../../../../../types/attribute'
import type {
  Product,
  ProductImage,
  ProductVariant,
} from '../../../../../types/product'

import type {
  AttributeFormRow,
  EditProductFormState,
} from '../types/productForm'

export const IMAGE_FALLBACK_URL =
  '/images/category-placeholder.svg'

export const emptyAttributeRows =
  (): AttributeFormRow[] => {
    return [1, 2, 3].map((rowNumber) => ({
      id: -rowNumber,
      attributeId: null,
      name: '',
      value: '',
    }))
  }

export const emptyProductFormState =
  (): EditProductFormState => {
    return {
      sku: '',
      name: '',
      categoryId: '',
      shortDescription: '',
      detailedDescription: '',
      price: '',
      discount: '',
      alwaysLowPrice: false,
      isNew: false,
      deliveryAvailable: false,
      isGreatOffer: true,
      attributes: emptyAttributeRows(),
      imageUrls: [],
    }
  }

export const normalizeName = (
  value: string,
): string => {
  return value
    .trim()
    .toLocaleLowerCase('uk-UA')
}

export const getFirstVariant = (
  product: Product,
): ProductVariant | null => {
  return product.variants[0] ?? null
}

export const getAttributeName = (
  attributeId: number,
  attributes: Attribute[],
): string => {
  return (
    attributes.find(
      (attribute) =>
        attribute.id === attributeId,
    )?.name ?? ''
  )
}

export const resolveAttributeId = (
  row: AttributeFormRow,
  attributes: Attribute[],
  fallbackId: number,
): number => {
  if (row.attributeId !== null) {
    return row.attributeId
  }

  const matchedAttribute =
    attributes.find(
      (attribute) =>
        normalizeName(attribute.name) ===
        normalizeName(row.name),
    )

  return (
    matchedAttribute?.id ??
    fallbackId
  )
}

export const createImages = (
  imageUrls: string[],
  variant: ProductVariant,
): ProductImage[] => {
  const maxImageId =
    variant.images.reduce(
      (maxId, image) =>
        Math.max(maxId, image.id),
      0,
    )

  return imageUrls
    .slice(0, 4)
    .map((imageUrl, imageIndex) => {
      const currentImage =
        variant.images[imageIndex]

      return {
        id:
          currentImage?.id ??
          maxImageId +
            imageIndex +
            1,

        variantId: variant.id,

        imageUrl,

        isPrimary:
          imageIndex === 0,

        sortOrder:
          imageIndex + 1,

        createdAt:
          currentImage?.createdAt ??
          new Date().toISOString(),
      }
    })
}