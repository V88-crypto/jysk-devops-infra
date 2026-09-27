import type { ReactNode } from 'react'

import type { AdminNavItemId } from '@/features/admin/navigation'

export type AdminIconName =
  | AdminNavItemId
  | 'warehouseGroup'
  | 'logout'
  | 'external'
  | 'chevron'

const ICON_PATHS: Partial<Record<AdminIconName, ReactNode>> = {
  products: (
    <>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </>
  ),
  warehouseGroup: (
    <>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M7 21v-8h10v8" />
      <path d="M7 17h10" />
    </>
  ),
  stores: (
    <>
      <path d="M3 4h18l-1.5 6h-15L3 4z" />
      <path d="M4.5 10v10h15V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  employees: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      <path d="M18.5 14.5a6.5 6.5 0 0 1 3 5.5" />
    </>
  ),
  clients: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  orders: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1" />
      <path d="M9 10h6M9 14h6M9 18h4" />
    </>
  ),
  blogs: (
    <>
      <path d="M14 3H6v18h12V7l-4-4z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  reviews: (
    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3z" />
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  external: (
    <>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
}

interface AdminNavIconProps {
  name: AdminIconName
  className?: string
}

export const AdminNavIcon = ({ name, className = 'h-5 w-5' }: AdminNavIconProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 ${className}`}
  >
    {ICON_PATHS[name]}
  </svg>
)
