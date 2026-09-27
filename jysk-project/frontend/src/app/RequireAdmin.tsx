import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '@/shared/auth/useAuth'

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#8a8a8a]">
        Завантаження...
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
