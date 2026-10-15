import kitchen from '@/assets/images/categories/kuhnya.jpg'
import livingRoom from '@/assets/images/categories/mebel.jpg'
import lighting from '@/assets/images/categories/osveshchenie.jpg'
import garden from '@/assets/images/categories/sad.jpg'
import bedroom from '@/assets/images/categories/spalnya.jpg'
import bathroom from '@/assets/images/categories/vannaya.jpg'

// Categories have no images on the backend, so the main page picks a photo
// by category slug and falls back to a placeholder for new categories.
const CATEGORY_IMAGES: Record<string, string> = {
  mebel: livingRoom,
  spalnya: bedroom,
  vannaya: bathroom,
  kuhnya: kitchen,
  osveshchenie: lighting,
  sad: garden,
}

const PLACEHOLDER_IMAGE = '/images/category-placeholder.svg'

export const getCategoryImage = (slug: string) =>
  CATEGORY_IMAGES[slug] ?? PLACEHOLDER_IMAGE
