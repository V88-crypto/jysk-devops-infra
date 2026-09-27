import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'

import { blogCategoryService } from '@/features/components/adminPanel/services/blogCategoryService'
import { blogPostService } from '@/features/components/adminPanel/services/blogPostService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { fieldClass } from '@/features/components/adminPanel/components/common/formFieldStyles'
import { AdminPageLayout } from '@/features/components/adminPanel/components/common/AdminPageLayout'
import { PhotoUploadRow } from '@/features/components/adminPanel/components/common/PhotoUploadRow'
import { RowDeleteButton } from '@/features/components/adminPanel/components/common/RowDeleteButton'

import type { BlogContentBlock, BlogPost } from '@/features/types/homePage'

interface EditBlogFormProps {
  postId: number
  onBack: () => void
  onSaved: () => void
}

interface BlogFormState {
  title: string
  category: string
  imageUrl: string
  imageAlt: string
  contentBlocks: BlogContentBlock[]
  keywords: string[]
}

const primaryButtonClass =
  'h-[44px] rounded-[4px] bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark'

const dangerButtonClass =
  'h-[44px] rounded-[4px] bg-[#e31b23] px-5 text-sm font-semibold text-white transition hover:bg-[#c8151c]'

const nextId = (items: { id: number }[]) =>
  items.reduce((max, item) => Math.max(max, item.id), 0) + 1

