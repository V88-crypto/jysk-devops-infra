import { useState } from 'react'
import type { FormEvent } from 'react'

import type { Category, CategoryInput } from '@/features/admin/types/category'
import { fieldClass } from '@/features/admin/components/common/formFieldStyles'

import type { CategoryRow } from './categoryTree'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

interface CategoryFormProps {
  editing: Category | null
  parentOptions: CategoryRow[]
  isSaving: boolean
  onSubmit: (input: CategoryInput) => void
  onCancel: () => void
}

export const CategoryForm = ({
  editing,
  parentOptions,
  isSaving,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const [name, setName] = useState(editing?.name ?? '')
  const [slug, setSlug] = useState(editing?.slug ?? '')
  const [parentId, setParentId] = useState(editing?.parentId ?? null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedSlug = slug.trim()

    if (!trimmedName) {
      setValidationError('Вкажіть назву категорії')
      return
    }

    if (trimmedSlug && !SLUG_PATTERN.test(trimmedSlug)) {
      setValidationError(
        'Slug може містити лише малі латинські літери, цифри та дефіс',
      )
      return
    }

    setValidationError(null)
    onSubmit({ name: trimmedName, slug: trimmedSlug, parentId })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-md bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold">
        {editing ? `Редагування: ${editing.name}` : 'Нова категорія'}
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#333]">
          Назва
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSaving}
            placeholder="Наприклад, Дивани"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#333]">
          Slug
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            disabled={isSaving}
            placeholder="Створиться з назви"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-[#333]">
          Батьківська категорія
          <select
            value={parentId ?? ''}
            onChange={(event) =>
              setParentId(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            disabled={isSaving}
            className={fieldClass}
          >
            <option value="">Без батьківської (верхній рівень)</option>
            {parentOptions.map(({ category, depth }) => (
              <option key={category.id} value={category.id}>
                {`${'— '.repeat(depth)}${category.name}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {validationError && (
        <p role="alert" className="mt-3 text-sm text-[#d33]">
          {validationError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="h-[40px] rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Збереження...' : editing ? 'Зберегти' : 'Додати'}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="h-[40px] rounded-[4px] border border-[#c5c5c5] px-6 text-sm transition hover:border-primary hover:text-primary"
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  )
}
