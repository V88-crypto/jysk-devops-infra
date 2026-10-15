import { useEffect, useMemo, useState } from 'react'

import { catalogApi } from '@/features/admin/api/catalogApi'
import type { Attribute } from '@/features/admin/types/attribute'
import type { Category, CategoryInput } from '@/features/admin/types/category'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'
import { RowDeleteButton } from '@/features/admin/components/common/RowDeleteButton'
import { RowEditButton } from '@/features/admin/components/common/RowEditButton'

import { AttributesPanel } from './AttributesPanel'
import { CategoryForm } from './CategoryForm'
import { catalogErrorMessage } from './catalogErrors'
import { collectDescendantIds, flattenCategoryTree } from './categoryTree'

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [attributes, setAttributes] = useState<Attribute[] | null>(null)
  const [loadError, setLoadError] = useState({
    categories: false,
    attributes: false,
  })

  const [editing, setEditing] = useState<Category | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    let isActive = true

    const markFailed = (key: 'categories' | 'attributes') => {
      if (isActive) {
        setLoadError((current) => ({ ...current, [key]: true }))
      }
    }

    catalogApi
      .getCategories()
      .then((items) => {
        if (isActive) {
          setCategories(items)
        }
      })
      .catch(() => markFailed('categories'))

    catalogApi
      .getAttributes()
      .then((items) => {
        if (isActive) {
          setAttributes(items)
        }
      })
      .catch(() => markFailed('attributes'))

    return () => {
      isActive = false
    }
  }, [])

  const rows = useMemo(
    () => flattenCategoryTree(categories ?? []),
    [categories],
  )

  // A category cannot be moved under itself or any of its own subcategories.
  const parentOptions = useMemo(() => {
    if (!editing || !categories) {
      return rows
    }

    const blockedIds = collectDescendantIds(categories, editing.id)

    return rows.filter(({ category }) => !blockedIds.has(category.id))
  }, [rows, editing, categories])

  const nameById = useMemo(
    () => new Map((categories ?? []).map((item) => [item.id, item.name])),
    [categories],
  )

  const resetForm = () => {
    setEditing(null)
    setFormKey((current) => current + 1)
  }

  const handleSubmit = async (input: CategoryInput) => {
    setIsSaving(true)
    setMessage(null)

    try {
      if (editing) {
        const updated = await catalogApi.updateCategory(editing.id, input)
        setCategories((current) =>
          (current ?? []).map((item) =>
            item.id === updated.id ? updated : item,
          ),
        )
        setMessage({
          type: 'success',
          text: `Категорію «${updated.name}» збережено`,
        })
      } else {
        const created = await catalogApi.createCategory(input)
        setCategories((current) => [...(current ?? []), created])
        setMessage({
          type: 'success',
          text: `Категорію «${created.name}» додано`,
        })
      }

      resetForm()
    } catch (error) {
      setMessage({
        type: 'error',
        text: catalogErrorMessage(error, 'Не вдалося зберегти категорію'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Видалити категорію «${category.name}»?`)) {
      return
    }

    setDeletingId(category.id)
    setMessage(null)

    try {
      await catalogApi.deleteCategory(category.id)
      setCategories((current) =>
        (current ?? []).filter((item) => item.id !== category.id),
      )

      if (editing?.id === category.id) {
        resetForm()
      }

      setMessage({
        type: 'success',
        text: `Категорію «${category.name}» видалено`,
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: catalogErrorMessage(error, 'Не вдалося видалити категорію'),
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (category: Category) => {
    setEditing(category)
    setMessage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderStatus = () => {
    if (loadError.categories) {
      return (
        <p className="px-4 py-10 text-center text-danger">
          Не вдалося завантажити категорії
        </p>
      )
    }

    if (!categories) {
      return (
        <p className="px-4 py-10 text-center text-fg-subtle">Завантаження...</p>
      )
    }

    if (categories.length === 0) {
      return (
        <p className="px-4 py-10 text-center text-fg-subtle">
          Категорій поки немає
        </p>
      )
    }

    return null
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Категорії</h1>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-strong px-2 text-sm font-medium text-fg-muted">
          {categories?.length ?? 0}
        </span>
      </div>

      <CategoryForm
        key={editing ? `edit-${editing.id}` : `new-${formKey}`}
        editing={editing}
        parentOptions={parentOptions}
        isSaving={isSaving}
        onSubmit={(input) => void handleSubmit(input)}
        onCancel={resetForm}
      />

      {message && (
        <p
          role="status"
          className={`mb-4 rounded-md px-4 py-3 text-sm ${
            message.type === 'error'
              ? 'bg-danger-soft text-danger'
              : 'bg-success-soft text-success'
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="overflow-x-auto rounded-md bg-surface shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg-subtle">
              <th className="px-4 py-3 font-normal">Назва</th>
              <th className="px-4 py-3 font-normal">Slug</th>
              <th className="px-4 py-3 font-normal">Батьківська</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {rows.map(({ category, depth }) => (
              <tr
                key={category.id}
                className={`border-b border-line last:border-0 ${
                  editing?.id === category.id ? 'bg-primary-soft' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <span
                    style={{ paddingLeft: `${depth * 20}px` }}
                    className={depth === 0 ? 'font-semibold' : ''}
                  >
                    {depth > 0 && <span className="text-fg-subtle">└ </span>}
                    {category.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-fg-muted">{category.slug}</td>
                <td className="px-4 py-3 text-fg-muted">
                  {category.parentId === null
                    ? '—'
                    : nameById.get(category.parentId)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <RowEditButton onClick={() => handleEdit(category)} />
                    <RowDeleteButton
                      disabled={deletingId === category.id}
                      onClick={() => void handleDelete(category)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderStatus()}
      </div>

      <AttributesPanel
        attributes={attributes}
        loadError={loadError.attributes}
        onCreated={(attribute) =>
          setAttributes((current) => [...(current ?? []), attribute])
        }
      />
    </AdminPageLayout>
  )
}
