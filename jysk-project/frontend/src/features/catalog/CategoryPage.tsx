import React from 'react'
import { productsMockData } from './data/categoryPage'
import { ProductCard } from './components/ProductCard'
import { BrandsBlock } from './components/BrandsBlock'
import { BlogCarousel } from './components/BlogCarousel'
import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'

export const CategoryPage: React.FC = () => {
  return (
    <main className="w-full bg-[#f3f3f3] font-sans pb-16 xl:pb-[4vw]">
      <div className="w-full px-4 md:px-8 xl:px-[7.03vw] py-4 md:py-6 xl:py-[1.5vw] flex items-center gap-2 text-xs md:text-sm xl:text-[0.83vw] text-dark/60">
        <a href="/" className="hover:text-primary transition-colors">
          Домашня сторінка
        </a>
        <span>&gt;</span>
        <a href="/my-page" className="hover:text-primary transition-colors">
          Моя сторінка
        </a>
        <span>&gt;</span>
        <a href="/categories" className="hover:text-primary transition-colors">
          Категорії
        </a>
        <span>&gt;</span>
        <span className="text-dark">Категорія</span>
      </div>

      <div className="mx-auto w-[90%] xl:w-[85.93vw] mt-2 md:mt-4 xl:mt-[1vw] mb-16 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8 md:mb-12 xl:mb-[3vw] gap-[2.5vw]">
          <h2 className="font-['Inter'] font-bold text-3xl md:text-[48px] xl:text-[2.5vw] text-black leading-none">
            Категорія
          </h2>
          <h1 className="font-['Inter'] font-bold text-3xl md:text-[48px] xl:text-[2.5vw] text-black leading-none">
            Товари
          </h1>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-[1.5vw]">
          {productsMockData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex items-center gap-2 xl:gap-[0.5vw] mt-10 xl:mt-[3vw]">
          <button
            className="text-black hover:text-primary transition-colors p-1 md:p-2"
            aria-label="Previous page"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 xl:w-[1.5vw] xl:h-[1.5vw]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black font-['Inter'] text-sm md:text-lg hover:bg-gray-300">
            1
          </button>
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black font-['Inter'] text-sm md:text-lg hover:bg-gray-300">
            2
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black">
            <span className="tracking-widest">...</span>
          </div>
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black font-['Inter'] text-sm md:text-lg hover:bg-gray-300">
            10
          </button>
          <button
            className="text-black hover:text-primary transition-colors p-1 md:p-2"
            aria-label="Next page"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 xl:w-[1.5vw] xl:h-[1.5vw]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <BrandsBlock />
      <BlogCarousel />
      <Prefooter />
    </main>
  )
}
