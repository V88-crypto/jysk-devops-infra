import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { authService } from '../api/authService'
import type { AuthUser } from '../api/authService'
import { ApiError } from '../api/httpClient'
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

  const logout = useCallback(() => {
    tokenStorage.clear()
    setIsAuthenticated(false)
    setUser(null)
  }, [])

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
    }),
    [isAuthenticated, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
