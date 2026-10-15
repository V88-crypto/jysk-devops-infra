import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { catalogApi } from '@/features/catalog/api/catalogApi'
import type { ProductReviewList } from '@/features/catalog/types'
import { formatDate } from '@/features/catalog/utils/format'
import { ApiError } from '@/shared/api/httpClient'
import { useAuth } from '@/shared/auth/useAuth'

import { StarInput, Stars } from './Stars'

interface ProductReviewsProps {
  slug: string
  variantId: number | null
}

interface LoadResult {
  key: string
  data: ProductReviewList | null
}

const reviewErrorMessage = (error: unknown) =>
  error instanceof ApiError && error.status === 409
    ? 'Ви вже залишили відгук на цей варіант товару'
    : 'Не вдалося надіслати відгук, спробуйте ще раз'

export const ProductReviews = ({ slug, variantId }: ProductReviewsProps) => {
  const { isAuthenticated } = useAuth()
  const [reloadId, setReloadId] = useState(0)
  const [result, setResult] = useState<LoadResult | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [formMessage, setFormMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const requestKey = `${slug}|${reloadId}`

  useEffect(() => {
    let isActive = true
    const key = `${slug}|${reloadId}`

    catalogApi
      .getReviews(slug)
      .then((data) => {
        if (isActive) {
          setResult({ key, data })
        }
      })
      .catch(() => {
        if (isActive) {
          setResult({ key, data: null })
        }
      })

    return () => {
      isActive = false
    }
  }, [slug, reloadId])

  const isLoading = result?.key !== requestKey
  const reviews = result?.data

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!variantId) {
      return
    }

    if (rating === 0) {
      setFormMessage({ type: 'error', text: 'Поставте оцінку від 1 до 5' })
      return
    }

    setIsSending(true)
    setFormMessage(null)

    try {
      await catalogApi.createReview(variantId, rating, comment.trim() || null)
      setRating(0)
      setComment('')
      setFormMessage({ type: 'success', text: 'Дякуємо! Відгук додано' })
      setReloadId((current) => current + 1)
    } catch (error) {
      setFormMessage({ type: 'error', text: reviewErrorMessage(error) })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="reviews" className="mt-12 scroll-mt-4">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h2 className="text-[26px] font-bold lg:text-[32px]">Відгуки</h2>

        {reviews && reviews.total > 0 && (
          <span className="flex items-center gap-2 text-[16px] text-fg-muted">
            <Stars rating={reviews.averageRating} />
            {reviews.averageRating.toLocaleString('uk-UA', {
              maximumFractionDigits: 1,
            })}{' '}
            з 5 · {reviews.total}
          </span>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          {isLoading && !reviews && (
            <p className="text-fg-subtle">Завантаження відгуків...</p>
          )}

          {!isLoading && !reviews && (
            <p className="text-danger">Не вдалося завантажити відгуки</p>
          )}

          {reviews && reviews.items.length === 0 && (
            <p className="bg-surface px-5 py-8 text-center text-fg-subtle">
              Відгуків ще немає. Будьте першим!
            </p>
          )}

          {reviews?.items.map((review) => (
            <article key={review.id} className="bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{review.author}</span>
                <span className="text-sm text-fg-subtle">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <Stars rating={review.rating} className="mt-1 text-[20px]" />

              {review.comment && (
                <p className="mt-2 leading-[24px] text-fg-muted">
                  {review.comment}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="h-fit bg-surface p-5">
          <h3 className="mb-4 text-[20px] font-bold">Залишити відгук</h3>

          {isAuthenticated ? (
            <form
              onSubmit={(event) => void handleSubmit(event)}
              className="flex flex-col gap-4"
            >
              <StarInput
                value={rating}
                disabled={isSending}
                onChange={setRating}
              />

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={isSending}
                placeholder="Ваш коментар (необов'язково)"
                rows={4}
                className="w-full resize-y rounded-[4px] border border-line-strong bg-surface-muted p-3 outline-none focus:border-primary"
              />

              {formMessage && (
                <p
                  role="status"
                  className={`text-sm ${
                    formMessage.type === 'error'
                      ? 'text-danger'
                      : 'text-success'
                  }`}
                >
                  {formMessage.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isSending || !variantId}
                className="h-[44px] rounded-[4px] bg-primary font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? 'Надсилання...' : 'Надіслати відгук'}
              </button>
            </form>
          ) : (
            <p className="text-fg-muted">
              <Link to="/login" className="text-primary underline">
                Увійдіть
              </Link>
              , щоб залишити відгук.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
