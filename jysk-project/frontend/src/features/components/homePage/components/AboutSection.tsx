import { about as defaultAbout } from '../data/about'
import type { About } from '../../../types/homePage'

interface AboutSectionProps {
  about?: About
}

export function AboutSection({ about = defaultAbout }: AboutSectionProps) {
  return (
    <section>
      <div aria-hidden="true" className="h-px w-full bg-neutral-400" />

      <div className="mx-auto grid max-w-[1460px] grid-cols-1 items-center gap-6 px-6 py-10 md:grid-cols-2 md:gap-7 md:py-14 lg:gap-8">
        <div className="overflow-hidden bg-neutral-100">
          <img
            src={about.imageUrl}
            alt={about.imageAlt}
            loading="lazy"
            className="aspect-[5/3] h-full w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight text-neutral-800">
            {about.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-neutral-700 lg:text-lg">
            {about.description}
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="h-px w-full bg-neutral-400" />
    </section>
  )
}
