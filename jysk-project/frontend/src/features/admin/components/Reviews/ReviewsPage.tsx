import { useCallback, useState } from 'react'

import { reviewService } from '@/features/admin/api/reviewService'
import type { Review } from '@/features/admin/types/review'
import { usePagedData } from '@/features/admin/hooks/usePagedData'

import { RowDeleteButton } from '@/features/admin/components/common/RowDeleteButton'
import { StarRating } from '@/features/admin/components/common/StarRating'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'
import { Pagination } from '@/features/admin/components/common/Pagination'

const PAGE_SIZE = 20

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('uk-UA')

export const ReviewsPage = () => {
  const loadPage = useCallback(
    (page: number) => reviewService.getPage(page, PAGE_SIZE),
    [],
  )
  const { page, setPage, data, error, isLoading, reload } =
    usePagedData(loadPage)

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const reviews = data?.items ?? []
  const total = data?.total ?? 0

  const handleDelete = async (review: Review) => {
    if (
      !window.confirm(
        `Видалити відгук ${review.authorName} про «${review.productName}»?`,
      )
    ) {
      return
    }

    setDeletingId(review.id)
    setActionError(null)

    try {
      await reviewService.delete(review.id)

      if (reviews.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        reload()
      }
    } catch {
      setActionError('Не вдалося видалити відгук')
    } finally {
      setDeletingId(null)
    }
  }

  const renderStatus = () => {
    if (error) {
      return (
        <p className="px-4 py-10 text-center text-[#d33]">
          Не вдалося завантажити відгуки
        </p>
      )
    }

    if (!data) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">Завантаження...</p>
      )
    }

    if (reviews.length === 0) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">
          Відгуків поки немає
        </p>
      )
    }

    return null
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Відгуки</h1>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
          {total}
        </span>
      </div>

      {actionError && (
        <p className="mb-4 rounded-md bg-[#fdecec] px-4 py-3 text-sm text-[#d33]">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table
          className={`w-full min-w-[820px] border-collapse text-left text-sm transition-opacity ${
            isLoading && data ? 'opacity-60' : ''
          }`}
        >
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">Товар</th>
              <th className="px-4 py-3 font-normal">Автор</th>
              <th className="px-4 py-3 font-normal">Рейтинг</th>
              <th className="px-4 py-3 font-normal">Текст відгуку</th>
              <th className="px-4 py-3 font-normal">Дата</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-b border-[#f0f0f0] last:border-0"
              >
                <td className="px-4 py-3">
                  <p>{review.productName}</p>
                  <p className="text-xs text-[#8a8a8a]">{review.sku}</p>
                </td>
                <td className="px-4 py-3">{review.authorName}</td>
                <td className="px-4 py-3">
                  <StarRating rating={review.rating} />
                </td>
                <td className="max-w-[320px] px-4 py-3 text-[#555]">
                  {review.comment || (
                    <span className="text-[#b0b0b0]">Без коментаря</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(review.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <RowDeleteButton
                    disabled={deletingId === review.id}
                    onClick={() => void handleDelete(review)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderStatus()}
      </div>

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </AdminPageLayout>
  )
}
