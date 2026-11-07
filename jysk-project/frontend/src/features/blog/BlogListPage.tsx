import { useState } from 'react'

import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { blogApi } from '@/shared/api/blogApi'
import { BlogCategorySection } from './components/BlogCategorySection'

const sectionId = (slug: string) => `blog-section-${slug}`

const loadBlog = async () => {
  const [categories, posts] = await Promise.all([
    blogApi.getCategories(),
    blogApi.getPosts(),
  ])

  // Empty categories have no section to scroll to, so they get no tab.
  const tabs = categories.filter((category) =>
    posts.some((post) => post.categoryId === category.id),
  )

  return { tabs, posts }
}

export function BlogListPage() {
  const { data: blog, isLoading, error } = useAsyncData(loadBlog)
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const tabs = blog?.tabs ?? []
  const currentTab = activeTab ?? tabs[0]?.slug

  const handleTabClick = (slug: string) => {
    setActiveTab(slug)
    document
      .getElementById(sectionId(slug))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const renderContent = () => {
    if (error) {
      return (
        <p className="text-center text-fg-subtle">
          Не вдалося завантажити блог
        </p>
      )
    }

    if (isLoading || !blog) {
      return <p className="text-center text-fg-subtle">Завантаження...</p>
    }

    return (
      <div className="flex flex-col gap-14">
        {tabs.map((tab) => (
          <BlogCategorySection
            key={tab.id}
            id={sectionId(tab.slug)}
            title={tab.name}
            posts={blog.posts.filter((post) => post.categoryId === tab.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="bg-page px-6 py-10 text-center">
        <h1 className="text-4xl font-bold">Блог</h1>
        <p className="mt-2 text-fg-subtle">Ідеї за кімнатами</p>
      </div>

      <div className="bg-surface">
        <div className="mx-auto max-w-[1460px] px-6 py-8">
          <div className="flex flex-wrap justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.slug)}
                className={`h-[40px] rounded-sm px-6 text-sm font-semibold transition-colors ${
                  currentTab === tab.slug
                    ? 'bg-primary text-white'
                    : 'bg-surface-strong text-fg-muted hover:bg-line-strong'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-line-strong" />
      </div>

      <div className="bg-page px-6 py-10">
        <div className="mx-auto max-w-[1460px]">{renderContent()}</div>
      </div>

      <Prefooter />
    </>
  )
}
