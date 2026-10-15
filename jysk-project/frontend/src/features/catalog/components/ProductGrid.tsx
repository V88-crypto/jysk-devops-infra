import { catalogApi } from '@/features/catalog/api/catalogApi'
import type { ProductSummary } from '@/features/catalog/types'
import { useFavorites } from '@/features/catalog/hooks/useFavorites'

import { ProductTile } from './ProductTile'

// Lists don't carry variant ids, so a favorite is saved for the first variant,
// the same one the product page opens with.
const resolveFirstVariantId = async (slug: string) => {
  const product = await catalogApi.getProduct(slug)
  const [firstVariant] = product.variants

  if (!firstVariant) {
    throw new Error('Product has no variants')
  }

  return firstVariant.id
}

interface ProductGridProps {
  products: ProductSummary[]
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  const { isFavorite, toggleFavorite, pendingSlug, error } = useFavorites()

  return (
    <>
      {error && (
        <p role="alert" className="mb-4 w-full text-center text-danger">
          {error}
        </p>
      )}

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductTile
            key={product.id}
            product={product}
            isFavorite={isFavorite(product.slug)}
            isFavoritePending={pendingSlug === product.slug}
            onToggleFavorite={() =>
              void toggleFavorite(product.slug, () =>
                resolveFirstVariantId(product.slug),
              )
            }
          />
        ))}
      </div>
    </>
  )
}
