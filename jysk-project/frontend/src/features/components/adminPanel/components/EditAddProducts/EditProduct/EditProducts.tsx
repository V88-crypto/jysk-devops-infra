import { useEffect, useState } from 'react'
import type {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
} from 'react'

import { attributeService } from '../../../services/attributeService'
import { categoryService } from '../../../services/categoryService'
import { productService } from '../../../services/productService'

import type { Attribute } from '../../../../../types/attribute'
import type { Category } from '../../../../../types/category'
import type { Product } from '../../../../../types/product'

import { TextField } from '../components/TextField'
import { SelectField } from '../components/SelectField'
import { TextAreaField } from '../components/TextAreaField'
import { FlagOption } from '../components/FlagOption'
import { AttributeRow } from '../components/AttributeRow'
import { PhotoPreview } from '../components/PhotoPreview'

import type { EditProductFormState } from '../types/productForm'

import {
  IMAGE_FALLBACK_URL,
  emptyAttributeRows,
} from '../utils/productHelpers'

import {
  mapFormToProduct,
  mapProductToForm,
} from './utils/productMapper'

const EDIT_PRODUCT_ID = 1

const buttonClass =
  'h-[56px] bg-[#00a9ad] px-10 text-lg font-semibold text-white transition hover:bg-[#008f93] disabled:cursor-not-allowed disabled:opacity-60'

