interface RowEditButtonProps {
  onClick?: () => void
}

export const RowEditButton = ({ onClick }: RowEditButtonProps = {}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Редагувати"
      className="text-[#8a8a8a] transition-colors hover:text-primary"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.5"
      >
        <path
          d="M13.3 3.3a1.5 1.5 0 0 1 2.1 2.1L6 15.1l-3 .9.9-3z"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
