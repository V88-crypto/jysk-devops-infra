import type { ChangeEvent, SyntheticEvent } from 'react'

import type { Attribute } from '@/features/types/attribute'
import type { Category } from '@/features/types/category'

import { TextField } from './TextField'
import { SelectField } from './SelectField'
import { TextAreaField } from './TextAreaField'
import { FlagOption } from './FlagOption'
import { AttributeRow } from './AttributeRow'
import { PhotoPreview } from './PhotoPreview'

import type { EditProductFormState } from '@/features/components/adminPanel/components/EditAddProducts/types/productForm'

const buttonClass =
  'h-[56px] bg-primary px-10 text-lg font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60'

interface ProductFormFieldsProps {
  form: EditProductFormState
  categories: Category[]
  attributes: Attribute[]
  isLoading: boolean
  selectedPhotoText: string
  showAddGalleryButton?: boolean
  updateField: <Field extends keyof EditProductFormState>(
    field: Field,
    value: EditProductFormState[Field],
  ) => void
  updateAttributeRow: (
    rowId: number,
    field: 'name' | 'value',
    value: string,
  ) => void
  addAttributeRow: () => void
  clearAttributes: () => void
  handlePhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleImageError: (event: SyntheticEvent<HTMLImageElement>) => void
}

export const ProductFormFields = ({
  form,
  categories,
  attributes,
  isLoading,
  selectedPhotoText,
  showAddGalleryButton = false,
  updateField,
  updateAttributeRow,
  addAttributeRow,
  clearAttributes,
  handlePhotoChange,
  handleImageError,
}: ProductFormFieldsProps) => {
  return (
    <>
      <section className="space-y-4">
        <TextField
          type="text"
          placeholder="Введіть артикул..."
          value={form.sku}
          disabled={isLoading}
          onChange={(event) => updateField('sku', event.target.value)}
        />

        <TextField
          type="text"
          placeholder="Введіть назву товару..."
          value={form.name}
          disabled={isLoading}
          onChange={(event) => updateField('name', event.target.value)}
        />

        <SelectField
          value={form.categoryId}
          disabled={isLoading}
          onChange={(event) => updateField('categoryId', event.target.value)}
        >
          <option value="">Виберіть категорію</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>

        <TextField
          type="text"
          placeholder="Введіть короткий опис товару..."
          value={form.shortDescription}
          disabled={isLoading}
          onChange={(event) =>
            updateField('shortDescription', event.target.value)
          }
        />

        <TextField
          type="number"
          inputMode="decimal"
          placeholder="Введіть ціну..."
          value={form.price}
          disabled={isLoading}
          onChange={(event) => updateField('price', event.target.value)}
          className="w-full sm:w-[320px]"
        />
      </section>

      <section className="mt-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <FlagOption
            label="Завжди низька ціна"
            checked={form.alwaysLowPrice}
            disabled={isLoading}
            onChange={(checked) => updateField('alwaysLowPrice', checked)}
          />

          <TextField
            type="number"
            min="0"
            max="100"
            inputMode="decimal"
            placeholder="Введіть % знижки..."
            value={form.discount}
            disabled={isLoading}
            onChange={(event) => updateField('discount', event.target.value)}
            className="w-full sm:w-[280px]"
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <FlagOption
            label="Новинка"
            checked={form.isNew}
            disabled={isLoading}
            onChange={(checked) => updateField('isNew', checked)}
          />

          <FlagOption
            label="Можлива доставка"
            checked={form.deliveryAvailable}
            disabled={isLoading}
            onChange={(checked) =>
              updateField('deliveryAvailable', checked)
            }
          />

          <FlagOption
            label="Чудова пропозиція"
            checked={form.isGreatOffer}
            disabled={isLoading}
            tone="black"
            onChange={(checked) => updateField('isGreatOffer', checked)}
          />
        </div>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold">
          Докладний опис товару
        </h2>

        <TextAreaField
          placeholder="Введіть опис товару"
          value={form.detailedDescription}
          disabled={isLoading}
          onChange={(event) =>
            updateField('detailedDescription', event.target.value)
          }
        />
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold">
          Характеристики товару
        </h2>

        <div className="space-y-3">
          {form.attributes.map((attribute) => (
            <AttributeRow
              key={attribute.id}
              row={attribute}
              disabled={isLoading}
              onChange={updateAttributeRow}
            />
          ))}
        </div>

        <datalist id="product-attributes">
          {attributes.map((attribute) => (
            <option key={attribute.id} value={attribute.name} />
          ))}
        </datalist>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={addAttributeRow}
            className={buttonClass}
          >
            Додати характеристику
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={clearAttributes}
            className={buttonClass}
          >
            Очистити всі характеристики
          </button>
        </div>
      </section>

      <section className="mt-7">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {form.imageUrls.slice(0, 4).map((imageUrl, imageIndex) => (
            <PhotoPreview
              key={`${imageUrl}-${imageIndex}`}
              imageUrl={imageUrl}
              imageIndex={imageIndex}
              onError={handleImageError}
            />
          ))}
        </div>

        <div className="mt-6 flex min-h-[56px] w-full flex-col border border-[#b9b9b9] bg-[#dedede] sm:flex-row sm:items-center">
          <label className="flex min-h-[56px] flex-1 cursor-pointer items-center overflow-hidden px-5 text-base text-[#4f4f4f]">
            <span className="truncate">{selectedPhotoText}</span>

            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isLoading}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            disabled={isLoading}
            className="m-2 h-[44px] w-[150px] rounded-[5px] bg-primary text-base font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            Завантажити
          </button>
        </div>

        {showAddGalleryButton && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              disabled={isLoading}
              className="h-[52px] w-full max-w-[280px] bg-primary text-base font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Додати галерею
            </button>
          </div>
        )}
      </section>
    </>
  )
}
