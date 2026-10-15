import { useEffect, useState } from 'react'

import { catalogApi } from '@/features/catalog/api/catalogApi'
import type { Page, ProductSummary } from '@/features/catalog/types'

export const PRODUCTS_PAGE_SIZE = 12

interface ProductListQuery {
  category?: string
  search?: string
}

interface LoadResult {
  key: string
  data: Page<ProductSummary> | null
  error: unknown
}

export const useProductList = ({ category, search }: ProductListQuery) => {
  const queryKey = `${category ?? ''}|${search ?? ''}`
  // The page is stored together with the query it belongs to, so a new
  // category or search term starts from the first page again.
  const [pageState, setPageState] = useState({ queryKey, page: 1 })
  const page = pageState.queryKey === queryKey ? pageState.page : 1
  const [result, setResult] = useState<LoadResult | null>(null)

  const requestKey = `${queryKey}|${page}`

  useEffect(() => {
    let isActive = true
    const key = `${category ?? ''}|${search ?? ''}|${page}`

    catalogApi
      .getProducts({ category, search, page, pageSize: PRODUCTS_PAGE_SIZE })
      .then((data) => {
        if (isActive) {
          setResult({ key, data, error: null })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setResult({ key, data: null, error })
        }
      })

    return () => {
      isActive = false
    }
  }, [category, search, page])

  const isCurrent = result?.key === requestKey

  const setPage = (nextPage: number) => {
    setPageState({ queryKey, page: nextPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    page,
    setPage,
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    isLoading: !isCurrent,
  }
}
