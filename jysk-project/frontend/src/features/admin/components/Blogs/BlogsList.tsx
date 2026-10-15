import { useMemo, useState } from 'react'

import { blogPostService } from '@/features/admin/api/blogPostService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { SearchField } from '@/features/admin/components/common/SearchField'
import { RowEditButton } from '@/features/admin/components/common/RowEditButton'
import { RowDeleteButton } from '@/features/admin/components/common/RowDeleteButton'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

interface BlogsListProps {
  onEdit: (postId: number) => void
}

export const BlogsList = ({ onEdit }: BlogsListProps) => {
  const { data: posts, isLoading } = useAsyncData(blogPostService.getAll)

  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  )

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (posts ?? []).filter((post) => {
      if (deletedIds.has(post.id)) {
        return false
      }

      return normalizedSearch
        ? post.title.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true
    })
  }, [posts, deletedIds, search])

  const handleDelete = async (id: number) => {
    setDeletingId(id)

    try {
      await blogPostService.delete(id)
      setDeletedIds((current) => new Set(current).add(id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Блоги</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-strong px-2 text-sm font-medium text-fg-muted">
            {filteredPosts.length}
          </span>
        </div>

        <button
          type="button"
          className="h-[40px] rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Додати
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-surface px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />
      </div>

      <div className="overflow-x-auto rounded-md bg-surface shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fg-subtle">
              <th className="px-4 py-3 font-normal">Заголовок блогу ˅</th>
              <th className="px-4 py-3 font-normal">Категорія</th>
              <th className="px-4 py-3 font-normal">Ключові слова</th>
              <th className="px-4 py-3" />
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.imageUrl}
                      alt={post.imageAlt}
                      className="h-10 w-10 shrink-0 rounded object-cover"
                    />
                    <span className="max-w-[320px]">{post.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{post.category ?? '—'}</td>
                <td className="px-4 py-3">
                  {post.keywords?.join(', ') ?? '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <RowEditButton onClick={() => onEdit(post.id)} />
                </td>
                <td className="px-4 py-3 text-right">
                  <RowDeleteButton
                    disabled={deletingId === post.id}
                    onClick={() => void handleDelete(post.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredPosts.length === 0 && (
          <p className="px-4 py-10 text-center text-fg-subtle">
            Нічого не знайдено
          </p>
        )}

        {isLoading && (
          <p className="px-4 py-10 text-center text-fg-subtle">
            Завантаження...
          </p>
        )}
      </div>
    </AdminPageLayout>
  )
}
