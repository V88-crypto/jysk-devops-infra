import { useMemo, useState } from 'react'

import { reviewService } from '@/features/admin/api/reviewService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { SearchField } from '@/features/admin/components/common/SearchField'
import { RowDeleteButton } from '@/features/admin/components/common/RowDeleteButton'
import { StarRating } from '@/features/admin/components/common/StarRating'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

export const ReviewsPage = () => {
  const { data: reviews, isLoading } = useAsyncData(reviewService.getAll)

  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  )

  const filteredReviews = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (reviews ?? []).filter((review) => {
      if (deletedIds.has(review.id)) {
        return false
      }

      return normalizedSearch
        ? review.product.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true
    })
  }, [reviews, deletedIds, search])

  const handleDelete = async (id: number) => {
    setDeletingId(id)

    try {
      await reviewService.delete(id)
      setDeletedIds((current) => new Set(current).add(id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Відгуки</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
            {filteredReviews.length}
          </span>
        </div>

        <button
          type="button"
          className="h-[40px] rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Додати
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />
      </div>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">Назва ˅</th>
              <th className="px-4 py-3 font-normal">Виробник</th>
              <th className="px-4 py-3 font-normal">Рейтинг</th>
              <th className="px-4 py-3 font-normal">Текст відгуку</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredReviews.map((review) => (
              <tr
                key={review.id}
                className="border-b border-[#f0f0f0] last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.image}
                      alt={review.product}
                      className="h-10 w-10 shrink-0 rounded object-cover"
                    />
                    <span>{review.product}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{review.brand}</td>
                <td className="px-4 py-3">
                  <StarRating rating={review.rating} />
                </td>
                <td className="max-w-[320px] px-4 py-3 text-[#555]">
                  {review.review}
                </td>
                <td className="px-4 py-3 text-right">
                  <RowDeleteButton
                    disabled={deletingId === review.id}
                    onClick={() => void handleDelete(review.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredReviews.length === 0 && (
          <p className="px-4 py-10 text-center text-[#8a8a8a]">
            Нічого не знайдено
          </p>
        )}

        {isLoading && (
          <p className="px-4 py-10 text-center text-[#8a8a8a]">
            Завантаження...
          </p>
        )}
      </div>
    </AdminPageLayout>
  )
}
