import { blogApi } from '@/shared/api/blogApi'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { BlogCarousel } from './BlogCarousel'

const HOME_POSTS_COUNT = 6

const loadHomePosts = () => blogApi.getPosts(HOME_POSTS_COUNT)

export function BlogSection() {
  const { data: posts } = useAsyncData(loadHomePosts)

  if (!posts?.length) {
    return null
  }

  return (
    <section className="bg-page pt-[15px] pb-16 mt-8">
      <div className="mx-auto max-w-[2240px] px-6">
        <h2 className="mx-auto mb-10 w-full max-w-[550px] bg-line-strong py-3 text-center text-3xl font-bold">
          Блог
        </h2>

        <BlogCarousel posts={posts} />
      </div>
    </section>
  )
}
