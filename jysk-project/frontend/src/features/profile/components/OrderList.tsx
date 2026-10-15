import { useState } from 'react'

import type { OrderList as OrderListData } from '@/features/profile/types'
import type { SectionState } from '@/features/profile/hooks/useProfileData'
import { formatDate, formatPrice } from '@/features/profile/utils/format'
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from '@/shared/orders/orderStatus'
import { SectionStatus } from './SectionStatus'

interface OrderListProps {
  state: SectionState<OrderListData>
}

export const OrderList = ({ state }: OrderListProps) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  const toggleOrder = (orderId: number) => {
    setExpandedOrderId((currentId) => (currentId === orderId ? null : orderId))
  }

  const renderContent = () => {
    if (state.status === 'loading') {
      return <SectionStatus>Завантаження...</SectionStatus>
    }

    if (state.status === 'error') {
      return <SectionStatus>Не вдалося завантажити замовлення</SectionStatus>
    }

    if (state.data.items.length === 0) {
      return <SectionStatus>У вас ще немає замовлень</SectionStatus>
    }

    return (
      <div className="w-full flex flex-col gap-[10px]">
        {state.data.items.map((order) => (
          <div key={order.id} className="w-full">
            <button
              type="button"
              onClick={() => toggleOrder(order.id)}
              aria-expanded={expandedOrderId === order.id}
              className="
                w-full
                min-h-[55px]
                bg-surface
                border
                border-line-strong
                px-[18px]
                sm:px-[25px]
                flex
                items-center
                justify-between
                gap-[10px]
                text-left
                hover:bg-surface-muted
                transition-colors
              "
            >
              <span
                className="
                  text-[13px]
                  sm:text-[15px]
                  lg:text-[17px]
                  font-medium
                "
              >
                Номер замовлення: №{order.id}
              </span>

              <span
                className="
                  hidden
                  sm:block
                  text-[13px]
                  lg:text-[15px]
                "
              >
                Дата: {formatDate(order.date)}
              </span>

              <span
                className={`
                  text-[13px]
                  sm:text-[15px]
                  lg:text-[17px]
                  font-bold
                  ${ORDER_STATUS_COLORS[order.status]}
                `}
              >
                Статус: {ORDER_STATUS_LABELS[order.status]}
              </span>

              <span
                className="
                  text-[13px]
                  sm:text-[15px]
                  lg:text-[17px]
                  font-bold
                "
              >
                Ціна: {formatPrice(order.totalPrice)}
              </span>

              <span
                className="
                  text-[18px]
                  sm:text-[22px]
                  lg:text-[26px]
                "
              >
                {expandedOrderId === order.id ? '⌃' : '⌄'}
              </span>
            </button>

            {expandedOrderId === order.id && (
              <div
                className="
                  w-full
                  bg-surface
                  border
                  border-t-0
                  border-line-strong
                  px-[18px]
                  sm:px-[25px]
                  py-[20px]
                  sm:py-[25px]
                  flex
                  flex-col
                  lg:flex-row
                  gap-[25px]
                "
              >
                <div className="w-full lg:w-[23%] shrink-0">
                  <p
                    className="
                      text-[13px]
                      sm:text-[15px]
                      lg:text-[17px]
                      font-medium
                      mb-[15px]
                    "
                  >
                    Номер замовлення: №{order.id}
                  </p>

                  <p
                    className="
                      text-[13px]
                      sm:text-[15px]
                      lg:text-[17px]
                      mb-[15px]
                    "
                  >
                    Дата: {formatDate(order.date)}
                  </p>

                  <p
                    className={`
                      text-[13px]
                      sm:text-[15px]
                      lg:text-[17px]
                      font-bold
                      mb-[15px]
                      ${ORDER_STATUS_COLORS[order.status]}
                    `}
                  >
                    Статус: {ORDER_STATUS_LABELS[order.status]}
                  </p>

                  <p
                    className="
                      text-[12px]
                      sm:text-[14px]
                      lg:text-[15px]
                      text-fg-muted
                    "
                  >
                    Адреса доставки: {order.address}
                  </p>
                </div>

                <div className="w-full">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`
                        w-full
                        min-h-[75px]
                        flex
                        items-center
                        justify-between
                        gap-[15px]
                        py-[10px]
                        ${index !== 0 ? 'border-t border-line-strong' : ''}
                      `}
                    >
                      <div className="w-[60%]">
                        <p
                          className="
                            text-[13px]
                            sm:text-[15px]
                            lg:text-[17px]
                            font-bold
                          "
                        >
                          {item.name}
                        </p>

                        <p
                          className="
                            mt-[5px]
                            text-[10px]
                            sm:text-[12px]
                            lg:text-[14px]
                            text-fg-muted
                          "
                        >
                          Артикул: {item.sku}
                        </p>
                      </div>

                      <div className="w-[35%] text-right">
                        <p
                          className="
                            text-[12px]
                            sm:text-[14px]
                            lg:text-[16px]
                            font-bold
                          "
                        >
                          Ціна: {formatPrice(item.price * item.quantity)}
                        </p>

                        <p
                          className="
                            mt-[5px]
                            text-[10px]
                            sm:text-[12px]
                            lg:text-[14px]
                          "
                        >
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      id="profile-orders"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 scroll-mt-4"
    >
      <h2
        className="
          text-[28px]
          sm:text-[36px]
          lg:text-[48px]
          font-bold
          mb-[30px]
          sm:mb-[35px]
          lg:mb-[40px]
        "
      >
        Мої замовлення
      </h2>

      {renderContent()}
    </div>
  )
}
