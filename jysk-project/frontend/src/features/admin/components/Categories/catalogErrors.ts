import { ApiError } from '@/shared/api/httpClient'

// The backend answers conflicts in Russian; the admin UI is Ukrainian.
const CONFLICT_MESSAGES: [string, string][] = [
  ['slug', 'Категорія з таким slug вже існує'],
  ['сама в себя', 'Категорія не може бути вкладена сама в себе'],
  ['подкатегори', 'Не можна видалити категорію, у якої є підкатегорії'],
  ['товарами', 'Не можна видалити категорію, у якій є товари'],
  ['Атрибут', 'Атрибут з такою назвою вже існує'],
]

export const catalogErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError && error.status === 409) {
    const match = CONFLICT_MESSAGES.find(([fragment]) =>
      error.message.includes(fragment),
    )

    return match?.[1] ?? fallback
  }

  if (error instanceof ApiError && error.status === 422) {
    return 'Не вдалося створити slug з назви, вкажіть його вручну'
  }

  return fallback
}
