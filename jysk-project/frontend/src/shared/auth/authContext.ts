import { createContext } from 'react'

import type { AuthUser } from '../api/authService'

export interface AuthContextValue {
  isAuthenticated: boolean
  user: AuthUser | null
  isAdmin: boolean
  login: () => void
  logout: () => void
  updateUser: (user: AuthUser) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
