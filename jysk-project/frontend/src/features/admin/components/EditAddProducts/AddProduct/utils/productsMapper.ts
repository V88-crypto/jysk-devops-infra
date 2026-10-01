import type { ProductPayload } from '@/features/admin/api/productApi'

import type { EditProductFormState } from '@/features/admin/components/EditAddProducts/types/productForm'

import {
  formDescription,
  parsePrice,
  parseStock,
  toAttributePayloads,
  toImagePayloads,
} from '@/features/admin/components/EditAddProducts/utils/productHelpers'

export const mapFormToNewProduct = (
  form: EditProductFormState,
): ProductPayload => ({
  name: form.name.trim(),
  categoryId: Number(form.categoryId),
  description: formDescription(form),
  variants: [
    {
      sku: form.sku.trim(),
      price: parsePrice(form.price),
      stock: parseStock(form.stock),
      attributes: toAttributePayloads(form.attributes),
      images: toImagePayloads(form.imageUrls, []),
    },
  ],
})
