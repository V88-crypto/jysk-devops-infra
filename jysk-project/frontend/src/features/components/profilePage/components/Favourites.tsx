import { useEffect, useState } from 'react'

import { getFavorites } from '../data/favoritesApi'
import type { FavoriteProduct } from '../../../types/profile'

export const Favorites = () => {
  const [products, setProducts] = useState<FavoriteProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await getFavorites()
        setProducts(data)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full py-[40px] text-center text-[18px]">
        Завантаження...
      </div>
    )
  }

  return (
    <section className="h-full w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 mt-[40px] sm:mt-[50px] lg:mt-[60px] mb-[40px] sm:mb-[50px] lg:mb-[60px]">

      <h2
        className="
          text-[30px]
          sm:text-[36px]
          lg:text-[42px]
          font-bold
          mb-[25px]
          sm:mb-[30px]
          lg:mb-[35px]
        "
      >
        Обране
      </h2>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-[15px]
          lg:gap-[20px]
        "
      >
        {products.map((product) => (
          <article
            key={product.id}
            className="
                w-full
                bg-white
                border
                border-[#dedede]
                shadow-[0_1px_3px_rgba(0,0,0,0.15)]
                relative
            ">

            <div className="relative
                w-full
                h-[260px]
                sm:h-[340px]
                md:h-[420px]
                lg:h-[500px]
                bg-[#f5f5f5]">
                <img
                    src={product.image}
                    alt={product.description}
                    className="
                    w-full
                    h-full
                    object-cover
                    "
                />

              <button
                type="button"
                className="
                absolute
                top-[10px]
                right-[10px]
                text-[26px]
                leading-none
                hover:scale-110
                transition-transform
                "
            >
                ♡
            </button>

              <div className="absolute bottom-0 left-0 flex flex-col items-start">
                {product.discount && (
                <span
                    className="
                    bg-[#e31b23]
                    text-white
                    text-[12px]
                    font-bold
                    px-[7px]
                    py-[5px]
                    "
                >
                    -{product.discount}%
                </span>
                )}

                {product.badge && (
                <span
                    className="
                    bg-[#19c514]
                    text-white
                    text-[12px]
                    font-medium
                    px-[7px]
                    py-[5px]
                    "
                >
                    {product.badge}
                </span>
                )}
            </div>
            </div>

            <div
              className="
                h-[32%]
                px-[12px]
                pt-[8px]
                pb-[10px]
                flex
                flex-col
              "
            >

              <p
                className="
                  text-[20px]
                  font-bold
                  uppercase
                  mb-[3px]
                "
              >
                {product.brand}
              </p>

              <p
                className="
                    text-[18px]
                    leading-[22px]
                    text-[#555]
                    mt-[7px]
                    h-[44px]
                    overflow-hidden
                "
                >
                {product.description}
              </p>

              <div className="flex items-center gap-[5px] mt-[10px]">

                <span className="text-[30px] tracking-[-2px]">
                  ★★★★★
                </span>

              </div>

              <div className="mt-[4px]">

                <span className="text-[32px] font-bold">
                  {product.price}$.
                </span>

                {product.oldPrice && (
                  <span
                    className="
                      ml-[6px]
                      text-[21px]
                      text-[#888]
                      line-through
                    "
                  >
                    {product.oldPrice}$.
                  </span>
                )}

              </div>

              <div className="mt-[4px]">

                <p className="flex items-center gap-[5px] text-[17px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-red-500" />
                  Доставка
                </p>

                <p className="flex items-center gap-[5px] text-[17px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#19c514]" />
                  В наявності
                </p>

              </div>

            </div>

          </article>
        ))}
      </div>

    </section>
  )
}
