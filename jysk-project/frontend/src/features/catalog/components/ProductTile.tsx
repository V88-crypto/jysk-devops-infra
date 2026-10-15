import { Link } from 'react-router-dom'

import type { ProductSummary } from '@/features/catalog/types'
import { formatPrice } from '@/features/catalog/utils/format'

interface ProductTileProps {
  product: ProductSummary
  isFavorite: boolean
  isFavoritePending: boolean
  onToggleFavorite: () => void
}

export const ProductTile = ({
  product,
  isFavorite,
  isFavoritePending,
  onToggleFavorite,
}: ProductTileProps) => (
  <article className="relative flex flex-col border border-transparent bg-white p-4 transition-shadow hover:border-gray-200 hover:shadow-lg">
    <button
      type="button"
      onClick={onToggleFavorite}
      disabled={isFavoritePending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
      className="absolute right-4 top-4 z-10 disabled:opacity-50"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        className={`h-7 w-7 transition-colors ${
          isFavorite
            ? 'fill-primary stroke-primary'
            : 'fill-none stroke-black hover:stroke-primary'
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>

    <Link to={`/product/${product.slug}`} className="flex flex-1 flex-col">
      <div className="mb-4 flex aspect-square w-full items-center justify-center overflow-hidden bg-[#f7f7f7]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-sm text-[#999]">Немає фото</span>
        )}
      </div>

      <h3 className="mb-2 line-clamp-2 min-h-12 font-['Raleway'] text-base font-bold uppercase text-[#231F20] md:text-[18px]">
        {product.name}
      </h3>

      <p className="mt-auto font-['Raleway'] text-lg font-bold text-black md:text-[20px]">
        {product.priceFrom === null
          ? 'Ціну уточнюйте'
          : `від ${formatPrice(product.priceFrom)}`}
      </p>
    </Link>
  </article>
)
