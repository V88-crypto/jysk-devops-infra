import { useState } from 'react'
import type { FormEvent } from 'react'

import { catalogApi } from '@/features/admin/api/catalogApi'
import type { Attribute } from '@/features/admin/types/attribute'
import { fieldClass } from '@/features/admin/components/common/formFieldStyles'

import { catalogErrorMessage } from './catalogErrors'

interface AttributesPanelProps {
  attributes: Attribute[] | null
  loadError: boolean
  onCreated: (attribute: Attribute) => void
}

export const AttributesPanel = ({
  attributes,
  loadError,
  onCreated,
}: AttributesPanelProps) => {
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Вкажіть назву атрибута')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      onCreated(await catalogApi.createAttribute(trimmedName))
      setName('')
    } catch (createError) {
      setError(catalogErrorMessage(createError, 'Не вдалося додати атрибут'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mt-8 rounded-md bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center gap-3">
        <h2 className="text-lg font-semibold">Атрибути товарів</h2>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
          {attributes?.length ?? 0}
        </span>
      </div>

      <p className="mb-4 text-sm text-[#8a8a8a]">
        Характеристики варіантів, наприклад колір або розмір. Значення задаються
        у формі товару.
      </p>

      {loadError && (
        <p className="mb-4 text-sm text-[#d33]">
          Не вдалося завантажити атрибути
        </p>
      )}

      {!attributes && !loadError && (
        <p className="mb-4 text-sm text-[#8a8a8a]">Завантаження...</p>
      )}

      {attributes && attributes.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2">
          {attributes.map((attribute) => (
            <li
              key={attribute.id}
              className="rounded-full bg-[#eef8f8] px-3 py-1 text-sm text-primary-hover"
            >
              {attribute.name}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isSaving}
          placeholder="Новий атрибут"
          aria-label="Назва нового атрибута"
          className={`${fieldClass} sm:max-w-[320px]`}
        />

        <button
          type="submit"
          disabled={isSaving}
          className="h-[44px] shrink-0 rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Додавання...' : 'Додати атрибут'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm text-[#d33]">
          {error}
        </p>
      )}
    </section>
  )
}
