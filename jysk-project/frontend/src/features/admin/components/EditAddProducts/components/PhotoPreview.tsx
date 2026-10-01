import type { PhotoPreviewProps } from '@/features/admin/components/EditAddProducts/types/productForm'

export const PhotoPreview = ({
  imageUrl,
  imageIndex,
  disabled,
  onError,
  onRemove,
}: PhotoPreviewProps) => {
  return (
    <div className="relative flex h-[180px] w-full items-center justify-center bg-white sm:w-[180px]">
      <img
        src={imageUrl}
        alt={`Фото товару ${imageIndex + 1}`}
        onError={onError}
        className="h-full w-full object-contain"
      />

      {imageIndex === 0 && (
        <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-white">
          Головне
        </span>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => onRemove(imageIndex)}
        aria-label={`Видалити фото ${imageIndex + 1}`}
        title="Видалити фото"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-[#555] shadow transition hover:bg-[#d33] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        ×
      </button>
    </div>
  )
}
