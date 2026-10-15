import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { favoritesApi } from '@/shared/api/favoritesApi'
import type { FavoriteEntry } from '@/shared/api/favoritesApi'
import { useAuth } from '@/shared/auth/useAuth'

export const useFavorites = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [entries, setEntries] = useState<FavoriteEntry[]>([])
  const [pendingSlug, setPendingSlug] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let isActive = true

    favoritesApi
      .list()
      .then((list) => {
        if (isActive) {
          setEntries(list)
        }
      })
      .catch(() => undefined)

    return () => {
      isActive = false
    }
  }, [isAuthenticated])

  const favorites = isAuthenticated ? entries : []

  const isFavorite = (productSlug: string) =>
    favorites.some((entry) => entry.productSlug === productSlug)

  // The variant is resolved lazily because product lists don't include
  // variant ids; the product page already knows the selected variant.
  const toggleFavorite = useCallback(
    async (productSlug: string, resolveVariantId: () => Promise<number>) => {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }

      setPendingSlug(productSlug)
      setError(null)

      try {
        const existing = entries.filter(
          (entry) => entry.productSlug === productSlug,
        )

        if (existing.length) {
          await Promise.all(
            existing.map((entry) => favoritesApi.remove(entry.variantId)),
          )
          setEntries((current) =>
            current.filter((entry) => entry.productSlug !== productSlug),
          )
        } else {
          const variantId = await resolveVariantId()
          await favoritesApi.add(variantId)
          setEntries((current) => [...current, { variantId, productSlug }])
        }
      } catch {
        setError('Не вдалося оновити обране, спробуйте ще раз')
      } finally {
        setPendingSlug(null)
      }
    },
    [entries, isAuthenticated, navigate],
  )

  return { isFavorite, toggleFavorite, pendingSlug, error }
}
