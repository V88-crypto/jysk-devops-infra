import { useState } from 'react'

const menuItems = [
  'Товари',
  'Магазини',
  'Співробітники',
  'Клієнти',
  'Замовлення',
]

export const AdminSideBar = () => {
  const [isWarehousesOpen, setIsWarehousesOpen] = useState(true)

  return (
    <aside className="fixed left-0 top-0 h-screen w-[160px] bg-[#00A9AD] px-4 py-6">
      <button
        type="button"
        className="mb-8 flex h-[37px] w-full items-center justify-center gap-2 bg-white text-[12px] p-2 font-medium text-black"
      >
        <span className="text-gray-400">HYGGY</span>
        <span>Перейти на сайт</span>
      </button>

      <nav className="flex flex-col">
        {/* Товари */}
        <button
          type="button"
          className="mb-5 text-left text-[20px] text-white transition-opacity hover:opacity-70"
        >
          Товари
        </button>

        {/* Склади */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setIsWarehousesOpen((prev) => !prev)}
            className="flex w-full items-center gap-1 text-left text-[20px] font-semibold text-white transition-opacity hover:opacity-70"
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
              <button
                type="button"
                className="text-left text-[16px] text-white transition-opacity hover:opacity-70"
              >
                Склади
              </button>

              <button
                type="button"
                className="text-left text-[16px] text-white transition-opacity hover:opacity-70"
              >
                Залишки
              </button>

              <button
                type="button"
                className="text-left text-[16px] text-white transition-opacity hover:opacity-70"
              >
                Поставки
              </button>

              <button
                type="button"
                className="text-left text-[16px] text-white transition-opacity hover:opacity-70"
              >
                Переміщення
              </button>

              <button
                type="button"
                className="text-left text-[16px] text-white transition-opacity hover:opacity-70"
              >
                Списання
              </button>
            </div>
          )}
        </div>

        {/* Остальные пункты */}
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className="mb-5 text-left text-[20px] text-white transition-opacity hover:opacity-70"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}