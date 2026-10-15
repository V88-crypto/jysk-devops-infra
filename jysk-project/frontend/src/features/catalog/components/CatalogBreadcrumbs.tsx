import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface CatalogBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const CatalogBreadcrumbs = ({ items }: CatalogBreadcrumbsProps) => (
  <nav
    aria-label="Навігація"
    className="flex flex-wrap items-center gap-2 py-4 text-sm text-dark/60"
  >
    <Link to="/" className="transition-colors hover:text-primary">
      Домашня сторінка
    </Link>

    {items.map((item) => (
      <Fragment key={`${item.label}-${item.to ?? ''}`}>
        <span>&gt;</span>
        {item.to ? (
          <Link to={item.to} className="transition-colors hover:text-primary">
            {item.label}
          </Link>
        ) : (
          <span className="text-dark">{item.label}</span>
        )}
      </Fragment>
    ))}
  </nav>
)
