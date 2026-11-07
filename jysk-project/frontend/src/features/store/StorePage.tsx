import React, { useState } from 'react'
import { storeMockData } from './data'
import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'

export const StorePage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true)

  return (
    <main className="w-full bg-page font-sans pb-16 xl:pb-[4vw]">
      <div className="w-full px-4 md:px-8 xl:px-[7.03vw] py-4 md:py-6 xl:py-[1.5vw] flex items-center gap-2 text-xs md:text-sm xl:text-[0.83vw] text-dark/60">
        <a href="/" className="hover:text-primary transition-colors">
          Домашня сторінка
        </a>
        <span>&gt;</span>
        <a href="/stores" className="hover:text-primary transition-colors">
          Пошук магазинів
        </a>
        <span>&gt;</span>
        <span className="text-dark">Магазин</span>
      </div>

      <div className="mx-auto w-[90%] lg:w-[95%] xl:w-[85.93vw] mt-2 md:mt-4 xl:mt-[1vw] mb-16 md:mb-24 lg:mb-32 xl:mb-[13.02vw]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 xl:gap-[2vw] items-stretch">
          <div className="w-full lg:w-[60%] xl:w-[51vw] flex flex-col">
            <div className="mb-6 md:mb-8 xl:mb-[2vw]">
              <h1 className="font-['Inter'] font-bold text-2xl md:text-3xl lg:text-4xl xl:text-[2.08vw] text-dark mb-2 xl:mb-[0.5vw]">
                {storeMockData.name}
              </h1>
              <p className="font-['Inter'] font-normal text-sm md:text-base lg:text-lg xl:text-[1.25vw] text-dark mb-3 xl:mb-[0.8vw]">
                {storeMockData.address}
              </p>
              <a
                href="/stores"
                className="font-['Inter'] text-sm md:text-base xl:text-[1.25vw] text-primary underline underline-offset-4 hover:text-teal-600 transition-all"
              >
                Обрати інший магазин
              </a>
            </div>

            <div className="relative min-h-112.5 md:min-h-125 bg-line-strong rounded-[10px] xl:rounded-[0.52vw] overflow-hidden flex-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.124235261453!2d30.514334315730315!3d50.45010097947535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzAwLjQiTiAzMMKwMzAnNTEuNiJF!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Мапа магазину"
              ></iframe>

              {isPopupOpen && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-70 md:w-[320px] xl:w-[15.1vw] bg-surface rounded-[5px] xl:rounded-[0.26vw] shadow-lg p-4 md:p-5 xl:p-[1.2vw] z-10 flex flex-col">
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="absolute top-2 right-3 xl:top-[0.5vw] xl:right-[0.8vw] text-fg-subtle hover:text-fg font-bold text-lg xl:text-[1vw]"
                    aria-label="Закрити попап"
                  >
                    ✕
                  </button>
                  <img
                    src={storeMockData.image}
                    alt={storeMockData.name}
                    className="w-full aspect-253/111 object-cover rounded-[5px] xl:rounded-[0.26vw] mb-3 xl:mb-[0.8vw]"
                  />
                  <h3 className="font-['Inter'] font-bold text-sm md:text-base xl:text-[0.85vw] text-fg mb-1 xl:mb-[0.3vw] leading-tight">
                    {storeMockData.name}
                  </h3>
                  <div className="font-['Inter'] text-xs md:text-sm xl:text-[0.7vw] text-fg-muted mb-3 xl:mb-[1vw] leading-tight flex flex-col gap-1">
                    <p>{storeMockData.address}</p>
                    <p>
                      Тел:{' '}
                      <a
                        href={`tel:${storeMockData.phone}`}
                        className="text-primary hover:underline"
                      >
                        {storeMockData.phone}
                      </a>
                    </p>
                    <a
                      href={storeMockData.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mt-1"
                    >
                      Як знайти магазин
                    </a>
                  </div>

                  <h4 className="font-['Inter'] font-bold text-xs md:text-sm xl:text-[0.75vw] text-fg border-b border-line pb-1 xl:pb-[0.3vw] mb-2 xl:mb-[0.5vw]">
                    Робочі години
                  </h4>
                  <div className="flex justify-between font-['Raleway'] font-light text-[13px] md:text-sm xl:text-[0.83vw] text-fg mb-1 xl:mb-[0.3vw]">
                    <span>Сьогодні</span>
                    <span>{storeMockData.todayHours}</span>
                  </div>
                  <div className="flex justify-between font-['Raleway'] font-light text-[13px] md:text-sm xl:text-[0.83vw] text-fg">
                    <span>Завтра</span>
                    <span>{storeMockData.tomorrowHours}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[40%] xl:w-[32.86vw] flex flex-col gap-5 xl:gap-[1.04vw]">
            <div className="w-full aspect-631/396 overflow-hidden bg-surface-strong shadow-sm rounded-none">
              <img
                src={storeMockData.image}
                alt="Вхід до магазину"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full bg-surface p-6 md:p-8 xl:p-[2.5vw] shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-line flex flex-col flex-1 rounded-none">
              <h2 className="font-['Inter'] font-bold text-2xl md:text-3xl xl:text-[1.66vw] text-fg mb-6 md:mb-8 xl:mb-[2vw]">
                Робочі години
              </h2>

              <div className="flex flex-col gap-4 md:gap-5 xl:gap-[1.2vw] flex-1 justify-start">
                {storeMockData.workingHours.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between font-['Inter'] font-normal text-base md:text-lg xl:text-[1.25vw] text-fg"
                  >
                    <span>{item.day}</span>
                    <span>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Prefooter />
    </main>
  )
}
