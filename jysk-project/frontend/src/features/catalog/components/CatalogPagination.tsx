interface CatalogPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

const pageButtonClass = (isActive: boolean) =>
  `flex h-10 w-10 items-center justify-center rounded-[10px] border font-['Inter'] text-lg transition-colors ${
    isActive
      ? 'border-primary bg-primary text-white'
      : 'border-black bg-[#E0E0E0] text-black hover:bg-gray-300'
  }`

const arrowClass =
  'p-2 text-black transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-black'

export const CatalogPagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: CatalogPaginationProps) => {
  const pageCount = Math.ceil(total / pageSize)

  if (pageCount <= 1) {
    return null
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Сторінки"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Попередня сторінка"
        className={arrowClass}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === page ? 'page' : undefined}
          className={pageButtonClass(pageNumber === page)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Наступна сторінка"
        className={arrowClass}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  )
}
