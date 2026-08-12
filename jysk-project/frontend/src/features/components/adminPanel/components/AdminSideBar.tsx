const menuItems = [
  'Товари',
  'Склади',
  'Магазини',
  'Співробітники',
  'Клієнти',
  'Замовлення',
]

export const AdminSideBar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[160px] bg-[#00A9AD] px-4 py-6">
      <button
        type="button"
        className="mb-8 flex h-[32px] w-full items-center justify-center gap-1 bg-white text-[12px] font-medium text-black"
      >
        <span className="text-gray-400">JYSK</span>
        <span>Перейти на сайт</span>
      </button>

      <nav className="flex flex-col">
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