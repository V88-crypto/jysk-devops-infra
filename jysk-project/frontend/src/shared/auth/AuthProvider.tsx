import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { AuthContext } from './authContext'
import { tokenStorage } from './tokenStorage'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(tokenStorage.get()),
  )

  const login = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
