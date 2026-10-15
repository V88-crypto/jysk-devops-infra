import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import SearchIcon from '@/assets/icons/search.svg?react'

interface HeaderSearchProps {
  className: string
  inputClassName: string
  buttonClassName: string
  iconClassName: string
}

export const HeaderSearch = ({
  className,
  inputClassName,
  buttonClassName,
  iconClassName,
}: HeaderSearchProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
    }
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Пошук..."
        aria-label="Пошук товарів"
        className={inputClassName}
      />
      <button type="submit" aria-label="Шукати" className={buttonClassName}>
        <SearchIcon className={iconClassName} />
      </button>
    </form>
  )
}
