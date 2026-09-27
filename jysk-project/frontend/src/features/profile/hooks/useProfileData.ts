import { useCallback, useEffect, useState } from 'react'

import type {
  FavoriteProduct,
  MyReviewList,
  OrderList,
} from '@/features/profile/types'
import { profileApi } from '@/features/profile/api/profileApi'

export type SectionState<T> =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: T }

const LOADING = { status: 'loading' } as const

export const useProfileData = () => {
  const [orders, setOrders] = useState<SectionState<OrderList>>(LOADING)
  const [favorites, setFavorites] =
    useState<SectionState<FavoriteProduct[]>>(LOADING)
  const [reviews, setReviews] = useState<SectionState<MyReviewList>>(LOADING)

  useEffect(() => {
    let isActive = true

    const load = <T>(
      request: Promise<T>,
      setState: (state: SectionState<T>) => void,
    ) => {
      request
        .then((data) => {
          if (isActive) {
            setState({ status: 'ready', data })
          }
        })
        .catch(() => {
          if (isActive) {
            setState({ status: 'error' })
          }
        })
    }

    load(profileApi.getOrders(), setOrders)
    load(profileApi.getFavorites(), setFavorites)
    load(profileApi.getReviews(), setReviews)

    return () => {
      isActive = false
    }
  }, [])

  const removeFavorite = useCallback(async (variantId: number) => {
    await profileApi.removeFavorite(variantId)

    setFavorites((state) =>
      state.status === 'ready'
        ? {
            status: 'ready',
            data: state.data.filter((item) => item.variantId !== variantId),
          }
        : state,
    )
  }, [])

  return { orders, favorites, reviews, removeFavorite }
}
