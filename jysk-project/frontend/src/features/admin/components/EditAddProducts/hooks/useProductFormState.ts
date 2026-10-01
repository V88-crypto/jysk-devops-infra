import { useState } from 'react'
import type { ChangeEvent, SyntheticEvent } from 'react'

import { uploadApi } from '@/features/admin/api/uploadApi'
import type { Attribute } from '@/features/admin/types/attribute'
import { uploadErrorMessage, validateImageFile } from '@/shared/api/uploads'

import type { EditProductFormState } from '@/features/admin/components/EditAddProducts/types/productForm'

import {
  IMAGE_FALLBACK_URL,
  MAX_PRODUCT_IMAGES,
  emptyAttributeRows,
  emptyProductFormState,
} from '@/features/admin/components/EditAddProducts/utils/productHelpers'

export const PHOTO_PLACEHOLDER = `Виберіть фото... (до ${MAX_PRODUCT_IMAGES} шт.)`

export const useProductFormState = (attributes: Attribute[]) => {
  const [form, setForm] = useState<EditProductFormState>(
    emptyProductFormState(),
  )

  const [selectedPhotoText, setSelectedPhotoText] = useState(PHOTO_PLACEHOLDER)
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

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
              ? (matchedAttribute?.id ?? null)
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

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const freeSlots = MAX_PRODUCT_IMAGES - form.imageUrls.length
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''

    if (!files.length) {
      return
    }

    if (freeSlots <= 0) {
      setPhotoError(`Можна додати не більше ${MAX_PRODUCT_IMAGES} фото`)
      return
    }

    const invalidFile = files.find((file) => validateImageFile(file))

    if (invalidFile) {
      setPhotoError(`${invalidFile.name}: ${validateImageFile(invalidFile)}`)
      return
    }

    setPhotoError(
      files.length > freeSlots
        ? `Додано лише перші ${freeSlots} фото, максимум ${MAX_PRODUCT_IMAGES}`
        : null,
    )
    setIsUploadingPhotos(true)
    setSelectedPhotoText('Завантаження фото...')

    try {
      for (const file of files.slice(0, freeSlots)) {
        const imageUrl = await uploadApi.uploadImage(file, 'products')

        setForm((currentForm) => ({
          ...currentForm,
          imageUrls: [...currentForm.imageUrls, imageUrl],
        }))
      }
    } catch (error) {
      setPhotoError(uploadErrorMessage(error))
    } finally {
      setIsUploadingPhotos(false)
      setSelectedPhotoText(PHOTO_PLACEHOLDER)
    }
  }

  const removePhoto = (imageIndex: number) => {
    setForm((currentForm) => ({
      ...currentForm,
      imageUrls: currentForm.imageUrls.filter(
        (_, index) => index !== imageIndex,
      ),
    }))
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
    removePhoto,
    isUploadingPhotos,
    photoError,
    setPhotoError,
    handleImageError,
  }
}
