import { useState } from 'react'

import {
  BOTTOM_NAV_ITEMS,
  TOP_LEVEL_NAV_ITEMS,
  WAREHOUSE_NAV_ITEMS,
} from '../navigation'
import type { AdminNavItemId } from '../navigation'

interface AdminSideBarProps {
  activeItem: AdminNavItemId
  onSelect: (id: AdminNavItemId) => void
}

const topLevelItemClass = (isActive: boolean) =>
  `mb-5 text-left text-[20px] transition-opacity hover:opacity-80 ${
    isActive ? 'font-semibold text-white' : 'text-white/70'
  }`

const subItemClass = (isActive: boolean) =>
  `text-left text-[16px] transition-opacity hover:opacity-80 ${
    isActive ? 'font-semibold text-white' : 'text-white/70'
  }`

export const AdminSideBar = ({ activeItem, onSelect }: AdminSideBarProps) => {
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

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-[#00A9AD] px-4 md:hidden">
        <span className="text-sm font-semibold text-white">HYGGY Admin</span>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={isMobileMenuOpen}
          className="flex h-9 w-9 items-center justify-center text-white"
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
        className={`fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col overflow-y-auto bg-[#00A9AD] px-4 py-6 transition-transform duration-200 md:w-[160px] md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          className="mb-8 flex h-[37px] w-full shrink-0 items-center justify-center gap-2 bg-white text-[12px] p-2 font-medium text-black"
        >
          <span className="text-gray-400">HYGGY</span>
          <span>Перейти на сайт</span>
        </button>

        <nav className="flex flex-1 flex-col">
          {TOP_LEVEL_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={topLevelItemClass(activeItem === item.id)}
            >
              {item.label}
            </button>
          ))}

          {/* Склади */}
          <div className="mb-5">
            <button
              type="button"
              onClick={() => setIsWarehousesOpen((prev) => !prev)}
              className={`flex w-full items-center gap-1 ${topLevelItemClass(
                isWarehouseSectionActive,
              )}`}
            >
              <span>Склади</span>

              <span
                className={`text-[14px] transition-transform duration-200 ${
                  isWarehousesOpen ? 'rotate-0' : '-rotate-90'
                }`}
              >
                ˅
              </span>
            </button>

            {isWarehousesOpen && (
              <div className="mt-4 flex flex-col gap-4 pl-4">
                {WAREHOUSE_NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={subItemClass(activeItem === item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {BOTTOM_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={topLevelItemClass(activeItem === item.id)}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            className="mt-auto pt-5 text-left text-[20px] text-white/70 transition-opacity hover:opacity-80"
          >
            Вихід
          </button>
        </nav>
      </aside>
    </>
  )
}
