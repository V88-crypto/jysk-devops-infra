import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../../../shared/auth/useAuth'
import {
  BOTTOM_NAV_ITEMS,
  TOP_LEVEL_NAV_ITEMS,
  WAREHOUSE_NAV_ITEMS,
} from '../navigation'
import type { AdminNavItem, AdminNavItemId } from '../navigation'
import { AdminNavIcon } from './AdminNavIcon'

interface AdminSideBarProps {
  activeItem: AdminNavItemId
  onSelect: (id: AdminNavItemId) => void
}

const topLevelItemClass = (isActive: boolean) =>
  `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors ${
    isActive
      ? 'bg-white font-semibold text-[#00A9AD] shadow-sm'
      : 'text-white/85 hover:bg-white/10 hover:text-white'
  }`

const subItemClass = (isActive: boolean) =>
  `rounded-md px-3 py-1.5 text-left text-[14px] transition-colors ${
    isActive
      ? 'bg-white/20 font-semibold text-white'
      : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`

export const AdminSideBar = ({ activeItem, onSelect }: AdminSideBarProps) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isWarehouseSectionActive = WAREHOUSE_NAV_ITEMS.some(
    (item) => item.id === activeItem,
  )

  const [isWarehousesOpen, setIsWarehousesOpen] = useState(
    isWarehouseSectionActive,
  )

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSelect = (id: AdminNavItemId) => {
    onSelect(id)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userName = user ? `${user.first_name} ${user.last_name}` : 'Адміністратор'
  const userInitials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : 'A'

  const renderTopLevelItem = (item: AdminNavItem) => (
    <button
      key={item.id}
      type="button"
      onClick={() => handleSelect(item.id)}
      aria-current={activeItem === item.id ? 'page' : undefined}
      className={topLevelItemClass(activeItem === item.id)}
    >
      <AdminNavIcon name={item.id} />
      <span className="truncate">{item.label}</span>
    </button>
  )

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-[#00A9AD] px-4 shadow-md md:hidden">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
          HYGGY
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
            Admin
          </span>
        </span>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={isMobileMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-6 w-6 fill-none stroke-current"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            {isMobileMenuOpen ? (
              <>
                <line x1="5" y1="5" x2="15" y2="15" />
                <line x1="15" y1="5" x2="5" y2="15" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col bg-[#00A9AD] shadow-xl transition-transform duration-200 md:w-[220px] md:translate-x-0 md:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="shrink-0 px-4 pb-5 pt-6">
          <div className="mb-4 flex items-center gap-2 px-1 text-white">
            <span className="text-[20px] font-bold tracking-[0.2em]">HYGGY</span>
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border border-white/40 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-[#00A9AD]"
          >
            <span>Перейти на сайт</span>
            <AdminNavIcon name="external" className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-4 h-px shrink-0 bg-white/20" />

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {TOP_LEVEL_NAV_ITEMS.map(renderTopLevelItem)}

          <div>
            <button
              type="button"
              onClick={() => setIsWarehousesOpen((prev) => !prev)}
              aria-expanded={isWarehousesOpen}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors hover:bg-white/10 ${
                isWarehouseSectionActive
                  ? 'font-semibold text-white'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <AdminNavIcon name="warehouseGroup" />
              <span className="flex-1">Склади</span>
              <AdminNavIcon
                name="chevron"
                className={`h-4 w-4 transition-transform duration-200 ${
                  isWarehousesOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {isWarehousesOpen && (
              <div className="mb-1 ml-[22px] mt-1 flex flex-col gap-0.5 border-l border-white/25 pl-3">
                {WAREHOUSE_NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    aria-current={activeItem === item.id ? 'page' : undefined}
                    className={subItemClass(activeItem === item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {BOTTOM_NAV_ITEMS.map(renderTopLevelItem)}
        </nav>

        <div className="shrink-0 border-t border-white/20 px-3 py-4">
          <div className="mb-2 flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-[#00A9AD]">
              {userInitials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-white">
                {userName}
              </p>
              {user && (
                <p className="truncate text-[12px] text-white/70">{user.email}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <AdminNavIcon name="logout" />
            <span>Вихід</span>
          </button>
        </div>
      </aside>
    </>
  )
}
