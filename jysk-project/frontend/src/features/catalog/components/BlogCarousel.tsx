import React, { useState, useEffect } from 'react'
import { blogPostsMockData as blogPosts } from '@/features/catalog/data/categoryPage'

export const BlogCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      const newItemsToShow = window.innerWidth < 768 ? 1 : 2
      setItemsToShow(newItemsToShow)

      setCurrentIndex((prev) =>
        prev > blogPosts.length - newItemsToShow ? 0 : prev,
      )
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextSlide = () => {
    if (currentIndex < blogPosts.length - itemsToShow) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const visiblePosts = blogPosts.slice(currentIndex, currentIndex + itemsToShow)

  return (
    <div className="w-full bg-[#f3f3f3] py-10 md:py-16 xl:py-[4vw] flex flex-col items-center">
      <h2 className="font-['Raleway'] font-bold text-3xl md:text-[48px] xl:text-[2.5vw] text-[#231F20] mb-8 xl:mb-[2.5vw]">
        Блог
      </h2>

      <div className="flex items-center justify-center w-[95%] xl:w-[90vw] gap-4 xl:gap-[2vw]">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`shrink-0 p-2 focus:outline-none transition-opacity ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-8 h-8 md:w-12 md:h-12 xl:w-[3vw] xl:h-[3vw]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex flex-1 gap-6 xl:gap-[2vw] overflow-hidden">
          {visiblePosts.map((post) => (
            <div key={post.id} className="flex flex-col flex-1 min-w-0">
              <div className="relative w-full aspect-810/477 overflow-hidden bg-gray-200">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 md:top-6 xl:top-[2vw] max-w-[75%] ${post.titleAlign === 'left' ? 'left-4 md:left-8 xl:left-[2.5vw]' : 'right-4 md:right-8 xl:right-[2.5vw] text-right'}`}
                >
                  <h3 className="font-['Raleway'] font-bold text-xs sm:text-sm md:text-lg xl:text-[1.25vw] text-[#231F20] leading-tight drop-shadow-sm bg-white/60 p-1 md:bg-transparent">
                    {post.title}
                  </h3>
                </div>
              </div>

              <div className="w-full bg-[#D9D9D9] p-6 xl:p-[2vw] grow">
                <p className="font-['Raleway'] font-normal text-sm md:text-[20px] xl:text-[1.04vw] text-[#231F20] leading-relaxed text-justify">
                  {post.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentIndex >= blogPosts.length - itemsToShow}
          className={`shrink-0 p-2 focus:outline-none transition-opacity ${currentIndex >= blogPosts.length - itemsToShow ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-8 h-8 md:w-12 md:h-12 xl:w-[3vw] xl:h-[3vw]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
