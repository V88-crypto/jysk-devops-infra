// Keep the key and the logic in sync with the inline script in index.html,
// which applies the theme before React starts so the page never flashes.
export const THEME_STORAGE_KEY = 'hyggy_theme'

export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const

export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

const isPreference = (value: unknown): value is ThemePreference =>
  THEME_PREFERENCES.includes(value as ThemePreference)

export const themeStorage = {
  get(): ThemePreference {
    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY)
      return isPreference(value) ? value : 'system'
    } catch {
      return 'system'
    }
  },

  set(preference: ThemePreference): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts
      // until the page is reloaded.
    }
  },

  parse(value: string | null): ThemePreference {
    return isPreference(value) ? value : 'system'
  },
}

export const systemThemeQuery = () =>
  window.matchMedia('(prefers-color-scheme: dark)')

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system'
    ? systemThemeQuery().matches
      ? 'dark'
      : 'light'
    : preference

export const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement

  // Colours switch instantly instead of animating every element at once.
  root.classList.add('theme-switching')
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() =>
      root.classList.remove('theme-switching'),
    ),
  )
}
