import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Fulfilment = 'delivery' | 'pickup'

interface ProductPurchaseProps {
  stock: number
  onAddToCart: (quantity: number) => void
}

const iconProps = {
  'aria-hidden': true,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'mt-0.5 h-5 w-5 shrink-0 text-fg',
} as const

const BENEFITS: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'Повернення без обмежень',
    text: 'Без часових обмежень — повертайте в будь-якому магазині HYGGY',
    icon: (
      <svg {...iconProps}>
        <path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4" />
      </svg>
    ),
  },
  {
    title: 'Гарантія ціни',
    text: '30 днів гарантії ціни на всі товари',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9.5" />
      </svg>
    ),
  },
  {
    title: 'Різні варіанти доставки',
    text: 'Швидка та зручна доставка на ваш вибір',
    icon: (
      <svg {...iconProps}>
        <path d="M2.5 6.5h11v9h-11z" />
        <path d="M13.5 9.5h4l3 3v3h-7" />
        <circle cx="6.5" cy="17.5" r="1.8" />
        <circle cx="16.5" cy="17.5" r="1.8" />
      </svg>
    ),
  },
]

const Availability = ({ ok, text }: { ok: boolean; text: string }) => (
  <p className="mt-2 flex items-center gap-2 text-sm">
    <span
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
        ok ? 'bg-[#19c514]' : 'bg-danger'
      }`}
    />
    {text}
  </p>
)

interface OptionProps {
  value: Fulfilment
  selected: Fulfilment
  onSelect: (value: Fulfilment) => void
  title: string
  children: ReactNode
}

const Option = ({
  value,
  selected,
  onSelect,
  title,
  children,
}: OptionProps) => {
  const isSelected = value === selected

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(value)}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          onSelect(value)
        }
      }}
      className={`relative cursor-pointer rounded-md border bg-surface px-5 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        isSelected
          ? 'border-primary ring-1 ring-primary'
          : 'border-line-strong hover:border-primary'
      }`}
    >
      <p className="font-bold">{title}</p>
      {children}

      {isSelected && (
        <span
          aria-hidden="true"
          className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white ring-4 ring-page"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      )}
    </div>
  )
}

export const ProductPurchase = ({ stock, onAddToCart }: ProductPurchaseProps) => {
  const [fulfilment, setFulfilment] = useState<Fulfilment>('delivery')
  const [quantity, setQuantity] = useState(1)

  const inStock = stock > 0
  const maxQuantity = Math.max(stock, 1)
  const changeQuantity = (next: number) =>
    setQuantity(Math.min(Math.max(next, 1), maxQuantity))

  return (
    <section aria-label="Покупка" className="flex flex-col gap-5">
      <div>
        <h2 className="mb-3 font-bold">Доставка чи самовивіз?</h2>

        <div
          role="radiogroup"
          aria-label="Спосіб отримання"
          className="flex flex-col gap-3 pr-3"
        >
          <Option
            value="delivery"
            selected={fulfilment}
            onSelect={setFulfilment}
            title="Доставка"
          >
            <Availability
              ok={inStock}
              text={inStock ? 'Доступно до замовлення' : 'Немає в наявності'}
            />
          </Option>

          <Option
            value="pickup"
            selected={fulfilment}
            onSelect={setFulfilment}
            title="Замов та забери"
          >
            <Availability
              ok={inStock}
              text={
                inStock
                  ? 'Можна забрати в магазині'
                  : 'Немає в наявності для самовивозу'
              }
            />
            <p className="mt-1 pl-[18px] text-sm text-fg-subtle">
              Безкоштовна послуга, замовлення готове до видачі за 30 хвилин.{' '}
              <Link
                to="/store"
                onClick={(event) => event.stopPropagation()}
                className="text-primary underline hover:text-primary-dark"
              >
                Обрати магазин
              </Link>
            </p>
          </Option>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-bold">Кількість</h2>

        <div className="flex gap-3">
          <div className="flex h-[52px] w-[124px] shrink-0 items-center justify-between rounded-md border border-line-strong bg-surface">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              disabled={!inStock || quantity <= 1}
              aria-label="Зменшити кількість"
              className="h-full w-10 text-lg transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={maxQuantity}
              value={quantity}
              disabled={!inStock}
              onChange={(event) =>
                changeQuantity(Number(event.target.value) || 1)
              }
              aria-label="Кількість"
              className="w-10 bg-transparent text-center outline-none [appearance:textfield] disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              disabled={!inStock || quantity >= maxQuantity}
              aria-label="Збільшити кількість"
              className="h-full w-10 text-lg transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={!inStock}
            onClick={() => onAddToCart(quantity)}
            className="h-[52px] flex-1 rounded-md bg-primary px-6 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Додати до кошика
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-4 border-t border-line pt-5">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title} className="flex gap-3">
            {benefit.icon}
            <div>
              <p className="font-bold">{benefit.title}</p>
              <p className="text-sm text-fg-subtle">{benefit.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}