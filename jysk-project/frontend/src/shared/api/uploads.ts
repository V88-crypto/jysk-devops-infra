import { ApiError } from './httpClient'

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE_MB = 5

export const validateImageFile = (file: File): string | null => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Підтримуються лише зображення JPEG, PNG або WEBP'
  }

  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Файл більший за ${MAX_IMAGE_SIZE_MB} МБ`
  }

  return null
}

export const uploadErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 503) {
      return 'Сховище фото тимчасово недоступне, спробуйте пізніше'
    }

    if (error.status === 415) {
      return 'Підтримуються лише зображення JPEG, PNG або WEBP'
    }

    if (error.status === 413) {
      return `Файл більший за ${MAX_IMAGE_SIZE_MB} МБ`
    }
  }

  return 'Не вдалося завантажити фото'
}
