import { useState } from 'react'

import type { FavoriteProduct } from '@/features/profile/types'
import type { SectionState } from '@/features/profile/hooks/useProfileData'
import { formatPrice } from '@/features/profile/utils/format'
import { SectionStatus } from './SectionStatus'

interface FavoritesProps {
  state: SectionState<FavoriteProduct[]>
  onRemove: (variantId: number) => Promise<void>
}

export const Favorites = ({ state, onRemove }: FavoritesProps) => {
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)

  const handleRemove = async (variantId: number) => {
    setRemovingId(variantId)
    setRemoveError(null)

    try {
      await onRemove(variantId)
    } catch {
      setRemoveError('Не вдалося видалити товар з обраного. Спробуйте ще раз.')
    } finally {
      setRemovingId(null)
    }
  }

  const renderContent = () => {
    if (state.status === 'loading') {
      return <SectionStatus>Завантаження...</SectionStatus>
    }

    if (state.status === 'error') {
      return <SectionStatus>Не вдалося завантажити обране</SectionStatus>
    }

    if (state.data.length === 0) {
      return <SectionStatus>Ви ще нічого не додали в обране</SectionStatus>
    }

    return (
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
        {state.data.map((product) => (
          <article
            key={product.variantId}
            className="
                w-full
                bg-white
                border
                border-[#dedede]
                shadow-[0_1px_3px_rgba(0,0,0,0.15)]
                relative
            "
          >
            <div
              className="relative
                w-full
                h-[260px]
                sm:h-[340px]
                md:h-[420px]
                lg:h-[500px]
                bg-[#f5f5f5]"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[15px] text-[#999]">
                  Немає фото
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemove(product.variantId)}
                disabled={removingId === product.variantId}
                aria-label="Видалити з обраного"
                title="Видалити з обраного"
                className="
                  absolute
                  top-[10px]
                  right-[10px]
                  flex
                  h-[40px]
                  w-[40px]
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-[24px]
                  leading-none
                  text-primary
                  shadow-sm
                  hover:scale-110
                  transition-transform
                  disabled:opacity-50
                "
              >
                ♥
              </button>
            </div>

            <div
              className="
                px-[12px]
                pt-[8px]
                pb-[14px]
                flex
                flex-col
              "
            >
              <p
                className="
                  text-[20px]
                  font-bold
                  mb-[3px]
                "
              >
                {product.name}
              </p>

              <p
                className="
                    text-[15px]
                    text-[#555]
                    mt-[4px]
                "
              >
                Артикул: {product.sku}
              </p>

              <div className="mt-[10px]">
                <span className="text-[28px] font-bold">
                  {formatPrice(product.price)}
                </span>
              </div>

              <p className="mt-[6px] flex items-center gap-[5px] text-[17px]">
                <span
                  className={`w-[6px] h-[6px] rounded-full ${
                    product.inStock ? 'bg-[#19c514]' : 'bg-red-500'
                  }`}
                />
                {product.inStock ? 'В наявності' : 'Немає в наявності'}
              </p>
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <section
      id="profile-favorites"
      className="scroll-mt-4 h-full w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 mt-[40px] sm:mt-[50px] lg:mt-[60px] mb-[40px] sm:mb-[50px] lg:mb-[60px]"
    >
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

      {removeError && (
        <p className="mb-[15px] text-[14px] text-red-500">{removeError}</p>
      )}

      {renderContent()}
    </section>
  )
}
