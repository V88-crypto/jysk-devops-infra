import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '../shared/auth/useAuth'

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