export const EditProduct = () => {
  const [categories, setCategories] =
    useState<Category[]>([])

  const [attributes, setAttributes] =
    useState<Attribute[]>([])

  const [product, setProduct] =
    useState<Product | null>(null)

  const [form, setForm] =
    useState<EditProductFormState>({
      sku: '',
      name: '',
      categoryId: '',
      shortDescription: '',
      detailedDescription: '',
      price: '',
      discount: '',
      alwaysLowPrice: false,
      isNew: false,
      deliveryAvailable: false,
      isGreatOffer: true,
      attributes:
        emptyAttributeRows(),
      imageUrls: [],
    })

  const [selectedPhotoText, setSelectedPhotoText] =
    useState(
      'Виберіть фото... (до 4 шт.)',
    )

  const [isLoading, setIsLoading] =
    useState(true)

  const [isSaving, setIsSaving] =
    useState(false)

  const [statusMessage, setStatusMessage] =
    useState('')

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      try {
        const [
          loadedProduct,
          loadedCategories,
          loadedAttributes,
        ] = await Promise.all([
          productService.getById(
            EDIT_PRODUCT_ID,
          ),
          categoryService.getAll(),
          attributeService.getAll(),
        ])

        if (!isMounted) {
          return
        }

        setCategories(
          loadedCategories,
        )

        setAttributes(
          loadedAttributes,
        )

        if (loadedProduct) {
          setProduct(
            loadedProduct,
          )

          setForm(
            mapProductToForm(
              loadedProduct,
              loadedAttributes,
            ),
          )

          return
        }

        setStatusMessage(
          'Товар не знайдено',
        )
      } catch {
        if (isMounted) {
          setStatusMessage(
            'Не вдалося завантажити товар',
          )
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
  }, [])

  const updateField = <
    Field extends keyof EditProductFormState,
  >(
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

      attributes:
        currentForm.attributes.map(
          (attribute) => {
            if (
              attribute.id !== rowId
            ) {
              return attribute
            }

            const matchedAttribute =
              field === 'name'
                ? attributes.find(
                    (item) =>
                      item.name
                        .trim()
                        .toLocaleLowerCase(
                          'uk-UA',
                        ) ===
                      value
                        .trim()
                        .toLocaleLowerCase(
                          'uk-UA',
                        ),
                  )
                : null

            return {
              ...attribute,

              [field]: value,

              attributeId:
                field === 'name'
                  ? matchedAttribute?.id ??
                    null
                  : attribute.attributeId,
            }
          },
        ),
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
    updateField(
      'attributes',
      emptyAttributeRows(),
    )
  }

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.currentTarget.files ?? [],
    ).slice(0, 4)

    setSelectedPhotoText(
      files.length
        ? files
            .map(
              (file) =>
                file.name,
            )
            .join(', ')
        : 'Виберіть фото... (до 4 шт.)',
    )
  }

  const handleImageError = (
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    event.currentTarget.src =
      IMAGE_FALLBACK_URL
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!product) {
      return
    }

    setIsSaving(true)
    setStatusMessage('')

    try {
      const updatedProduct =
        await productService.update(
          mapFormToProduct(
            product,
            form,
            attributes,
          ),
        )

      setProduct(
        updatedProduct,
      )

      setForm(
        mapProductToForm(
          updatedProduct,
          attributes,
        ),
      )

      setStatusMessage(
        'Товар збережено',
      )
    } catch {
      setStatusMessage(
        'Не вдалося зберегти товар',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] px-4 py-6 pt-[84px] text-[#202020] sm:px-6 md:ml-[160px] md:px-10 md:pt-8 lg:px-12">
      <form
        className="w-full max-w-[1400px]"
        onSubmit={(event) =>
          void handleSubmit(event)
        }
      >
        <h1 className="mb-7 text-2xl font-semibold">
          Редагування товару
        </h1>

        <section className="space-y-4">
          <TextField
            type="text"
            placeholder="Введіть артикул..."
            value={form.sku}
            disabled={isLoading}
            onChange={(event) =>
              updateField(
                'sku',
                event.target.value,
              )
            }
          />

          <TextField
            type="text"
            placeholder="Введіть назву товару..."
            value={form.name}
            disabled={isLoading}
            onChange={(event) =>
              updateField(
                'name',
                event.target.value,
              )
            }
          />

          <SelectField
            value={form.categoryId}
            disabled={isLoading}
            onChange={(event) =>
              updateField(
                'categoryId',
                event.target.value,
              )
            }
          >
            <option value="">
              Виберіть категорію
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ),
            )}
          </SelectField>

          <TextField
            type="text"
            placeholder="Введіть короткий опис товару..."
            value={
              form.shortDescription
            }
            disabled={isLoading}
            onChange={(event) =>
              updateField(
                'shortDescription',
                event.target.value,
              )
            }
          />

          <TextField
            type="number"
            inputMode="decimal"
            placeholder="Введіть ціну..."
            value={form.price}
            disabled={isLoading}
            onChange={(event) =>
              updateField(
                'price',
                event.target.value,
              )
            }
            className="w-full sm:w-[320px]"
          />
        </section>

        <section className="mt-5 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <FlagOption
              label="Завжди низька ціна"
              checked={
                form.alwaysLowPrice
              }
              disabled={isLoading}
              onChange={(checked) =>
                updateField(
                  'alwaysLowPrice',
                  checked,
                )
              }
            />

            <TextField
              type="number"
              min="0"
              max="100"
              inputMode="decimal"
              placeholder="Введіть % знижки..."
              value={form.discount}
              disabled={isLoading}
              onChange={(event) =>
                updateField(
                  'discount',
                  event.target.value,
                )
              }
              className="w-full sm:w-[280px]"
            />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <FlagOption
              label="Новинка"
              checked={form.isNew}
              disabled={isLoading}
              onChange={(checked) =>
                updateField(
                  'isNew',
                  checked,
                )
              }
            />

            <FlagOption
              label="Можлива доставка"
              checked={
                form.deliveryAvailable
              }
              disabled={isLoading}
              onChange={(checked) =>
                updateField(
                  'deliveryAvailable',
                  checked,
                )
              }
            />

            <FlagOption
              label="Чудова пропозиція"
              checked={
                form.isGreatOffer
              }
              disabled={isLoading}
              tone="black"
              onChange={(checked) =>
                updateField(
                  'isGreatOffer',
                  checked,
                )
              }
            />
          </div>
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-lg font-semibold">
            Докладний опис товару
          </h2>

          <TextAreaField
            placeholder="Введіть опис товару"
            value={
              form.detailedDescription
            }
            disabled={isLoading}
            onChange={(event) =>
              updateField(
                'detailedDescription',
                event.target.value,
              )
            }
          />
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-lg font-semibold">
            Характеристики товару
          </h2>

          <div className="space-y-3">
            {form.attributes.map(
              (attribute) => (
                <AttributeRow
                  key={attribute.id}
                  row={attribute}
                  disabled={isLoading}
                  onChange={
                    updateAttributeRow
                  }
                />
              ),
            )}
          </div>

          <datalist id="product-attributes">
            {attributes.map(
              (attribute) => (
                <option
                  key={attribute.id}
                  value={attribute.name}
                />
              ),
            )}
          </datalist>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={
                addAttributeRow
              }
              className={buttonClass}
            >
              Додати характеристику
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={
                clearAttributes
              }
              className={buttonClass}
            >
              Очистити всі характеристики
            </button>
          </div>
        </section>

        <section className="mt-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {form.imageUrls
              .slice(0, 4)
              .map(
                (
                  imageUrl,
                  imageIndex,
                ) => (
                  <PhotoPreview
                    key={`${imageUrl}-${imageIndex}`}
                    imageUrl={imageUrl}
                    imageIndex={
                      imageIndex
                    }
                    onError={
                      handleImageError
                    }
                  />
                ),
              )}
          </div>

          <div className="mt-6 flex min-h-[56px] w-full flex-col border border-[#b9b9b9] bg-[#dedede] sm:flex-row sm:items-center">
            <label className="flex min-h-[56px] flex-1 cursor-pointer items-center overflow-hidden px-5 text-base text-[#4f4f4f]">
              <span className="truncate">
                {selectedPhotoText}
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                disabled={isLoading}
                onChange={
                  handlePhotoChange
                }
                className="hidden"
              />
            </label>

            <button
              type="button"
              disabled={isLoading}
              className="m-2 h-[44px] w-[150px] rounded-[5px] bg-[#00a9ad] text-base font-semibold text-white transition hover:bg-[#008f93] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Завантажити
            </button>
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={
              isLoading ||
              isSaving ||
              !product
            }
            className="h-[52px] w-full max-w-[280px] bg-[#00a9ad] text-lg font-semibold text-white transition hover:bg-[#008f93] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? 'Збереження...'
              : 'Зберегти'}
          </button>

          {statusMessage && (
            <p className="text-base text-[#555]">
              {statusMessage}
            </p>
          )}
        </div>
      </form>
    </main>
  )
}