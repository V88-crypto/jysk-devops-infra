// Link to a product page; with a variant id the page opens on that variant.
export const productUrl = (slug: string, variantId?: number) =>
  variantId
    ? `/product/${encodeURIComponent(slug)}?variant=${variantId}`
    : `/product/${encodeURIComponent(slug)}`
