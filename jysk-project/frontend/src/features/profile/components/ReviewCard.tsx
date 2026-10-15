import { Link } from 'react-router-dom'

import { productUrl } from '@/features/catalog/utils/productUrl'
import type { MyReview } from '@/features/profile/types'
import { formatDate } from '@/features/profile/utils/format'

type Props = {
  review: MyReview
  author: string
}

export const ReviewCard = ({ review, author }: Props) => {
  return (
    <article className="bg-white border border-[#dedede] shadow-[0_1px_4px_rgba(0,0,0,0.15)] p-5">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[160px] shrink-0">
          <h3 className="text-[20px] font-semibold">{author}</h3>

          <div
            className="mt-3 flex text-[26px] text-[#f5a623]"
            aria-label={`Оцінка ${review.rating} з 5`}
          >
            {[...Array(5)].map((_, index) => (
              <span key={index} aria-hidden="true">
                {index < review.rating ? '★' : '☆'}
              </span>
            ))}
          </div>

          <p className="mt-2 text-[14px] text-[#888]">
            {formatDate(review.date)}
          </p>
        </div>

        <Link
          to={productUrl(review.productSlug, review.variantId)}
          className="group flex gap-4 lg:w-[300px] shrink-0"
        >
          {review.image ? (
            <img
              src={review.image}
              alt={review.productName}
              className="w-[65px] h-[90px] object-contain shrink-0"
            />
          ) : (
            <div className="w-[65px] h-[90px] shrink-0 bg-[#f0f0f0]" />
          )}

          <p className="text-[18px] font-bold transition-colors group-hover:text-primary">
            {review.productName}
          </p>
        </Link>

        <p className="flex-1 text-[17px] leading-[24px] text-[#444]">
          {review.comment || <span className="text-[#999]">Без коментаря</span>}
        </p>
      </div>
    </article>
  )
}
