import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { attributeService } from '@/features/admin/api/attributeService'
import { categoryService } from '@/features/admin/api/categoryService'
import { productService } from '@/features/admin/api/productService'

import type { Attribute } from '@/features/admin/types/attribute'
import type { Category } from '@/features/admin/types/category'

import { ProductFormFields } from '@/features/admin/components/EditAddProducts/components/ProductFormFields'
import { useProductFormState } from '@/features/admin/components/EditAddProducts/hooks/useProductFormState'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

import { emptyProductFormState } from '@/features/admin/components/EditAddProducts/utils/productHelpers'

import { mapFormToNewProduct } from './utils/productsMapper'

export const AddProduct = () => {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const {
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
  } = useProductFormState(attributes)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const [loadedCategories, loadedAttributes] = await Promise.all([
          categoryService.getAll(),
          attributeService.getAll(),
        ])

        if (!isMounted) {
          return
        }

        setCategories(loadedCategories)
        setAttributes(loadedAttributes)
      } catch {
        if (isMounted) {
          setStatusMessage('Не вдалося завантажити дані')
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

    setIsSaving(true)
    setStatusMessage('')

    try {
      const newProduct = mapFormToNewProduct(form, attributes)

      await productService.create(newProduct)

      setStatusMessage('Товар створено')
      setForm(emptyProductFormState())
      setSelectedPhotoText('Виберіть фото... (до 4 шт.)')
    } catch {
      setStatusMessage('Не вдалося створити товар')
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
          showAddGalleryButton
          updateField={updateField}
          updateAttributeRow={updateAttributeRow}
          addAttributeRow={addAttributeRow}
          clearAttributes={clearAttributes}
          handlePhotoChange={handlePhotoChange}
          handleImageError={handleImageError}
        />

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || isSaving}
            className="h-[52px] w-full max-w-[280px] bg-primary text-lg font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Створення...' : 'Додати товар'}
          </button>

          {statusMessage && (
            <p className="text-base text-[#555]">{statusMessage}</p>
          )}
        </div>
      </form>
    </AdminPageLayout>
  )
}
