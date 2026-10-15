import { useRef } from 'react'
import type { ChangeEvent, SyntheticEvent } from 'react'

import type { Attribute } from '@/features/admin/types/attribute'
import type { Category } from '@/features/admin/types/category'
import { ACCEPTED_IMAGE_TYPES } from '@/shared/api/uploads'
import {
  MAX_PRODUCT_IMAGES,
  categoryLabel,
} from '@/features/admin/components/EditAddProducts/utils/productHelpers'

import { TextField } from './TextField'
import { SelectField } from './SelectField'
import { TextAreaField } from './TextAreaField'
import { FlagOption } from './FlagOption'
import { AttributeRow } from './AttributeRow'
import { PhotoPreview } from './PhotoPreview'

import type { EditProductFormState } from '@/features/admin/components/EditAddProducts/types/productForm'

const buttonClass =
  'h-[56px] bg-primary px-10 text-lg font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60'

interface ProductFormFieldsProps {
  form: EditProductFormState
  categories: Category[]
  attributes: Attribute[]
  isLoading: boolean
  selectedPhotoText: string
  isUploadingPhotos: boolean
  photoError: string | null
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
  handlePhotoChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
  removePhoto: (imageIndex: number) => void
  handleImageError: (event: SyntheticEvent<HTMLImageElement>) => void
}

export const ProductFormFields = ({
  form,
  categories,
  attributes,
  isLoading,
  selectedPhotoText,
  isUploadingPhotos,
  photoError,
  updateField,
  updateAttributeRow,
  addAttributeRow,
  clearAttributes,
  handlePhotoChange,
  removePhoto,
  handleImageError,
}: ProductFormFieldsProps) => {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const isPhotoInputDisabled =
    isLoading ||
    isUploadingPhotos ||
    form.imageUrls.length >= MAX_PRODUCT_IMAGES

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
              {categoryLabel(category, categories)}
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

        <div className="flex flex-col gap-4 sm:flex-row">
          <TextField
            type="number"
            inputMode="decimal"
            placeholder="Введіть ціну..."
            value={form.price}
            disabled={isLoading}
            onChange={(event) => updateField('price', event.target.value)}
            className="w-full sm:w-[320px]"
          />

          <TextField
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="Залишок, шт."
            value={form.stock}
            disabled={isLoading}
            onChange={(event) => updateField('stock', event.target.value)}
            className="w-full sm:w-[220px]"
          />
        </div>
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
            onChange={(checked) => updateField('deliveryAvailable', checked)}
          />

          <FlagOption
            label="Чудова пропозиція"
            checked={form.isGreatOffer}
            disabled={isLoading}
            tone="black"
            onChange={(checked) => updateField('isGreatOffer', checked)}
          />
        </div>

        <p className="text-sm text-[#8a8a8a]">
          Знижка та позначки поки не зберігаються: бекенд їх ще не підтримує.
        </p>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold">Докладний опис товару</h2>

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
        <h2 className="mb-3 text-lg font-semibold">Характеристики товару</h2>

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
        <h2 className="mb-3 text-lg font-semibold">
          Фото товару ({form.imageUrls.length}/{MAX_PRODUCT_IMAGES})
        </h2>

        {form.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {form.imageUrls.map((imageUrl, imageIndex) => (
              <PhotoPreview
                key={`${imageUrl}-${imageIndex}`}
                imageUrl={imageUrl}
                imageIndex={imageIndex}
                disabled={isLoading || isUploadingPhotos}
                onError={handleImageError}
                onRemove={removePhoto}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex min-h-[56px] w-full flex-col border border-[#b9b9b9] bg-[#dedede] sm:flex-row sm:items-center">
          <label
            className={`flex min-h-[56px] flex-1 items-center overflow-hidden px-5 text-base text-[#4f4f4f] ${
              isPhotoInputDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <span className="truncate">{selectedPhotoText}</span>

            <input
              ref={photoInputRef}
              type="file"
              multiple
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              disabled={isPhotoInputDisabled}
              onChange={(event) => void handlePhotoChange(event)}
              className="hidden"
            />
          </label>

          <button
            type="button"
            disabled={isPhotoInputDisabled}
            onClick={() => photoInputRef.current?.click()}
            className="m-2 h-[44px] w-[150px] rounded-[5px] bg-primary text-base font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingPhotos ? 'Завантаження...' : 'Завантажити'}
          </button>
        </div>

        {photoError && (
          <p className="mt-2 text-sm text-red-500">{photoError}</p>
        )}

        <p className="mt-2 text-sm text-[#8a8a8a]">
          JPEG, PNG або WEBP до 5 МБ. Перше фото буде головним.
        </p>
      </section>
    </>
  )
}
