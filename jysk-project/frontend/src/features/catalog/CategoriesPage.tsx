import { catalogApi } from '@/features/catalog/api/catalogApi'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'

import { CatalogBreadcrumbs } from './components/CatalogBreadcrumbs'
import { CategoryTile } from './components/CategoryTile'

export const CategoriesPage = () => {
  const { data: categories, error } = useAsyncData(catalogApi.getCategories)

  const renderContent = () => {
    if (error) {
      return (
        <p className="py-16 text-center text-danger">
          Не вдалося завантажити категорії
        </p>
      )
    }

    if (!categories) {
      return <p className="py-16 text-center text-fg-subtle">Завантаження...</p>
    }

    if (categories.length === 0) {
      return (
        <p className="py-16 text-center text-fg-subtle">Категорій поки немає</p>
      )
    }

    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile key={category.id} category={category} />
        ))}
      </div>
    )
  }

  return (
    <main className="w-full bg-page pb-16 font-sans">
      <div className="mx-auto w-[90%] max-w-[1440px]">
        <CatalogBreadcrumbs items={[{ label: 'Категорії' }]} />

        <div className="mb-8 mt-2 flex justify-center md:mb-10">
          <h1 className="bg-surface-strong px-10 py-2 font-['Raleway'] text-lg font-bold text-fg md:px-14 md:py-3 md:text-2xl">
            Категорії
          </h1>
        </div>

        <div className="mb-16">{renderContent()}</div>
      </div>

      <Prefooter />
    </main>
  )
}
