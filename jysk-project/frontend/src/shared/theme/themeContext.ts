import { createContext } from 'react'

import type { ResolvedTheme, ThemePreference } from './themeStorage'

export interface ThemeContextValue {
  preference: ThemePreference
  theme: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
