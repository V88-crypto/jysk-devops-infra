import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { profileApi } from '@/features/profile/api/profileApi'
import {
  ACCEPTED_IMAGE_TYPES,
  uploadErrorMessage,
  validateImageFile,
} from '@/shared/api/uploads'
import { useAuth } from '@/shared/auth/useAuth'

const linkClass = `
  text-[12px]
  lg:text-[14px]
  text-primary
  underline
  hover:text-primary-dark
  disabled:cursor-not-allowed
  disabled:opacity-60
`

export const AvatarActions = () => {
  const { user, updateUser } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'deleting'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return null
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    const validationError = validateImageFile(file)

    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setStatus('uploading')

    try {
      updateUser(await profileApi.uploadAvatar(file))
    } catch (uploadError) {
      setError(uploadErrorMessage(uploadError))
    } finally {
      setStatus('idle')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Видалити фото профілю?')) {
      return
    }

    setError(null)
    setStatus('deleting')

    try {
      await profileApi.deleteAvatar()
      updateUser({ ...user, avatar_url: null })
    } catch (deleteError) {
      setError(uploadErrorMessage(deleteError))
    } finally {
      setStatus('idle')
    }
  }

  const isBusy = status !== 'idle'

  return (
    <div className="mt-[5px]">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={(event) => void handleFileChange(event)}
        className="hidden"
      />

      <div className="flex flex-wrap gap-x-[15px] gap-y-[5px]">
        <button
          type="button"
          disabled={isBusy}
          onClick={() => inputRef.current?.click()}
          className={linkClass}
        >
          {status === 'uploading'
            ? 'Завантаження...'
            : user.avatar_url
              ? 'Змінити фото'
              : 'Завантажити фото'}
        </button>

        {user.avatar_url && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void handleDelete()}
            className={linkClass}
          >
            {status === 'deleting' ? 'Видалення...' : 'Видалити фото'}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-[5px] text-[12px] lg:text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
