import React from 'react';
import { categoriesMockData } from './data';
import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'

const CategoriesPage: React.FC = () => {
  return (
    <main className="w-full bg-[#f3f3f3] font-sans pb-16 xl:pb-[4vw]">
      
      {/* Хлібні крихти */}
      <div className="w-full px-4 md:px-8 xl:px-[7.03vw] py-4 md:py-6 xl:py-[1.5vw] flex items-center gap-2 text-xs md:text-sm xl:text-[0.83vw] text-dark/60">
        <a href="/" className="hover:text-primary transition-colors">Домашня сторінка</a>
        <span>&gt;</span>
        <a href="/my-page" className="hover:text-primary transition-colors">Моя сторінка</a>
        <span>&gt;</span>
        <span className="text-dark">Категорії</span>
      </div>

      <div className="mx-auto w-[90%] xl:w-[85.93vw] mt-2 md:mt-4 xl:mt-[1vw] mb-16 md:mb-24 lg:mb-32 xl:mb-[13.02vw] flex flex-col items-center">
        
        <div className="flex justify-center mb-8 md:mb-10 xl:mb-[3vw]">
          <h1 className="font-['Raleway'] font-bold text-lg md:text-2xl xl:text-[2vw] text-black bg-[#E0E0E0] px-10 py-2 md:px-14 md:py-3 xl:px-[4vw] xl:py-[1vw]">
            Категорії
          </h1>
        </div>

        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-[1.5vw] mb-12 xl:mb-[4vw]">
          {categoriesMockData.map((category) => (
            <a 
              href={`/category/${category.id}`} 
              key={category.id}
              className="relative block w-full aspect-530/477 overflow-hidden bg-gray-200 group"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-6 lg:left-8 xl:top-[2vw] xl:left-[2vw] lg:translate-x-0 lg:translate-y-0">
                <span className="font-['Raleway'] font-medium lg:font-bold text-base md:text-[24px] lg:text-[36px] xl:text-[1.87vw] text-[#231F20]/75 whitespace-nowrap">
                  {category.name}
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 xl:gap-[0.5vw] mt-4 xl:mt-[2vw]">
          <button 
            className="text-black hover:text-primary transition-colors focus:outline-none p-1 md:p-2"
            aria-label="Previous page"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 xl:w-[1.5vw] xl:h-[1.5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="w-8 h-8 md:w-10 md:h-10 xl:w-[3.17vw] xl:h-[2.7vw] flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black font-['Inter'] font-normal text-sm md:text-lg xl:text-[1.4vw] text-black focus:outline-none hover:bg-gray-300 transition-colors">
            1
          </button>

          <button className="w-8 h-8 md:w-10 md:h-10 xl:w-[3.17vw] xl:h-[2.7vw] flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black font-['Inter'] font-normal text-sm md:text-lg xl:text-[1.4vw] text-black focus:outline-none hover:bg-gray-300 transition-colors">
            2
          </button>

          <div className="w-8 h-8 md:w-10 md:h-10 xl:w-[3.17vw] xl:h-[2.7vw] flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black focus:outline-none">
            <span className="font-['Inter'] font-normal text-sm md:text-lg xl:text-[1.4vw] text-black tracking-widest leading-none">...</span>
          </div>

          <button className="w-8 h-8 md:w-10 md:h-10 xl:w-[3.17vw] xl:h-[2.7vw] flex items-center justify-center bg-[#E0E0E0] rounded-[10px] border border-black font-['Inter'] font-normal text-sm md:text-lg xl:text-[1.4vw] text-black focus:outline-none hover:bg-gray-300 transition-colors">
            10
          </button>

          <button 
            className="text-black hover:text-primary transition-colors focus:outline-none p-1 md:p-2"
            aria-label="Next page"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 xl:w-[1.5vw] xl:h-[1.5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

      <Prefooter />
    </main>
  );
};

export default CategoriesPage;