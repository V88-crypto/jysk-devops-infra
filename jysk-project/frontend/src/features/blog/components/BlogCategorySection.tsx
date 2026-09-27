import { useNavigate } from 'react-router-dom'

import type { BlogPost } from '@/shared/types/blog'

interface BlogCategorySectionProps {
  id?: string
  title: string
  posts: BlogPost[]
}

export function BlogCategorySection({ id, title, posts }: BlogCategorySectionProps) {
  const navigate = useNavigate()

  if (!posts.length) {
    return null
  }

  const [featured, ...rest] = posts
  const thumbnails = rest.slice(0, 4)

  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate(`/blog/${featured.id}`)}
          className="group relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-100 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:aspect-auto md:h-full"
        >
          <img
            src={featured.imageUrl}
            alt={featured.imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <h3 className="absolute left-4 top-4 max-w-[85%] text-lg font-bold leading-snug text-neutral-900">
            {featured.title}
          </h3>
        </button>

        <div className="grid grid-cols-2 grid-rows-2 gap-4 md:h-full">
          {thumbnails.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => navigate(`/blog/${post.id}`)}
              className="group relative aspect-square overflow-hidden rounded-md bg-neutral-100 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:aspect-auto"
            >
              <img
                src={post.imageUrl}
                alt={post.imageAlt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <h3 className="absolute left-3 top-3 max-w-[85%] text-xs font-bold leading-snug text-neutral-900 sm:text-sm">
                {post.title}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
