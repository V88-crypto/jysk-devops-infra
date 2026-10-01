import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export const ProductGallery = ({ images, name }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const current = images[Math.min(selectedIndex, images.length - 1)]

  if (!current) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-white text-[#999]">
        Немає фото
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden bg-white">
        <img src={current} alt={name} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Фото ${index + 1}`}
              aria-pressed={image === current}
              className={`aspect-square overflow-hidden border-2 bg-white transition ${
                image === current
                  ? 'border-primary'
                  : 'border-transparent hover:border-[#ccc]'
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
