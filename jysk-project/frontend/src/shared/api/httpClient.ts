import { tokenStorage } from '@/shared/auth/tokenStorage'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

// A 401 from these endpoints means wrong credentials or an already
// invalid token, not an expired access token, so they are never refreshed.
const NO_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
]

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface TokenPairResponse {
  access_token: string
  refresh_token: string
}

let refreshPromise: Promise<boolean> | null = null
let sessionExpiredHandler: (() => void) | null = null

export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  sessionExpiredHandler = handler
}

const extractErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => null)
  const detail = body?.detail

  if (typeof detail === 'string') {
    return detail
  }

  return `Помилка запиту (${response.status})`
}

const send = (path: string, options: RequestInit) => {
  const token = tokenStorage.get()
  // The browser sets the multipart boundary itself for FormData bodies.
  const isFormData = options.body instanceof FormData

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

const requestNewTokens = async (): Promise<boolean> => {
  const refreshToken = tokenStorage.getRefresh()

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      return false
    }

    const tokens = (await response.json()) as TokenPairResponse
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token)

    return true
  } catch {
    return false
  }
}

// The backend rotates refresh tokens (each one works only once), so parallel
// 401s must share a single refresh call instead of each starting their own.
export const refreshTokens = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = requestNewTokens().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  let response = await send(path, options)

  const canRefresh =
    response.status === 401 &&
    Boolean(tokenStorage.getRefresh()) &&
    !NO_REFRESH_PATHS.some((noRefreshPath) => path.startsWith(noRefreshPath))

  if (canRefresh) {
    if (await refreshTokens()) {
      response = await send(path, options)
    } else {
      tokenStorage.clear()
      sessionExpiredHandler?.()
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, await extractErrorMessage(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
