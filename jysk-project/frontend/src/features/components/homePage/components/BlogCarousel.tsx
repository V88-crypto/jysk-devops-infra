import { useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import type { BlogPost } from '../../../types/homePage'
import { BlogCard } from './BlogCard'

interface BlogCarouselProps {
  posts: BlogPost[]
}

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Попередній пост"
        onClick={() => swiper?.slidePrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-16 w-12 items-center justify-center bg-transparent opacity-100 transition-opacity hover:cursor-pointer hover:opacity-60 disabled:cursor-default disabled:opacity-30 sm:w-16 md:w-[70px]"
        disabled={!swiper}
      >
        <span className="block h-9 w-9 rotate-[135deg] border-r-[3px] border-b-[3px] border-black" />
      </button>

      <div className="px-10 xl:px-16">
        <Swiper
          modules={[Navigation]}
          loop
          navigation={false}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
          onSwiper={setSwiper}
          className="min-w-0"
        >
          {posts.map((post) => (
            <SwiperSlide
              key={post.id}
              className="h-auto md:[&.swiper-slide-next_.blog-card-button]:ml-auto md:[&.swiper-slide-next_.blog-card-description]:text-center md:[&.swiper-slide-next_.blog-card-title]:right-5 md:[&.swiper-slide-next_.blog-card-title]:left-auto md:[&.swiper-slide-next_.blog-card-title]:text-right"
            >
              <BlogCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button
        type="button"
        aria-label="Наступний пост"
        onClick={() => swiper?.slideNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-16 w-12 items-center justify-center bg-transparent opacity-100 transition-opacity hover:cursor-pointer hover:opacity-60 disabled:cursor-default disabled:opacity-30 sm:w-16 md:w-[70px]"
        disabled={!swiper}
      >
        <span className="block h-9 w-9 -rotate-45 border-r-[3px] border-b-[3px] border-black" />
      </button>
    </div>
  )
}
