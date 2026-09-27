import type { Attribute } from '@/features/types/attribute'
import type {
  Product,
  ProductVariant,
} from '@/features/types/product'

import type { EditProductFormState } from '@/features/components/adminPanel/components/EditAddProducts/types/productForm'

import {
  createImages,
  resolveAttributeId,
} from '@/features/components/adminPanel/components/EditAddProducts/utils/productHelpers'

export const mapFormToNewProduct = (
  form: EditProductFormState,
  attributes: Attribute[],
): Product => {
  const productId = Date.now()
  const variantId = productId

  const maxKnownAttributeId =
    attributes.reduce(
      (maxId, attribute) =>
        Math.max(maxId, attribute.id),
      0,
    )

  const productAttributes =
    form.attributes
      .filter(
        (attribute) =>
          attribute.name.trim() &&
          attribute.value.trim(),
      )
      .map(
        (
          attribute,
          attributeIndex,
        ) => ({
          id:
            maxKnownAttributeId +
            attributeIndex +
            1,

          variantId,

          attributeId:
            resolveAttributeId(
              attribute,
              attributes,
              maxKnownAttributeId +
                attributeIndex +
                1,
            ),

          value:
            attribute.value.trim(),
        }),
      )

  const variant: ProductVariant = {
    id: variantId,

    productId,

    sku: form.sku.trim(),

    price:
      Number(
        form.price.replace(',', '.'),
      ) || 0,

    stock: 0,

    createdAt:
      new Date().toISOString(),

    images: [],

    attributes:
      productAttributes,
  }

  variant.images = createImages(
    form.imageUrls,
    variant,
  )

  return {
    id: productId,

    categoryId:
      Number(form.categoryId) || 0,

    name: form.name.trim(),

    createdAt:
      new Date().toISOString(),

    description:
      form.detailedDescription.trim() ||
      form.shortDescription.trim(),

    variants: [variant],

    slug: form.name.trim().toLowerCase().replace(/\s+/g, '-'),
  }
}