import type { ComponentType } from 'react'

import { MoonIcon, SunIcon, SystemIcon } from './ThemeIcons'
import type { ThemePreference } from './themeStorage'
import { useTheme } from './useTheme'

const OPTIONS: {
  value: ThemePreference
  label: string
  Icon: ComponentType<{ className?: string }>
}[] = [
  { value: 'light', label: 'Світла', Icon: SunIcon },
  { value: 'dark', label: 'Темна', Icon: MoonIcon },
  { value: 'system', label: 'Як у системі', Icon: SystemIcon },
]

interface ThemeSwitcherProps {
  // `onBrand` is for the turquoise admin sidebar.
  variant?: 'default' | 'onBrand'
  // Icons only, for narrow places like the admin sidebar.
  compact?: boolean
  className?: string
}

const STYLES = {
  default: {
    group: 'bg-surface-strong',
    active: 'bg-surface text-fg shadow-sm',
    idle: 'text-fg-muted hover:text-fg',
  },
  onBrand: {
    group: 'bg-white/15',
    active: 'bg-white text-primary shadow-sm',
    idle: 'text-white/80 hover:text-white',
  },
}

export const ThemeSwitcher = ({
  variant = 'default',
  compact = false,
  className = '',
}: ThemeSwitcherProps) => {
  const { preference, setPreference } = useTheme()
  const styles = STYLES[variant]

  return (
    <div
      role="radiogroup"
      aria-label="Тема оформлення"
      className={`flex gap-1 rounded-lg p-1 ${styles.group} ${className}`}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = preference === value

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setPreference(value)}
            title={label}
            aria-label={label}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors ${
              isActive ? styles.active : styles.idle
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!compact && <span className="truncate">{label}</span>}
          </button>
        )
      })}
    </div>
  )
}
