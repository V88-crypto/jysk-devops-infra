export const formatPrice = (value: number) =>
  `${value.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} грн`

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('uk-UA')
