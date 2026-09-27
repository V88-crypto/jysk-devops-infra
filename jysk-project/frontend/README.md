# Jysk Clone — Frontend

Клієнтська частина інтернет-магазину HYGGY (навчальний проєкт Jysk Clone).

**Стек:** React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, React Hook Form + Zod.

## Запуск

Разом з усім проєктом (backend, MySQL, MinIO) — через Docker Compose, див. [README проєкту](../README.md).

Локально, лише фронтенд (backend має бути запущений на `http://localhost:8000`):

```bash
npm install
npm run dev
```

Сайт: http://localhost:3000

> Після додавання або оновлення залежностей перевірте, що в `package-lock.json`
> залишилися пакети для всіх платформ (`*-linux-x64-musl` тощо) — без них фронтенд
> не запускається в Docker (`node:20-alpine`).

## Скрипти

| Команда                | Що робить                                     |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | dev-сервер на порту 3000                      |
| `npm run build`        | перевірка типів + production-збірка в `dist/` |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | форматування коду Prettier                    |
| `npm run format:check` | перевірка форматування без змін               |

## Змінні середовища

| Змінна              | Опис               | За замовчуванням        |
| ------------------- | ------------------ | ----------------------- |
| `VITE_API_BASE_URL` | адреса backend API | `http://localhost:8000` |

## Структура

```
src/
  app/             App, маршрути, SiteLayout, RequireAuth, RequireAdmin, ScrollManager
  features/        одна папка на кожну частину сайту
    admin/         адмін-панель
    auth/          login, register, resetPassword
    blog/
    faq/
    home/          головна сторінка
    notFound/
    profile/
    store/
    vacancies/
  shared/
    api/           httpClient (токени, оновлення сесії), authService
    auth/          AuthProvider, useAuth, tokenStorage
    hooks/
    types/         типи, що потрібні кільком фічам
    ui/            Header, Footer, Prefooter
    validation/
  styles/          global.css (Tailwind)
  assets/          іконки та зображення
```

Усередині фічі: `components/`, `api/` (запити до backend або моки), `hooks/`, `mocks/`, `types.ts` — лише те, що потрібно цій фічі.

## Домовленості

- **Імпорти між папками — через аліас `@/`** (`@/shared/api/httpClient`), всередині однієї папки — `./`.
- **Тільки іменовані експорти**, ім'я файлу = ім'я компонента (`OrderList.tsx` → `export const OrderList`).
- **Кольори бренду — токени Tailwind** з `tailwind.config.js`: `primary`, `primary-dark` (hover), `primary-hover`. Не пишіть hex-коди бірюзового напряму.
- **Запити до backend — через `apiRequest`** з `@/shared/api/httpClient`: він сам додає токен і оновлює сесію, коли access-токен прострочений.
- Код форматується Prettier (`npm run format`) перед комітом.
