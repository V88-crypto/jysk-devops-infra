import React from 'react'
import { brandsMockData } from '@/features/catalog/data/categoryPage'

export const BrandsBlock: React.FC = () => {
  return (
    <div className="w-full bg-surface border-t border-line shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] py-10 md:py-16 xl:py-[4vw]">
      <div className="mx-auto w-[90%] xl:w-[85.93vw] grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 xl:gap-[3vw]">
        {brandsMockData.map((brand, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center px-2"
          >
            <div className="h-12 md:h-20 xl:h-[5vw] mb-4 xl:mb-[1vw] flex items-center justify-center">
              <img
                src={brand.logo}
                alt="Brand Logo"
                className="max-h-full object-contain"
              />
            </div>
            <p className="font-['Raleway'] font-normal text-[12px] md:text-[16px] xl:text-[0.83vw] text-fg leading-relaxed">
              {brand.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
