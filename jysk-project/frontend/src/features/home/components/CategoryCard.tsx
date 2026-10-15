import { Link } from 'react-router-dom'

import type { CategoryNode } from '@/features/catalog/types'
import { getCategoryImage } from '@/features/home/data/categoryImages'

interface CategoryCardProps {
  category: CategoryNode
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/category/${category.slug}`} className="group block">
      <div className="aspect-[3/2] overflow-hidden bg-surface-muted">
        <img
          src={getCategoryImage(category.slug)}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-fg transition-colors group-hover:text-primary">
        {category.name}
      </h3>
    </Link>
  )
}
