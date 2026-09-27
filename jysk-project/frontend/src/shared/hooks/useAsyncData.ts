import { useEffect, useState } from 'react'

interface AsyncDataState<T> {
  data: T | null
  isLoading: boolean
  error: unknown
}

interface AsyncResult<T> {
  fetcher: () => Promise<T>
  data: T | null
  error: unknown
}

export const useAsyncData = <T,>(fetcher: () => Promise<T>): AsyncDataState<T> => {
  const [result, setResult] = useState<AsyncResult<T> | null>(null)

  useEffect(() => {
    let isMounted = true

    fetcher()
      .then((data) => {
        if (isMounted) {
          setResult({ fetcher, data, error: null })
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setResult({ fetcher, data: null, error })
        }
      })

    return () => {
      isMounted = false
    }
  }, [fetcher])

  const isCurrent = result?.fetcher === fetcher

  return {
    data: isCurrent ? result.data : null,
    isLoading: !isCurrent,
    error: isCurrent ? result.error : null,
  }
}
