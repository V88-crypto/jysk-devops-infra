import { useState } from 'react'
import type { ChangeEvent } from 'react'

interface PhotoUploadRowProps {
  placeholder?: string
  multiple?: boolean
  onFilesSelected?: (files: File[]) => void
}

export const PhotoUploadRow = ({
  placeholder = 'Виберіть фото...',
  multiple = false,
  onFilesSelected,
}: PhotoUploadRowProps) => {
  const [selectedText, setSelectedText] = useState(placeholder)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])

    setSelectedText(
      files.length ? files.map((file) => file.name).join(', ') : placeholder,
    )

    onFilesSelected?.(files)
  }

  return (
    <div className="flex min-h-[48px] w-full flex-col border border-line-strong bg-surface-muted sm:flex-row sm:items-center">
      <label className="flex min-h-[48px] flex-1 cursor-pointer items-center overflow-hidden px-4 text-sm text-fg-muted">
        <span className="truncate">{selectedText}</span>

        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </label>

      <button
        type="button"
        className="m-2 h-[36px] w-[130px] shrink-0 rounded-[4px] bg-primary text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Завантажити
      </button>
    </div>
  )
}
