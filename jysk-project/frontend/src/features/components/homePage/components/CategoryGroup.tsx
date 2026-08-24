import { categories as defaultCategories } from '../data/categories'
import type { Category } from '../../../types/homePage'
import { CategoryCard } from './CategoryCard'

interface CategoryGroupProps {
  categories?: Category[]
}

export function CategoryGroup({
  categories = defaultCategories,
}: CategoryGroupProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1460px] px-6">
        <h2 className="mx-auto mb-10 w-full max-w-[550px] bg-neutral-300 py-3 text-center text-3xl font-bold">
          Категорії
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
