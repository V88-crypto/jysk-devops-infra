export interface Category {
  id: number
  name: string
  slug: string
  parentId: number | null
}

export interface CategoryInput {
  name: string
  slug: string
  parentId: number | null
}
