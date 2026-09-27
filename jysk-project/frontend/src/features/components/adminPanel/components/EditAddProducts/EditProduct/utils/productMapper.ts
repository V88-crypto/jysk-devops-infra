import type { Attribute } from '@/features/types/attribute'
import type { Product } from '@/features/types/product'

import type { EditProductFormState } from '@/features/components/adminPanel/components/EditAddProducts/types/productForm'

import {
  emptyProductFormState,
  getAttributeName,
  getFirstVariant,
  createImages,
  resolveAttributeId,
} from '@/features/components/adminPanel/components/EditAddProducts/utils/productHelpers'

export const mapProductToForm = (
  product: Product,
  attributes: Attribute[],
): EditProductFormState => {
  const variant =
    getFirstVariant(product)

  const rows =
    variant?.attributes.map(
      (attribute) => ({
        id: attribute.id,

        attributeId:
          attribute.attributeId,

        name: getAttributeName(
          attribute.attributeId,
          attributes,
        ),

        value: attribute.value,
      }),
    ) ?? []

  const imageUrls =
    variant?.images
      .slice()
      .sort(
        (firstImage, secondImage) =>
          firstImage.sortOrder -
          secondImage.sortOrder,
      )
      .map(
        (image) =>
          image.imageUrl,
      ) ?? []

  return {
    ...emptyProductFormState(),

    sku:
      variant?.sku ?? '',

    name:
      product.name,

    categoryId:
      String(product.categoryId),

    shortDescription:
      product.description,

    detailedDescription:
      product.description,

    price:
      variant
        ? String(variant.price)
        : '',

    attributes: [
      ...rows,
      ...emptyProductFormState()
        .attributes,
    ].slice(0, 3),

    imageUrls:
      imageUrls.slice(0, 4),
  }
}

export const mapFormToProduct = (
  product: Product,
  form: EditProductFormState,
  attributes: Attribute[],
): Product => {
  const variant =
    getFirstVariant(product)

  if (!variant) {
    return product
  }

  const maxAttributeId =
    variant.attributes.reduce(
      (maxId, attribute) =>
        Math.max(
          maxId,
          attribute.id,
        ),
      0,
    )

  const maxKnownAttributeId =
    attributes.reduce(
      (maxId, attribute) =>
        Math.max(
          maxId,
          attribute.id,
        ),
      0,
    )

  const updatedAttributes =
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
            attribute.id > 0
              ? attribute.id
              : maxAttributeId +
                attributeIndex +
                1,

          variantId:
            variant.id,

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

  const updatedVariant = {
    ...variant,

    sku:
      form.sku.trim(),

    price:
      Number(
        form.price.replace(',', '.'),
      ) || 0,

    images:
      createImages(
        form.imageUrls,
        variant,
      ),

    attributes:
      updatedAttributes,
  }

  return {
    ...product,

    categoryId:
      Number(form.categoryId) ||
      product.categoryId,

    name:
      form.name.trim(),

    description:
      form.detailedDescription.trim() ||
      form.shortDescription.trim(),

    variants: [
      updatedVariant,
      ...product.variants.slice(1),
    ],
  }
}