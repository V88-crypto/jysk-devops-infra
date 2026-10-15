import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { ThemeContext } from './themeContext'
import type { ThemeContextValue } from './themeContext'
import {
  THEME_STORAGE_KEY,
  applyTheme,
  resolveTheme,
  systemThemeQuery,
  themeStorage,
} from './themeStorage'
import type { ResolvedTheme, ThemePreference } from './themeStorage'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    themeStorage.get,
  )
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    resolveTheme('system'),
  )

  const theme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow the OS setting live, e.g. when it switches at sunset.
  useEffect(() => {
    const query = systemThemeQuery()
    const handleChange = () => setSystemTheme(query.matches ? 'dark' : 'light')

    query.addEventListener('change', handleChange)

    return () => query.removeEventListener('change', handleChange)
  }, [])

  // Keep every open tab on the same theme.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        setPreferenceState(themeStorage.parse(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setPreference = useCallback((next: ThemePreference) => {
    themeStorage.set(next)
    setPreferenceState(next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme, setPreference }),
    [preference, theme, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
