export interface Category {
  id: string
  name: string
  imageUrl: string
  imageAlt: string
}

export interface About {
  title: string
  description: string
  imageUrl: string
  imageAlt: string
}

export interface Brand {
  id: number
  name: string
  logoUrl: string
  description: string
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
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  category?: string
  keywords?: string[]
  contentBlocks?: BlogContentBlock[]
}