export const EditBlogForm = ({ postId, onBack, onSaved }: EditBlogFormProps) => {
  const fetchPost = useCallback(() => blogPostService.getById(postId), [postId])

  const { data: post, isLoading: isPostLoading } = useAsyncData(fetchPost)
  const { data: categories } = useAsyncData(blogCategoryService.getAll)

  const [form, setForm] = useState<BlogFormState | null>(null)
  const [formSourcePost, setFormSourcePost] = useState<BlogPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  if (post && post !== formSourcePost) {
    setFormSourcePost(post)
    setForm({
      title: post.title,
      category: post.category ?? '',
      imageUrl: post.imageUrl,
      imageAlt: post.imageAlt,
      contentBlocks: (post.contentBlocks ?? []).map((block) => ({
        ...block,
        images: [...block.images],
      })),
      keywords: [...(post.keywords ?? [])],
    })
  }

  const updateBlock = <Field extends keyof BlogContentBlock>(
    blockId: number,
    field: Field,
    value: BlogContentBlock[Field],
  ) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        contentBlocks: current.contentBlocks.map((block) =>
          block.id === blockId ? { ...block, [field]: value } : block,
        ),
      }
    })
  }

  const addBlock = (type: BlogContentBlock['type']) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      const newBlock: BlogContentBlock = {
        id: nextId(current.contentBlocks),
        type,
        images: [],
        title: '',
        body: '',
      }

      return { ...current, contentBlocks: [...current.contentBlocks, newBlock] }
    })
  }

  const removeBlock = (blockId: number) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        contentBlocks: current.contentBlocks.filter(
          (block) => block.id !== blockId,
        ),
      }
    })
  }

  const clearContentBlocks = () => {
    setForm((current) => (current ? { ...current, contentBlocks: [] } : current))
  }

  const addKeyword = () => {
    setForm((current) =>
      current ? { ...current, keywords: [...current.keywords, ''] } : current,
    )
  }

  const updateKeyword = (index: number, value: string) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        keywords: current.keywords.map((keyword, keywordIndex) =>
          keywordIndex === index ? value : keyword,
        ),
      }
    })
  }

  const removeKeyword = (index: number) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        keywords: current.keywords.filter(
          (_, keywordIndex) => keywordIndex !== index,
        ),
      }
    })
  }

  const clearKeywords = () => {
    setForm((current) => (current ? { ...current, keywords: [] } : current))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!post || !form) {
      return
    }

    setIsSaving(true)

    try {
      await blogPostService.update({
        ...post,
        title: form.title,
        category: form.category || undefined,
        imageUrl: form.imageUrl,
        imageAlt: form.imageAlt,
        contentBlocks: form.contentBlocks,
        keywords: form.keywords.filter((keyword) => keyword.trim()),
      })

      onSaved()
    } finally {
      setIsSaving(false)
    }
  }

  const isLoading = isPostLoading || !form

  return (
    <AdminPageLayout>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-2xl font-semibold transition-opacity hover:opacity-70"
      >
        <span className="text-lg">‹</span> Редагування блогу
      </button>

      <div className="mb-6 border-t border-[#e0e0e0]" />

      {isLoading || !form ? (
        <p className="text-[#8a8a8a]">Завантаження...</p>
      ) : (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex max-w-[720px] flex-col gap-6"
        >
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Заголовок блогу"
            className={fieldClass}
          />

          <select
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value })
            }
            className={fieldClass}
          >
            <option value="">Виберіть категорію</option>

            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Обкладинка блогу</h2>

            <div className="flex flex-wrap items-start gap-3">
              {form.imageUrl && (
                <div className="flex items-start gap-2">
                  <div className="h-[100px] w-[140px] overflow-hidden rounded bg-neutral-100">
                    <img
                      src={form.imageUrl}
                      alt={form.imageAlt}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <RowDeleteButton
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                  />
                </div>
              )}
            </div>

            <div className="mt-3">
              <PhotoUploadRow
                onFilesSelected={(files) => {
                  const file = files[0]

                  if (file) {
                    setForm({
                      ...form,
                      imageUrl: URL.createObjectURL(file),
                      imageAlt: file.name,
                    })
                  }
                }}
              />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Вміст блогу</h2>

            <div className="flex flex-col gap-5">
              {form.contentBlocks.map((block) =>
                block.type === 'gallery' ? (
                  <div key={block.id}>
                    <div className="flex flex-wrap items-start gap-3">
                      {block.images.map((image, imageIndex) => (
                        <div
                          key={`${block.id}-${imageIndex}`}
                          className="h-[100px] w-[140px] overflow-hidden rounded bg-neutral-100"
                        >
                          <img
                            src={image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}

                      <RowDeleteButton onClick={() => removeBlock(block.id)} />
                    </div>

                    <div className="mt-3">
                      <PhotoUploadRow
                        multiple
                        onFilesSelected={(files) => {
                          if (!files.length) {
                            return
                          }

                          updateBlock(block.id, 'images', [
                            ...block.images,
                            ...files.map((file) => URL.createObjectURL(file)),
                          ])
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    key={block.id}
                    className="rounded-md border border-[#e0e0e0] bg-white p-4 shadow-sm"
                  >
                    <input
                      type="text"
                      value={block.title}
                      onChange={(event) =>
                        updateBlock(block.id, 'title', event.target.value)
                      }
                      placeholder="Заголовок блоку"
                      className="mb-2 w-full border-none bg-transparent text-base font-semibold text-[#202020] outline-none placeholder:text-[#8a8a8a]"
                    />

                    <textarea
                      value={block.body}
                      onChange={(event) =>
                        updateBlock(block.id, 'body', event.target.value)
                      }
                      placeholder="Текст блоку"
                      rows={6}
                      className="w-full resize-none border-none bg-transparent text-sm text-[#555] outline-none placeholder:text-[#8a8a8a]"
                    />

                    <div className="mt-2 flex justify-end">
                      <RowDeleteButton onClick={() => removeBlock(block.id)} />
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addBlock('gallery')}
                className={primaryButtonClass}
              >
                Додати галерею
              </button>

              <button
                type="button"
                onClick={() => addBlock('text')}
                className={primaryButtonClass}
              >
                Додати текстове поле
              </button>

              <button
                type="button"
                onClick={clearContentBlocks}
                className={dangerButtonClass}
              >
                Очистити вміст блогу
              </button>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Ключові слова</h2>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {form.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-[#d5d5d5] bg-white px-3 py-1.5 text-sm"
                >
                  <input
                    type="text"
                    value={keyword}
                    onChange={(event) => updateKeyword(index, event.target.value)}
                    placeholder="Ключове слово"
                    className="w-[100px] border-none bg-transparent text-[#333] outline-none placeholder:text-[#8a8a8a]"
                  />

                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    aria-label="Видалити ключове слово"
                    className="text-[#8a8a8a] transition-colors hover:text-[#e31b23]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addKeyword}
                className={primaryButtonClass}
              >
                Додати ключове слово
              </button>

              <button
                type="button"
                onClick={clearKeywords}
                className={dangerButtonClass}
              >
                Очистити всі ключові слова
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="h-[44px] w-[160px] rounded-[4px] bg-primary text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Збереження...' : 'Зберегти'}
          </button>
        </form>
      )}
    </AdminPageLayout>
  )
}
