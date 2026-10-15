import React from 'react'
import { useNavigate } from 'react-router-dom'
import logoImage from '@/assets/images/logo.png'
import { catalogApi } from '@/features/catalog/api/catalogApi'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher'

interface SidebarMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const navigate = useNavigate()
  const { data: categories, error } = useAsyncData(catalogApi.getCategories)

  const goTo = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  const bottomNavItems: { text: string; path: string }[] = [
    { text: 'Блог', path: '/blog' },
    { text: 'Магазини', path: '/store' },
    { text: 'Питання-відповідь', path: '/faq' },
    { text: 'Робота', path: '/vacancies' },
  ]

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-full md:w-[50%] xl:w-[30vw] bg-surface z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full px-6 py-8 xl:px-[4vw] xl:py-[3vw]">
          <div className="flex items-center justify-between w-full shrink-0">
            <button
              type="button"
              onClick={() => goTo('/')}
              aria-label="На головну сторінку"
              className="w-28 md:w-32 xl:w-[7vw] h-auto flex items-center justify-start shrink-0 transition duration-200 hover:scale-105 hover:opacity-80"
            >
              <img
                src={logoImage}
                alt="Логотип HYGGY"
                className="dark:invert dark:hue-rotate-180 dark:mix-blend-lighten w-full h-auto object-contain"
              />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="text-dark hover:text-primary transition-colors shrink-0"
            >
              <svg
                className="w-8 h-8 xl:w-[1.5vw] xl:h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <hr className="border-line my-6 xl:my-[2vw] shrink-0" />

          <div className="flex flex-col flex-grow overflow-y-auto pb-6 custom-scrollbar">
            <nav
              aria-label="Категорії"
              className="flex flex-col gap-5 md:gap-6 xl:gap-[1.5vw]"
            >
              {Boolean(error) && (
                <p className="text-gray-medium">
                  Не вдалося завантажити категорії
                </p>
              )}

              {categories?.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => goTo(`/category/${category.slug}`)}
                  className="text-left text-dark text-lg md:text-xl xl:text-[1.25vw] hover:text-primary transition-colors leading-none font-inter"
                >
                  {category.name}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goTo('/categories')}
                className="text-left text-primary text-lg md:text-xl xl:text-[1.25vw] hover:text-primary-dark transition-colors leading-none font-inter"
              >
                Усі категорії
              </button>
            </nav>

            <hr className="border-line my-6 xl:my-[2vw] shrink-0" />

            <nav className="flex flex-col gap-5 md:gap-6 xl:gap-[1.5vw]">
              {bottomNavItems.map((nav) => (
                <button
                  key={nav.path}
                  type="button"
                  onClick={() => goTo(nav.path)}
                  className="text-left text-gray-medium text-lg md:text-xl xl:text-[1.25vw] hover:text-primary transition-colors leading-none font-inter"
                >
                  {nav.text}
                </button>
              ))}
            </nav>

            <hr className="border-line my-6 xl:my-[2vw] shrink-0" />

            <div>
              <p className="mb-3 text-sm font-medium text-fg-subtle font-inter">
                Тема оформлення
              </p>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
