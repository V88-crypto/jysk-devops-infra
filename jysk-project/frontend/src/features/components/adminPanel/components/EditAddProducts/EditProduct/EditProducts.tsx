import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { attributeService } from '../../../services/attributeService'
import { categoryService } from '../../../services/categoryService'
import { productService } from '../../../services/productService'

import type { Attribute } from '../../../../../types/attribute'
import type { Category } from '../../../../../types/category'
import type { Product } from '../../../../../types/product'

import { ProductFormFields } from '../components/ProductFormFields'
import { useProductFormState } from '../hooks/useProductFormState'

import {
  mapFormToProduct,
  mapProductToForm,
} from './utils/productMapper'

const EDIT_PRODUCT_ID = 1

export const EditProduct = () => {
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
            productService.getById(EDIT_PRODUCT_ID),
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
  }, [setForm])

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
    <main className="min-h-screen bg-[#f4f4f4] px-4 py-6 pt-[84px] text-[#202020] sm:px-6 md:ml-[160px] md:px-10 md:pt-8 lg:px-12">
      <form
        className="w-full max-w-[1400px]"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <h1 className="mb-7 text-2xl font-semibold">
          Редагування товару
        </h1>

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
            className="h-[52px] w-full max-w-[280px] bg-[#00a9ad] text-lg font-semibold text-white transition hover:bg-[#008f93] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Збереження...' : 'Зберегти'}
          </button>

          {statusMessage && (
            <p className="text-base text-[#555]">{statusMessage}</p>
          )}
        </div>
      </form>
    </main>
  )
}
