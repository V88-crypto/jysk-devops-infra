import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { blogApi } from '@/shared/api/blogApi'
import { useAsyncData } from '@/shared/hooks/useAsyncData'

const CAROUSEL_POSTS_COUNT = 4

const loadCarouselPosts = () => blogApi.getPosts(CAROUSEL_POSTS_COUNT)

export const BlogCarousel: React.FC = () => {
  const { data } = useAsyncData(loadCarouselPosts)
  const blogPosts = data ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(2)

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(window.innerWidth < 768 ? 1 : 2)
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Clamped here because the post count and the width can both change.
  const maxIndex = Math.max(0, blogPosts.length - itemsToShow)
  const firstIndex = Math.min(currentIndex, maxIndex)

  const nextSlide = () => {
    if (firstIndex < maxIndex) {
      setCurrentIndex(firstIndex + 1)
    }
  }

  const prevSlide = () => {
    if (firstIndex > 0) {
      setCurrentIndex(firstIndex - 1)
    }
  }

  const visiblePosts = blogPosts.slice(firstIndex, firstIndex + itemsToShow)

  if (!blogPosts.length) {
    return null
  }

  return (
    <div className="w-full bg-page py-10 md:py-16 xl:py-[4vw] flex flex-col items-center">
      <h2 className="font-['Raleway'] font-bold text-3xl md:text-[48px] xl:text-[2.5vw] text-fg mb-8 xl:mb-[2.5vw]">
        Блог
      </h2>

      <div className="flex items-center justify-center w-[95%] xl:w-[90vw] gap-4 xl:gap-[2vw]">
        <button
          onClick={prevSlide}
          disabled={firstIndex === 0}
          className={`shrink-0 p-2 focus:outline-none transition-opacity ${firstIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'}`}
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
          {visiblePosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="flex flex-col flex-1 min-w-0"
            >
              <div className="relative w-full aspect-810/477 overflow-hidden bg-surface-strong">
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 md:top-6 xl:top-[2vw] max-w-[75%] ${(firstIndex + index) % 2 === 0 ? 'left-4 md:left-8 xl:left-[2.5vw]' : 'right-4 md:right-8 xl:right-[2.5vw] text-right'}`}
                >
                  <h3 className="font-['Raleway'] font-bold text-xs sm:text-sm md:text-lg xl:text-[1.25vw] text-ink leading-tight drop-shadow-sm bg-white/60 p-1 md:bg-transparent">
                    {post.title}
                  </h3>
                </div>
              </div>

              <div className="w-full bg-surface-strong p-6 xl:p-[2vw] grow">
                <p className="font-['Raleway'] font-normal text-sm md:text-[20px] xl:text-[1.04vw] text-fg leading-relaxed text-justify">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={firstIndex >= maxIndex}
          className={`shrink-0 p-2 focus:outline-none transition-opacity ${firstIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'}`}
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
