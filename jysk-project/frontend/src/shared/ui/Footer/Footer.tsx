import React from 'react'
import { Link } from 'react-router-dom'

import visaLogo from '@/assets/images/visa.png'
import mastercardLogo from '@/assets/images/mastercard.png'
import gpayLogo from '@/assets/images/gpay.png'

import TgIcon from '@/assets/icons/telegram.svg?react'
import IgIcon from '@/assets/icons/instagram.svg?react'
import FbIcon from '@/assets/icons/facebook.svg?react'
import YtIcon from '@/assets/icons/youtube.svg?react'

interface FooterLink {
  text: string
  path?: string
}

export const Footer: React.FC = () => {
  const categories: FooterLink[] = [
    'Спальня',
    'Ванна',
    'Офіс',
    'Вітальня',
    'Кухня та їдальня',
    'Зберігання',
    'Для вікон',
    'Для саду',
    'Для дому',
    'Усі категорії',
  ].map((text) => ({ text }))
  const information: FooterLink[] = [
    { text: "Зворотній зв'язок" },
    { text: 'Магазини і графіки роботи', path: '/store' },
    { text: 'Умови та положення' },
    { text: 'Доставка' },
    { text: 'Політика конфіденційності' },
  ]
  const hyggy: FooterLink[] = [
    { text: 'Про нас' },
    { text: 'Робота в Hyggy', path: '/vacancies' },
    { text: 'Підписатись на розсилку' },
    { text: 'Блог', path: '/blog' },
    { text: 'B2B' },
    { text: 'Корисні посилання' },
  ]

  const headingClass: string =
    'font-bold text-[14px] md:text-[2.6vw] xl:text-[1.25vw] mb-4 md:mb-[3.1vw] xl:mb-[1.66vw] text-wrap'
  const linkClass: string =
    'text-[12px] md:text-[2.08vw] xl:text-[0.93vw] font-normal hover:opacity-80 transition-opacity text-wrap'
  const ulClass: string = 'flex flex-col gap-3 md:gap-[1.56vw] xl:gap-[1.04vw]'

  const renderLinks = (links: FooterLink[]) =>
    links.map((link) => (
      <li key={link.text}>
        {link.path ? (
          <Link to={link.path} className={linkClass}>
            {link.text}
          </Link>
        ) : (
          <a href="#" className={linkClass}>
            {link.text}
          </a>
        )}
      </li>
    ))

  return (
    <footer className="w-full bg-primary text-white font-sans px-5 md:px-[4.16vw] xl:px-[7.03%] py-10 md:py-[5.2vw] xl:pt-[4.16vw] xl:pb-[3.12vw]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-3 md:gap-[3vw] xl:gap-[8vw]">
        <div className="flex flex-col min-w-0">
          <h3 className={headingClass}>Категорії товарів</h3>
          <ul className={ulClass}>{renderLinks(categories)}</ul>
        </div>

        <div className="flex flex-col min-w-0">
          <h3 className={headingClass}>Інформація</h3>
          <ul className={ulClass}>{renderLinks(information)}</ul>
        </div>

        <div className="flex flex-col min-w-0">
          <h3 className={headingClass}>Hyggy</h3>
          <ul className={ulClass}>{renderLinks(hyggy)}</ul>
        </div>

        <div className="flex flex-col min-w-0 text-[12px] md:text-[2.08vw] xl:text-[0.93vw] font-normal">
          <h3 className={headingClass}>Центральний офіс</h3>
          <p className="mb-4 md:mb-[3.1vw] xl:mb-[1.66vw] leading-tight text-wrap">
            м. Київ
            <br />
            вул. Іоанна Павла, 21
            <br />
            123456
          </p>

          <h3 className={headingClass}>HYGGY B2B</h3>
          <div className="flex flex-col leading-tight mb-4 md:mb-[3.1vw] xl:mb-[1.66vw]">
            <p className="text-wrap">
              Тел:{' '}
              <a
                href="tel:+380123456789"
                className="underline hover:no-underline"
              >
                +380123456789
              </a>
            </p>
            <p className="text-wrap">
              Імейл:{' '}
              <a
                href="mailto:b2b@hyggy.com"
                className="hover:opacity-80 break-all"
              >
                b2b@hyggy.com
              </a>
            </p>
            <a
              href="#"
              className="underline font-bold hover:no-underline text-wrap"
            >
              Зв'яжіться з нами
            </a>
          </div>

          <h3 className={headingClass}>Зворотній зв'язок:</h3>
          <div className="flex flex-col leading-tight">
            <a
              href="mailto:email@hyggy.com"
              className="underline hover:no-underline break-all"
            >
              email@hyggy.com
            </a>
            <p className="text-wrap">
              Тел:{' '}
              <a
                href="tel:+380123456789"
                className="underline hover:no-underline"
              >
                +380123456789
              </a>
            </p>
            <a
              href="#"
              className="underline font-bold hover:no-underline text-wrap"
            >
              Зв'яжіться з нами
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-12 md:mt-[8vw] xl:mt-[4.16vw] gap-8 md:gap-0">
        <div className="flex items-center gap-3 md:gap-[2vw] xl:gap-[1.5vw] order-2 md:order-1">
          <img
            src={visaLogo}
            alt="Visa"
            className="w-[40.5px] h-[28.3px] md:w-[8.8vw] md:h-[6.1vw] xl:w-[4.68vw] xl:h-[3.12vw] bg-white rounded-[5px] xl:rounded-[0.26vw] object-cover shrink-0"
          />
          <img
            src={mastercardLogo}
            alt="Mastercard"
            className="w-[40.5px] h-[28.3px] md:w-[8.8vw] md:h-[6.1vw] xl:w-[4.68vw] xl:h-[3.12vw] bg-white rounded-[5px] xl:rounded-[0.26vw] object-cover shrink-0"
          />
          <img
            src={gpayLogo}
            alt="G Pay"
            className="w-[45px] h-[28px] md:w-[9.8vw] md:h-[6vw] xl:w-[5.2vw] xl:h-[3.12vw] bg-white rounded-[5px] xl:rounded-[0.26vw] object-cover shrink-0"
          />
        </div>

        <div className="flex items-center gap-4 md:gap-[3vw] xl:gap-[2vw] order-1 md:order-2">
          <a href="#" className="hover:opacity-80 transition-opacity">
            <TgIcon className="w-[21px] h-[21px] md:w-[4vw] md:h-[4vw] xl:w-[2.34vw] xl:h-[2.34vw]" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <IgIcon className="w-[21px] h-[21px] md:w-[4vw] md:h-[4vw] xl:w-[2.34vw] xl:h-[2.34vw]" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <FbIcon className="w-[21px] h-[21px] md:w-[4vw] md:h-[4vw] xl:w-[2.34vw] xl:h-[2.34vw]" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <YtIcon className="w-[21px] h-[21px] md:w-[4vw] md:h-[4vw] xl:w-[2.34vw] xl:h-[2.34vw]" />
          </a>
        </div>
      </div>
    </footer>
  )
}
