import { Link } from 'react-router-dom'

import type { CategoryNode } from '@/features/catalog/types'

// Categories have no images on the backend yet.
const PLACEHOLDER_IMAGE = '/images/category-placeholder.svg'

interface CategoryCardProps {
  category: CategoryNode
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative block aspect-[342/307] overflow-hidden bg-neutral-100"
    >
      <img
        src={PLACEHOLDER_IMAGE}
        alt={`Світлий домашній інтер’єр для категорії ${category.name}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/10 to-transparent"
      />
      <h3 className="absolute left-6 top-6 text-2xl font-bold leading-tight text-neutral-700 md:left-7 md:top-7">
        {category.name}
      </h3>
    </Link>
  )
}
