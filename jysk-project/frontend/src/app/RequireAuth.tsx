import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '@/shared/auth/useAuth'

interface RequireAuthProps {
  children: ReactNode
  redirectTo?: string
}

export const RequireAuth = ({
  children,
  redirectTo = '/login',
}: RequireAuthProps) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
