interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchField = ({
  value,
  onChange,
  placeholder = 'Швидкий пошук',
}: SearchFieldProps) => {
  return (
    <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-fg-subtle">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4 w-4 shrink-0 fill-none stroke-current"
        strokeWidth="1.5"
      >
        <circle cx="9" cy="9" r="6" />
        <line x1="13.5" y1="13.5" x2="17.5" y2="17.5" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full text-fg outline-none placeholder:text-fg-subtle"
      />
    </label>
  )
}
