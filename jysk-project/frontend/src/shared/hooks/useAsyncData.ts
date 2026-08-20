import { useEffect, useState } from 'react'

interface AsyncDataState<T> {
  data: T | null
  isLoading: boolean
}

export const useAsyncData = <T,>(fetcher: () => Promise<T>): AsyncDataState<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetcher()
      .then((result) => {
        if (isMounted) {
          setData(result)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [fetcher])

  return { data, isLoading }
}
