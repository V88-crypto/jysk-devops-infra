import { useEffect, useState } from 'react'

import { getOrders } from '../data/ordersApi'
import type { Order } from '../../../types/profile'

export const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  const toggleOrder = (orderId: number) => {
    setExpandedOrderId((currentId) =>
      currentId === orderId ? null : orderId,
    )
  }

  if (isLoading) {
    return (
      <div className="w-full py-[50px] text-center">
        Завантаження...
      </div>
    )
  }

  return (
  <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">

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

    <div className="w-full flex flex-col gap-[10px]">

      {orders.map((order) => (
        <div key={order.id} className="w-full">

          <button
            type="button"
            onClick={() => toggleOrder(order.id)}
            className="
              w-full
              min-h-[55px]
              bg-white
              border
              border-[#d5d5d5]
              px-[18px]
              sm:px-[25px]
              flex
              items-center
              justify-between
              text-left
              hover:bg-[#fafafa]
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
              Номер замовлення: {order.orderNumber}
            </span>

            <span
              className="
                hidden
                sm:block
                text-[13px]
                lg:text-[15px]
              "
            >
              Дата: {order.date}
            </span>

            <span
              className="
                text-[13px]
                sm:text-[15px]
                lg:text-[17px]
                font-bold
                text-[#22aa00]
              "
            >
              Статус: {order.status}
            </span>

            <span
              className="
                text-[13px]
                sm:text-[15px]
                lg:text-[17px]
                font-bold
              "
            >
              Цена: {order.totalPrice} грн
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
                bg-white
                border
                border-t-0
                border-[#d5d5d5]
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
                  Номер замовлення: {order.orderNumber}
                </p>

                <p
                  className="
                    text-[13px]
                    sm:text-[15px]
                    lg:text-[17px]
                    mb-[15px]
                  "
                >
                  Дата: {order.date}
                </p>

                <p
                  className="
                    text-[13px]
                    sm:text-[15px]
                    lg:text-[17px]
                    font-bold
                    text-[#22aa00]
                  "
                >
                  Статус: {order.status}
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
                      ${
                        index !== 0
                          ? 'border-t border-[#bdbdbd]'
                          : ''
                      }
                    `}
                  >

                    <div className="w-[45%] sm:w-[50%]">

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
                          text-[#555]
                        "
                      >
                        {item.description}
                      </p>

                    </div>

                    <div
                      className="
                        w-[70px]
                        sm:w-[90px]
                        lg:w-[110px]
                        flex
                        justify-center
                      "
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          w-[55px]
                          h-[55px]
                          sm:w-[70px]
                          sm:h-[70px]
                          lg:w-[80px]
                          lg:h-[80px]
                          object-contain
                        "
                      />
                    </div>

                    <div className="w-[25%] text-right">

                      <p
                        className="
                          text-[12px]
                          sm:text-[14px]
                          lg:text-[16px]
                          font-bold
                        "
                      >
                        Ціна: {item.price} грн
                      </p>

                      <p
                        className="
                          mt-[5px]
                          text-[10px]
                          sm:text-[12px]
                          lg:text-[14px]
                        "
                      >
                        {item.quantity}x{item.price} грн
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

  </div>
)
}
