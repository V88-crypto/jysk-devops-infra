import { useCallback } from 'react'
import { Link } from 'react-router-dom'

import { catalogApi } from '@/features/catalog/api/catalogApi'
import type { CategoryNode } from '@/features/catalog/types'
import { useAsyncData } from '@/shared/hooks/useAsyncData'

interface CategoryTileProps {
  category: CategoryNode
}

// Categories have no images on the backend, so the tile shows the photo of
// the first product in the category.
export const CategoryTile = ({ category }: CategoryTileProps) => {
  const fetchPreview = useCallback(
    () =>
      catalogApi.getProducts({
        category: category.slug,
        page: 1,
        pageSize: 1,
      }),
    [category.slug],
  )
  const { data: preview } = useAsyncData(fetchPreview)
  const imageUrl = preview?.items[0]?.imageUrl ?? null

  return (
    <article className="flex flex-col bg-white">
      <Link
        to={`/category/${category.slug}`}
        className="group relative block aspect-530/477 w-full overflow-hidden bg-[#e5e5e5]"
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <span className="absolute left-4 top-4 bg-white/85 px-3 py-1 font-['Raleway'] text-lg font-bold text-[#231F20] md:left-6 md:top-6 md:text-[28px]">
          {category.name}
        </span>
      </Link>

      {category.children.length > 0 && (
        <ul className="flex flex-wrap gap-2 p-4">
          {category.children.map((child) => (
            <li key={child.id}>
              <Link
                to={`/category/${child.slug}`}
                className="block rounded-full border border-[#c5c5c5] px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
