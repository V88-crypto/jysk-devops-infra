import { useState } from 'react'

import Prefooter from '../../components/Prefooter/Prefooter'
import { useAsyncData } from '../../shared/hooks/useAsyncData'
import { blogPageService } from './services/blogPageService'
import { blogCategoryTabs } from './mocks/blogCatalog'
import { BlogCategorySection } from './components/BlogCategorySection'
import { RoomFilterRow } from './components/RoomFilterRow'

const sectionId = (tab: string) => `blog-section-${tab}`

export function BlogListPage() {
  const { data: posts, isLoading } = useAsyncData(blogPageService.getCatalog)
  const { data: roomFilters } = useAsyncData(blogPageService.getRoomFilters)
  const [activeTab, setActiveTab] = useState<string>(blogCategoryTabs[0])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    document
      .getElementById(sectionId(tab))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
    <div className="bg-[#f3f3f3] px-6 py-10 text-center">
      <h1 className="text-4xl font-bold">Блог</h1>
      <p className="mt-2 text-neutral-500">Ідеї за кімнатами</p>
    </div>

    <div className="bg-white">
      <div className="mx-auto max-w-[1460px] px-6 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {blogCategoryTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`h-[40px] rounded-sm px-6 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-[#10B8C5] text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <RoomFilterRow items={roomFilters ?? []} />
      </div>

      <div className="border-t border-neutral-300" />
    </div>

    <div className="bg-[#f3f3f3] px-6 py-10">
      <div className="mx-auto max-w-[1460px]">
        {isLoading || !posts ? (
          <p className="text-center text-neutral-500">Завантаження...</p>
        ) : (
          <div className="flex flex-col gap-14">
            {blogCategoryTabs.map((tab) => (
              <BlogCategorySection
                key={tab}
                id={sectionId(tab)}
                title={tab}
                posts={posts.filter((post) => post.category === tab)}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    <Prefooter />
    </>
  )
}
