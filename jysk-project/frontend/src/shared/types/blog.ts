export interface BlogCategory {
  id: number
  name: string
  slug: string
}

export interface BlogContentBlock {
  id: number
  type: 'gallery' | 'text'
  images: string[]
  title: string
  body: string
}

export interface BlogPost {
  id: number
  slug?: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  category?: string
  categoryId?: number
  keywords?: string[]
  isPublished?: boolean
  contentBlocks?: BlogContentBlock[]
}
