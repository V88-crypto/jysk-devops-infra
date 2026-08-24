export const mockDelay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export const mockFetch = async <T>(data: T, ms: number): Promise<T> => {
  await mockDelay(ms)
  return data
}
