import { MoonIcon, SunIcon } from './ThemeIcons'
import { useTheme } from './useTheme'

interface ThemeToggleProps {
  // `onBrand` is for the turquoise admin sidebar.
  variant?: 'default' | 'onBrand'
  className?: string
}

const STYLES = {
  default: {
    icon: 'text-fg-muted',
    track: 'bg-line-strong',
    trackOn: 'bg-primary',
  },
  onBrand: {
    icon: 'text-white/85',
    track: 'bg-white/25',
    trackOn: 'bg-primary-hover',
  },
}

// Until the user flips it, the theme follows the OS (see ThemeProvider).
export const ThemeToggle = ({
  variant = 'default',
  className = '',
}: ThemeToggleProps) => {
  const { theme, setPreference } = useTheme()
  const isDark = theme === 'dark'
  const styles = STYLES[variant]
  const Icon = isDark ? MoonIcon : SunIcon

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Icon className={`h-5 w-5 shrink-0 ${styles.icon}`} />

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Темна тема"
        title={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
        onClick={() => setPreference(isDark ? 'light' : 'dark')}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isDark ? styles.trackOn : styles.track
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
