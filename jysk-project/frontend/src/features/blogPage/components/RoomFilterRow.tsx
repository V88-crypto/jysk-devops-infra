import type { BlogRoomFilter } from '../types'

interface RoomFilterRowProps {
  items: BlogRoomFilter[]
}

export function RoomFilterRow({ items }: RoomFilterRowProps) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col items-center gap-2">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-16 w-16 object-contain"
          />

          <span className="text-sm text-neutral-700">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
