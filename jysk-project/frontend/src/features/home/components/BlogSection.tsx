import { blogPosts } from '@/features/home/data/blogPosts'
import { BlogCarousel } from './BlogCarousel'

export function BlogSection() {
  return (
    <section className="bg-page pt-[15px] pb-16 mt-8">
      <div className="mx-auto max-w-[2240px] px-6">
        <h2 className="mx-auto mb-10 w-full max-w-[550px] bg-line-strong py-3 text-center text-3xl font-bold">
          Блог
        </h2>

        <BlogCarousel posts={blogPosts} />
      </div>
    </section>
  )
}
