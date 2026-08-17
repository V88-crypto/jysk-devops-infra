import { mockProducts } from '../mocks/products'
import type { Product } from '../../../types/product'

const API_DELAY_MS = 500

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const cloneProduct = (product: Product): Product => {
  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      images: variant.images.map((image) => ({ ...image })),
      attributes: variant.attributes.map((attribute) => ({ ...attribute })),
    })),
  }
}

export const productService = {
  async getAll(): Promise<Product[]> {
    await delay(API_DELAY_MS)

    return mockProducts.map(cloneProduct)
  },

  async getById(id: number): Promise<Product | null> {
    await delay(API_DELAY_MS)

    const product = mockProducts.find((item) => item.id === id)

    return product ? cloneProduct(product) : null
  },

  async create(product: Product): Promise<Product> {
    await delay(API_DELAY_MS)

    const createdProduct = cloneProduct(product)
    mockProducts.push(createdProduct)

    return cloneProduct(createdProduct)
  },

  async update(product: Product): Promise<Product> {
    await delay(API_DELAY_MS)

    const productIndex = mockProducts.findIndex((item) => item.id === product.id)

    if (productIndex === -1) {
      throw new Error(`Product with id ${product.id} was not found`)
    }

    const updatedProduct = cloneProduct(product)
    mockProducts[productIndex] = updatedProduct

    return cloneProduct(updatedProduct)
  },

  async delete(id: number): Promise<void> {
    await delay(API_DELAY_MS)

    const productIndex = mockProducts.findIndex((item) => item.id === id)

    if (productIndex === -1) {
      throw new Error(`Product with id ${id} was not found`)
    }

    mockProducts.splice(productIndex, 1)
  },
}
