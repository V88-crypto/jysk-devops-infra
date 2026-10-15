import { Link } from 'react-router-dom'

import { catalogApi } from '@/features/catalog/api/catalogApi'
import type { CategoryNode } from '@/features/catalog/types'
import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { CategoryCard } from './CategoryCard'

const MAX_CATEGORIES = 6

// Top-level categories come first; free slots are filled with subcategories.
const pickCategories = (roots: CategoryNode[]) => {
  const picked: CategoryNode[] = []
  let level = roots

  while (level.length && picked.length < MAX_CATEGORIES) {
    picked.push(...level.slice(0, MAX_CATEGORIES - picked.length))
    level = level.flatMap((category) => category.children)
  }

  return picked
}

export function CategoryGroup() {
  const { data: roots, error } = useAsyncData(catalogApi.getCategories)
  const categories = roots ? pickCategories(roots) : null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1460px] px-6">
        <h2 className="mb-6 text-3xl font-semibold text-fg md:text-4xl">
          <Link
            to="/categories"
            className="transition-colors hover:text-primary"
          >
            Категорії товарів
          </Link>
        </h2>

        {Boolean(error) && (
          <p className="text-center text-danger">
            Не вдалося завантажити категорії
          </p>
        )}

        {!error && !categories && (
          <p className="text-center text-fg-subtle">Завантаження...</p>
        )}

        {categories && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
