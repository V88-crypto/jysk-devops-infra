export const EditProduct = () => {
  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1000px]">
        <h1 className="mb-5 text-xl font-semibold text-[#222]">
          Редагування товару
        </h1>

        {/* Основна інформація */}
        <section className="space-y-3">
          <input
            type="text"
            placeholder="Введіть артикул..."
            className="h-[42px] w-full rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm outline-none transition focus:border-[#00a9ad]"
          />

          <input
            type="text"
            placeholder="Введіть назву товару..."
            className="h-[42px] w-full rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm outline-none transition focus:border-[#00a9ad]"
          />

          <select
            className="h-[42px] w-full rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm text-gray-500 outline-none focus:border-[#00a9ad]"
          >
            <option>Виберіть категорію</option>
            <option>Стільці</option>
            <option>Столи</option>
            <option>Шафи</option>
          </select>

          <input
            type="text"
            placeholder="Введіть короткий опис товару..."
            className="h-[42px] w-full rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm outline-none transition focus:border-[#00a9ad]"
          />

          <input
            type="text"
            placeholder="Введіть ціну..."
            className="h-[42px] w-full max-w-[250px] rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm outline-none transition focus:border-[#00a9ad]"
          />
        </section>

        <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" />
            <span className="rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 py-2">
              Завжди низька ціна
            </span>
          </label>

          <input
            type="text"
            placeholder="Введіть % знижки..."
            className="h-[40px] rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm outline-none"
          />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" />
            <span className="rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 py-2">
              Новинка
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" />
            <span className="rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 py-2">
              Можлива доставка
            </span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4" />
            <span className="rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 py-2">
              Чудова пропозиція
            </span>
          </label>
        </section>

        <section className="mt-5">
          <h2 className="mb-2 text-base font-semibold text-[#222]">
            Докладний опис товару
          </h2>

          <textarea
            placeholder="Введіть опис товару"
            className="h-[180px] w-full resize-y rounded border border-[#c7c7c7] bg-[#e9e9e9] p-3 text-sm outline-none transition focus:border-[#00a9ad]"
          />
        </section>

        <section className="mt-5">
          <h2 className="mb-2 text-base font-semibold text-[#222]">
            Характеристики товару
          </h2>

          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                <input
                  type="text"
                  placeholder="Назва характеристики"
                  className="h-[40px] rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm outline-none focus:border-[#00a9ad]"
                />

                <input
                  type="text"
                  placeholder="Значення характеристики"
                  className="h-[40px] rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm outline-none focus:border-[#00a9ad]"
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="h-[40px] bg-[#00a9ad] px-5 text-sm font-medium text-white transition hover:bg-[#008f93]"
            >
              Додати характеристику
            </button>

            <button
              type="button"
              className="h-[40px] bg-[#00a9ad] px-5 text-sm font-medium text-white transition hover:bg-[#008f93]"
            >
              Очистити всі характеристики
            </button>
          </div>
        </section>

        {/* Фотографії */}
        <section className="mt-5">
          <div className="flex flex-wrap gap-4">
            <div className="flex h-[105px] w-[105px] items-center justify-center bg-white">
              <img
                src="/placeholder-product.jpg"
                alt="Фото товару"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex h-[105px] w-[105px] items-center justify-center bg-white">
              <img
                src="/placeholder-product.jpg"
                alt="Фото товару"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label className="flex h-[40px] flex-1 cursor-pointer items-center rounded border border-[#c7c7c7] bg-[#e9e9e9] px-3 text-sm text-gray-600">
              <span>Виберіть фото... (до 4 шт.)</span>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
            </label>

            <button
              type="button"
              className="h-[40px] bg-[#00a9ad] px-6 text-sm font-medium text-white hover:bg-[#008f93]"
            >
              Завантажити
            </button>
          </div>
        </section>

        {/* Зберегти */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="h-[44px] w-full max-w-[220px] bg-[#00a9ad] text-sm font-medium text-white transition hover:bg-[#008f93]"
          >
            Зберегти
          </button>
        </div>
      </div>
    </main>
  )
}