import type {
  ProductPayload,
  VariantPayload,
} from '@/features/admin/api/productApi'
import type { Attribute } from '@/features/admin/types/attribute'
import type { Product, ProductVariant } from '@/features/admin/types/product'

import type { EditProductFormState } from '@/features/admin/components/EditAddProducts/types/productForm'

import {
  MAX_PRODUCT_IMAGES,
  emptyProductFormState,
  formDescription,
  getAttributeName,
  getFirstVariant,
  parsePrice,
  parseStock,
  toAttributePayloads,
  toImagePayloads,
} from '@/features/admin/components/EditAddProducts/utils/productHelpers'

export const mapProductToForm = (
  product: Product,
  attributes: Attribute[],
): EditProductFormState => {
  const variant = getFirstVariant(product)

  const rows =
    variant?.attributes.map((attribute) => ({
      id: attribute.id,
      attributeId: attribute.attributeId,
      name: getAttributeName(attribute.attributeId, attributes),
      value: attribute.value,
    })) ?? []

  const imageUrls =
    variant?.images
      .slice()
      .sort(
        (firstImage, secondImage) =>
          firstImage.sortOrder - secondImage.sortOrder,
      )
      .map((image) => image.imageUrl) ?? []

  const emptyForm = emptyProductFormState()

  return {
    ...emptyForm,
    sku: variant?.sku ?? '',
    name: product.name,
    categoryId: String(product.categoryId),
    shortDescription: product.description,
    detailedDescription: product.description,
    price: variant ? String(variant.price) : '',
    stock: variant ? String(variant.stock) : '',
    attributes: [...rows, ...emptyForm.attributes].slice(
      0,
      Math.max(rows.length, emptyForm.attributes.length),
    ),
    imageUrls: imageUrls.slice(0, MAX_PRODUCT_IMAGES),
  }
}

// Variants that the form does not edit are sent back unchanged,
// otherwise the backend would delete them.
const keepVariant = (variant: ProductVariant): VariantPayload => ({
  id: variant.id,
  sku: variant.sku,
  price: variant.price,
  stock: variant.stock,
  attributes: variant.attributes.map((attribute) => ({
    id: attribute.id,
    attributeId: attribute.attributeId,
    value: attribute.value,
  })),
  images: variant.images.map((image) => ({
    id: image.id,
    imageUrl: image.imageUrl,
    isPrimary: image.isPrimary,
    sortOrder: image.sortOrder,
  })),
})

export const mapFormToProduct = (
  product: Product,
  form: EditProductFormState,
): ProductPayload => {
  const [variant, ...otherVariants] = product.variants

  const editedVariant: VariantPayload = {
    id: variant?.id,
    sku: form.sku.trim(),
    price: parsePrice(form.price),
    stock: parseStock(form.stock),
    attributes: toAttributePayloads(form.attributes),
    images: toImagePayloads(form.imageUrls, variant?.images ?? []),
  }

  return {
    name: form.name.trim(),
    categoryId: Number(form.categoryId),
    description: formDescription(form),
    variants: [editedVariant, ...otherVariants.map(keepVariant)],
  }
}
