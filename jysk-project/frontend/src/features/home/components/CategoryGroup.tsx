import { Link } from 'react-router-dom'

import { catalogApi } from '@/features/catalog/api/catalogApi'
import { CategoryTile } from '@/features/catalog/components/CategoryTile'
import { useAsyncData } from '@/shared/hooks/useAsyncData'

export function CategoryGroup() {
  const { data: categories, error } = useAsyncData(catalogApi.getCategories)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1460px] px-6">
        <h2 className="mx-auto mb-10 w-full max-w-[550px] bg-neutral-300 py-3 text-center text-3xl font-bold">
          Категорії
        </h2>

        {error ? (
          <p className="text-center text-[#d33]">
            Не вдалося завантажити категорії
          </p>
        ) : !categories ? (
          <p className="text-center text-[#777]">Завантаження...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/categories"
            className="inline-block rounded-[4px] border border-primary px-8 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Усі категорії
          </Link>
        </div>
      </div>
    </section>
  )
}
