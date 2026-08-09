import type { Brand } from '../types'

interface BrandCardProps {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <article className="flex h-full flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
      <img
        src={brand.logoUrl}
        alt={`${brand.name} logo`}
        loading="lazy"
        className="h-16 w-auto max-w-full object-contain"
      />

      <h3 className="sr-only">{brand.name}</h3>

      <p className="mt-7 w-full text-left text-sm leading-5 text-neutral-700">
        {brand.description}
      </p>
    </article>
  )
}
