import type { Category } from '@/features/admin/types/category'

export interface CategoryRow {
  category: Category
  depth: number
}

// Lists categories parent-first, each followed by its children, so the table
// reads as a tree without nested markup.
export const flattenCategoryTree = (categories: Category[]): CategoryRow[] => {
  const childrenByParent = new Map<number | null, Category[]>()

  for (const category of categories) {
    const siblings = childrenByParent.get(category.parentId) ?? []
    siblings.push(category)
    childrenByParent.set(category.parentId, siblings)
  }

  const rows: CategoryRow[] = []
  const visit = (parentId: number | null, depth: number) => {
    for (const category of childrenByParent.get(parentId) ?? []) {
      rows.push({ category, depth })
      visit(category.id, depth + 1)
    }
  }

  visit(null, 0)

  return rows
}

export const collectDescendantIds = (
  categories: Category[],
  rootId: number,
): Set<number> => {
  const ids = new Set([rootId])
  let isGrowing = true

  while (isGrowing) {
    isGrowing = false

    for (const category of categories) {
      if (
        category.parentId !== null &&
        ids.has(category.parentId) &&
        !ids.has(category.id)
      ) {
        ids.add(category.id)
        isGrowing = true
      }
    }
  }

  return ids
}
