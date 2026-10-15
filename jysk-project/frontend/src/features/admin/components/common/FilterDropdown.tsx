import type { MouseEvent } from 'react'

interface FilterOption<TId extends string | number> {
  id: TId
  name: string
}

interface FilterDropdownProps<TId extends string | number> {
  label: string
  options: FilterOption<TId>[]
  selectedId: TId | null
  onSelect: (id: NoInfer<TId> | null) => void
}

const closeDetails = (event: MouseEvent<HTMLButtonElement>) => {
  event.currentTarget.closest('details')?.removeAttribute('open')
}

export const FilterDropdown = <TId extends string | number>({
  label,
  options,
  selectedId,
  onSelect,
}: FilterDropdownProps<TId>) => {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-fg marker:content-none">
        {label}

        <span className="text-xs transition-transform duration-200 group-open:rotate-180">
          ˅
        </span>
      </summary>

      <div className="absolute left-0 top-full z-20 mt-2 w-[220px] max-w-[calc(100vw-2rem)] rounded-md border border-line bg-surface p-2 shadow-lg">
        <button
          type="button"
          onClick={(event) => {
            onSelect(null)
            closeDetails(event)
          }}
          className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-surface-muted ${
            selectedId === null ? 'font-semibold text-primary' : 'text-fg'
          }`}
        >
          Усі
        </button>

        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={(event) => {
              onSelect(option.id)
              closeDetails(event)
            }}
            className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-surface-muted ${
              selectedId === option.id
                ? 'font-semibold text-primary'
                : 'text-fg'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </details>
  )
}
