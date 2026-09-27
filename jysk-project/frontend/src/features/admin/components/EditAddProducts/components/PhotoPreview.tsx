import type { PhotoPreviewProps } from '@/features/admin/components/EditAddProducts/types/productForm'

export const PhotoPreview = ({
  imageUrl,
  imageIndex,
  onError,
}: PhotoPreviewProps) => {
  return (
    <div className="flex h-[180px] w-full items-center justify-center bg-white sm:w-[180px]">
      <img
        src={imageUrl}
        alt={`Фото товару ${imageIndex + 1}`}
        onError={onError}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
