interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

const buttonClass =
  'h-[34px] rounded-[4px] border border-[#d5d5d5] bg-white px-3 transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50'

export const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) => {
  if (total <= pageSize) {
    return null
  }

  const pageCount = Math.ceil(total / pageSize)
  const firstShown = (page - 1) * pageSize + 1
  const lastShown = Math.min(page * pageSize, total)

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#555]">
      <span>
        Показано {firstShown}–{lastShown} з {total}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={buttonClass}
        >
          ‹ Назад
        </button>

        <span>
          {page} / {pageCount}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className={buttonClass}
        >
          Далі ›
        </button>
      </div>
    </div>
  )
}
