export interface BlogContentBlock {
  id: number
  type: 'gallery' | 'text'
  images: string[]
  title: string
  body: string
}

export interface BlogPost {
  id: number
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  category?: string
  keywords?: string[]
  contentBlocks?: BlogContentBlock[]
}
