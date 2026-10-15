interface AvatarPlaceholderProps {
  className?: string
}

export const AvatarPlaceholder = ({
  className = '',
}: AvatarPlaceholderProps) => (
  <div
    role="img"
    aria-label="Фото профілю не завантажено"
    className={`overflow-hidden rounded-full bg-surface-strong ${className}`}
  >
    <svg viewBox="0 0 100 100" aria-hidden="true" className="h-full w-full">
      <circle cx="50" cy="38" r="18" fill="#a9a9a9" />
      <path d="M14 96c0-21 16-34 36-34s36 13 36 34z" fill="#a9a9a9" />
    </svg>
  </div>
)
