import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { catalogApi } from '@/features/admin/api/catalogApi'
import { productApi } from '@/features/admin/api/productApi'

import type { Attribute } from '@/features/admin/types/attribute'
import type { Category } from '@/features/admin/types/category'

import { ProductFormFields } from '@/features/admin/components/EditAddProducts/components/ProductFormFields'
import { useProductFormState } from '@/features/admin/components/EditAddProducts/hooks/useProductFormState'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

import {
  emptyProductFormState,
  productErrorMessage,
  validateProductForm,
} from '@/features/admin/components/EditAddProducts/utils/productHelpers'

import { mapFormToNewProduct } from './utils/productsMapper'

interface Status {
  type: 'success' | 'error'
  text: string
}

export const AddProduct = () => {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<Status | null>(null)

  const {
    form,
    setForm,
    selectedPhotoText,
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
  } = useProductFormState(attributes)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const [loadedCategories, loadedAttributes] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getAttributes(),
        ])

        if (!isMounted) {
          return
        }

        setCategories(loadedCategories)
        setAttributes(loadedAttributes)
      } catch {
        if (isMounted) {
          setStatus({ type: 'error', text: 'Не вдалося завантажити дані' })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateProductForm(form)

    if (validationError) {
      setStatus({ type: 'error', text: validationError })
      return
    }

    setIsSaving(true)
    setStatus(null)

    try {
      const created = await productApi.create(mapFormToNewProduct(form))

      setStatus({ type: 'success', text: `Товар «${created.name}» створено` })
      setForm(emptyProductFormState())
      setPhotoError(null)
      catalogApi
        .getAttributes()
        .then(setAttributes)
        .catch(() => undefined)
    } catch (error) {
      setStatus({
        type: 'error',
        text: productErrorMessage(error, 'Не вдалося створити товар'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPageLayout>
      <form
        className="w-full max-w-[1400px]"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="mb-7 flex items-center gap-2 text-2xl font-semibold transition-opacity hover:opacity-70"
        >
          <span className="text-lg">‹</span> Додати товар
        </button>

        <ProductFormFields
          form={form}
          categories={categories}
          attributes={attributes}
          isLoading={isLoading}
          selectedPhotoText={selectedPhotoText}
          isUploadingPhotos={isUploadingPhotos}
          photoError={photoError}
          updateField={updateField}
          updateAttributeRow={updateAttributeRow}
          addAttributeRow={addAttributeRow}
          clearAttributes={clearAttributes}
          handlePhotoChange={handlePhotoChange}
          removePhoto={removePhoto}
          handleImageError={handleImageError}
        />

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || isSaving || isUploadingPhotos}
            className="h-[52px] w-full max-w-[280px] bg-primary text-lg font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Створення...' : 'Додати товар'}
          </button>

          {status && (
            <p
              role="status"
              className={`text-base ${
                status.type === 'error' ? 'text-danger' : 'text-success'
              }`}
            >
              {status.text}
            </p>
          )}
        </div>
      </form>
    </AdminPageLayout>
  )
}
