export const formatPrice = (value: number) =>
  `${value.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} грн`

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('uk-UA')

const PRODUCT_FORMS: Record<Intl.LDMLPluralRule, string> = {
  zero: 'товарів',
  one: 'товар',
  two: 'товари',
  few: 'товари',
  many: 'товарів',
  other: 'товару',
}

const pluralRules = new Intl.PluralRules('uk-UA')

export const formatProductCount = (count: number) =>
  `${count} ${PRODUCT_FORMS[pluralRules.select(count)]}`
