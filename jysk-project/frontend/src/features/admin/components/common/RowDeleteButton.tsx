interface RowDeleteButtonProps {
  onClick: () => void
  disabled?: boolean
}

export const RowDeleteButton = ({ onClick, disabled }: RowDeleteButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Видалити"
      className="text-[#8a8a8a] transition-colors hover:text-[#e31b23] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.5"
      >
        <path
          d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m-6.5 0 .6 9.4a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4L14.5 6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
