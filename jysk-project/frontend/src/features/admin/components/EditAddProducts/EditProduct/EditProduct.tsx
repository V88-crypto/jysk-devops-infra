import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { attributeService } from '@/features/admin/api/attributeService'
import { categoryService } from '@/features/admin/api/categoryService'
import { productService } from '@/features/admin/api/productService'

import type { Attribute } from '@/features/admin/types/attribute'
import type { Category } from '@/features/admin/types/category'
import type { Product } from '@/features/admin/types/product'

import { ProductFormFields } from '@/features/admin/components/EditAddProducts/components/ProductFormFields'
import { useProductFormState } from '@/features/admin/components/EditAddProducts/hooks/useProductFormState'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

import { mapFormToProduct, mapProductToForm } from './utils/productMapper'

export const EditProduct = () => {
  const { id } = useParams()
  const productId = Number(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [product, setProduct] = useState<Product | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const {
    form,
    setForm,
    selectedPhotoText,
    updateField,
    updateAttributeRow,
    addAttributeRow,
    clearAttributes,
    handlePhotoChange,
    handleImageError,
  } = useProductFormState(attributes)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      try {
        const [loadedProduct, loadedCategories, loadedAttributes] =
          await Promise.all([
            productService.getById(productId),
            categoryService.getAll(),
            attributeService.getAll(),
          ])

        if (!isMounted) {
          return
        }

        setCategories(loadedCategories)
        setAttributes(loadedAttributes)

        if (loadedProduct) {
          setProduct(loadedProduct)
          setForm(mapProductToForm(loadedProduct, loadedAttributes))
          return
        }

        setStatusMessage('Товар не знайдено')
      } catch {
        if (isMounted) {
          setStatusMessage('Не вдалося завантажити товар')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProduct()

    return () => {
      isMounted = false
    }
  }, [setForm, productId])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!product) {
      return
    }

    setIsSaving(true)
    setStatusMessage('')

    try {
      const updatedProduct = await productService.update(
        mapFormToProduct(product, form, attributes),
      )

      setProduct(updatedProduct)
      setForm(mapProductToForm(updatedProduct, attributes))
      setStatusMessage('Товар збережено')
    } catch {
      setStatusMessage('Не вдалося зберегти товар')
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
          <span className="text-lg">‹</span> Редагування товару
        </button>

        <ProductFormFields
          form={form}
          categories={categories}
          attributes={attributes}
          isLoading={isLoading}
          selectedPhotoText={selectedPhotoText}
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
            disabled={isLoading || isSaving || !product}
            className="h-[52px] w-full max-w-[280px] bg-primary text-lg font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Збереження...' : 'Зберегти'}
          </button>

          {statusMessage && (
            <p className="text-base text-[#555]">{statusMessage}</p>
          )}
        </div>
      </form>
    </AdminPageLayout>
  )
}
