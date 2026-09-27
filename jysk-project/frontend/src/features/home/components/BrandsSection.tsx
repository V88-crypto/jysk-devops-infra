import { brands as defaultBrands } from '@/features/home/data/brands'
import type { Brand } from '@/features/home/types'
import { BrandCard } from './BrandCard'

interface BrandsSectionProps {
  brands?: Brand[]
}

export function BrandsSection({ brands = defaultBrands }: BrandsSectionProps) {
  return (
    <section className="border-y border-neutral-300 bg-white">
      <div className="mx-auto max-w-[1460px] px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 items-stretch gap-y-8 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-16">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}
