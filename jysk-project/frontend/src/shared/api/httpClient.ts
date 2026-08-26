const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const extractErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => null)
  const detail = body?.detail

  if (typeof detail === 'string') {
    return detail
  }

  return `Помилка запиту (${response.status})`
}

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, await extractErrorMessage(response))
  }

  return response.json() as Promise<T>
}
