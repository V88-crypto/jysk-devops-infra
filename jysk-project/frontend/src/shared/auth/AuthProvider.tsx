import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { authService } from '@/shared/api/authService'
import type { AuthUser } from '@/shared/api/authService'
import { ApiError, setSessionExpiredHandler } from '@/shared/api/httpClient'
import { AuthContext } from './authContext'
import { tokenStorage } from './tokenStorage'

const ADMIN_ROLE = 'admin'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(tokenStorage.get()),
  )
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessionId, setSessionId] = useState(0)

  const login = useCallback(() => {
    setIsAuthenticated(true)
    setSessionId((id) => id + 1)
  }, [])

  const endSession = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    const accessToken = tokenStorage.get()
    const refreshToken = tokenStorage.getRefresh()

    tokenStorage.clear()
    endSession()

    if (accessToken && refreshToken) {
      authService.logout(accessToken, refreshToken).catch(() => {})
    }
  }, [endSession])

  useEffect(() => {
    setSessionExpiredHandler(endSession)

    return () => setSessionExpiredHandler(null)
  }, [endSession])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let isActive = true

    authService
      .me()
      .then((currentUser) => {
        if (isActive) {
          setUser(currentUser)
        }
      })
      .catch((error: unknown) => {
        if (isActive && error instanceof ApiError && error.status === 401) {
          logout()
        }
      })

    return () => {
      isActive = false
    }
  }, [isAuthenticated, sessionId, logout])

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      isAdmin: user?.role === ADMIN_ROLE,
      login,
      logout,
      updateUser: setUser,
    }),
    [isAuthenticated, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
