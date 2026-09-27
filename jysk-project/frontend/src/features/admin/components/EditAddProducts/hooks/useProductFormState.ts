import { useState } from 'react'
import type { ChangeEvent, SyntheticEvent } from 'react'

import type { Attribute } from '@/features/admin/types/attribute'

import type { EditProductFormState } from '@/features/admin/components/EditAddProducts/types/productForm'

import {
  IMAGE_FALLBACK_URL,
  emptyAttributeRows,
  emptyProductFormState,
} from '@/features/admin/components/EditAddProducts/utils/productHelpers'

export const useProductFormState = (attributes: Attribute[]) => {
  const [form, setForm] = useState<EditProductFormState>(
    emptyProductFormState(),
  )

  const [selectedPhotoText, setSelectedPhotoText] = useState(
    'Виберіть фото... (до 4 шт.)',
  )

  const updateField = <Field extends keyof EditProductFormState>(
    field: Field,
    value: EditProductFormState[Field],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const updateAttributeRow = (
    rowId: number,
    field: 'name' | 'value',
    value: string,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,

      attributes: currentForm.attributes.map((attribute) => {
        if (attribute.id !== rowId) {
          return attribute
        }

        const matchedAttribute =
          field === 'name'
            ? attributes.find(
                (item) =>
                  item.name.trim().toLocaleLowerCase('uk-UA') ===
                  value.trim().toLocaleLowerCase('uk-UA'),
              )
            : null

        return {
          ...attribute,

          [field]: value,

          attributeId:
            field === 'name'
              ? matchedAttribute?.id ?? null
              : attribute.attributeId,
        }
      }),
    }))
  }

  const addAttributeRow = () => {
    setForm((currentForm) => ({
      ...currentForm,

      attributes: [
        ...currentForm.attributes,

        {
          id: -Date.now(),
          attributeId: null,
          name: '',
          value: '',
        },
      ],
    }))
  }

  const clearAttributes = () => {
    updateField('attributes', emptyAttributeRows())
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []).slice(0, 4)

    setSelectedPhotoText(
      files.length
        ? files.map((file) => file.name).join(', ')
        : 'Виберіть фото... (до 4 шт.)',
    )
  }

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = IMAGE_FALLBACK_URL
  }

  return {
    form,
    setForm,
    selectedPhotoText,
    setSelectedPhotoText,
    updateField,
    updateAttributeRow,
    addAttributeRow,
    clearAttributes,
    handlePhotoChange,
    handleImageError,
  }
}
