import { useCallback, useEffect, useState } from 'react'

export interface PageResult<T> {
  items: T[]
  total: number
}

interface LoadResult<T> {
  load: (page: number) => Promise<PageResult<T>>
  page: number
  reloadId: number
  data: PageResult<T> | null
  error: unknown
}

/**
 * Loads one page at a time. `load` must be memoized (useCallback):
 * a new `load` means new filters, and the hook reloads with them.
 */
export const usePagedData = <T>(
  load: (page: number) => Promise<PageResult<T>>,
) => {
  const [page, setPage] = useState(1)
  const [reloadId, setReloadId] = useState(0)
  const [result, setResult] = useState<LoadResult<T> | null>(null)

  useEffect(() => {
    let isActive = true

    load(page)
      .then((data) => {
        if (isActive) {
          setResult({ load, page, reloadId, data, error: null })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setResult({ load, page, reloadId, data: null, error })
        }
      })

    return () => {
      isActive = false
    }
  }, [load, page, reloadId])

  const isCurrent =
    result?.load === load &&
    result.page === page &&
    result.reloadId === reloadId

  const reload = useCallback(() => setReloadId((current) => current + 1), [])

  const updateItems = useCallback((update: (items: T[]) => T[]) => {
    setResult((current) =>
      current?.data
        ? {
            ...current,
            data: { ...current.data, items: update(current.data.items) },
          }
        : current,
    )
  }, [])

  return {
    page,
    setPage,
    data: result?.data ?? null,
    error: isCurrent ? result.error : null,
    isLoading: !isCurrent,
    reload,
    updateItems,
  }
}
