import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/images/vacancies-hero.jpg';
import GlobeIcon from '../../assets/icons/globe.svg?react';
import StairsIcon from '../../assets/icons/stairs.svg?react';
import TeamIcon from '../../assets/icons/team.svg?react';
import TelegramIcon from '../../assets/icons/telegram.svg?react';
import InstagramIcon from '../../assets/icons/instagram.svg?react';
import FacebookIcon from '../../assets/icons/facebook.svg?react';
import YoutubeIcon from '../../assets/icons/youtube.svg?react';
import { departmentCards, bannerData, jobSections } from './data';

const VacanciesPage: React.FC = () => {
  return (
    <main className="w-full bg-[#f3f3f3] font-sans">
      
      <div className="w-full px-4 md:px-8 xl:px-[7.03vw] py-4 md:py-6 xl:py-[1.5vw] flex items-center gap-2 text-xs md:text-sm xl:text-[0.83vw] text-dark/60">
        <Link to="/" className="hover:text-primary transition-colors">Домашня сторінка</Link>
        <span>&gt;</span>
        <span className="text-dark">Робота</span>
      </div>

      <div className="w-full px-0 md:px-8 xl:px-[7.03vw] flex justify-center">
        <div className="w-full xl:w-[85.93vw] h-[64.68vw] md:h-[40vw] lg:h-[35vw] xl:h-[21.6vw] bg-gray-300 overflow-hidden md:rounded-lg xl:rounded-none">
          <img 
            src={heroImage} 
            alt="Команда за роботою" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      <h1 className="text-center font-bold text-[#000000] mt-8 md:mt-12 lg:mt-16 xl:mt-[4.16vw] text-2xl md:text-3xl lg:text-4xl xl:text-[2.08vw] font-['Inter']">
        Працюй з нами
      </h1>

      <div className="mx-auto w-[90%] md:w-[85%] lg:w-[80%] xl:w-[77.44vw] mt-6 md:mt-8 lg:mt-10 xl:mt-[2vw] text-[#000000] font-['Inter'] font-normal text-sm md:text-sm lg:text-base xl:text-[1.25vw] leading-normal md:leading-relaxed xl:leading-[2.08vw] text-justify flex flex-col gap-4 md:gap-6 xl:gap-[1.5vw]">
        <p>
          Ми – сучасний і динамічний інтернет-магазин, який активно зростає та шукає талановитих і мотивованих людей. Якщо ти готовий долучитися до команди, що рухає інновації та обслуговує клієнтів на найвищому рівні, ми будемо раді вітати тебе серед нас! Ми цінуємо професійний розвиток наших співробітників. Пропонуємо навчання, тренінги та можливість кар'єрного зростання у різних напрямках – від обслуговування клієнтів до ІТ і маркетингу. Ми цінуємо внесок кожного члена нашої команди, тому пропонуємо конкурентну оплату праці та систему бонусів за результативну роботу.
        </p>
        <p>
          Наш інтернет-магазин спеціалізується на продажі товарів для дому, меблів та декору. Ми прагнемо надавати нашим клієнтам широкий вибір високоякісної продукції за доступними цінами. Завдяки постійній орієнтації на потреби споживачів та впровадженню новітніх технологій, ми стали одним із лідерів ринку. Наші головні цінності – це довіра, інновації та сервіс, орієнтований на клієнта. Ми працюємо для того, щоб кожен покупець отримував найкращий досвід покупок, а кожен працівник – можливість для особистого та професійного розвитку.
        </p>
      </div>

      <div className="w-full bg-white mt-10 md:mt-16 xl:mt-[4.16vw] py-10 md:py-16 xl:py-[3.12vw] border-t border-b border-gray-200">
        <div className="mx-auto w-[90%] xl:w-[77.44vw] flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4 xl:gap-0">
          <div className="flex flex-col items-center">
            <GlobeIcon className="w-16 h-16 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-[3.9vw] xl:h-[3.9vw] text-[#231F20] mb-3 md:mb-4 xl:mb-[1.04vw]" />
            <h3 className="font-['Raleway'] font-bold text-lg md:text-xs lg:text-sm xl:text-[1.25vw] text-[#231F20] text-center tracking-wide uppercase">Міжнародні можливості</h3>
          </div>
          <div className="flex flex-col items-center">
            <StairsIcon className="w-24 h-12 md:w-16 md:h-8 lg:w-20 lg:h-10 xl:w-[5.93vw] xl:h-[3.02vw] text-[#231F20] mb-3 md:mb-4 xl:mb-[1.04vw]" />
            <h3 className="font-['Raleway'] font-bold text-lg md:text-xs lg:text-sm xl:text-[1.25vw] text-[#231F20] text-center tracking-wide uppercase">Стрімка кар'єра</h3>
          </div>
          <div className="flex flex-col items-center">
            <TeamIcon className="w-24 h-16 md:w-16 md:h-10 lg:w-20 lg:h-14 xl:w-[5.88vw] xl:h-[4.07vw] text-[#231F20] mb-3 md:mb-4 xl:mb-[1.04vw]" />
            <h3 className="font-['Raleway'] font-bold text-lg md:text-xs lg:text-sm xl:text-[1.25vw] text-[#231F20] text-center tracking-wide uppercase">Командний дух</h3>
          </div>
        </div>
      </div>

      <div className="mx-auto w-[90%] xl:w-[85%] mt-10 md:mt-16 xl:mt-[4.16vw] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 xl:gap-[1.5vw]">
        {departmentCards.map((card) => (
          <div key={card.id} className="relative group w-full aspect-531/419 md:aspect-4/5 lg:aspect-531/419 rounded-[10px] xl:rounded-[0.52vw] overflow-hidden cursor-pointer">
            <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-hover-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-300 mix-blend-multiply"></div>
            <div className="absolute bottom-4 md:bottom-4 lg:bottom-6 xl:bottom-[1.5vw] left-0 w-full flex justify-center z-10 pointer-events-none">
              <h3 className="font-['Inter'] font-black text-[#FFFFFF] text-2xl md:text-base lg:text-xl xl:text-[2.08vw] uppercase text-center drop-shadow-md">
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto w-full md:w-[90%] lg:w-[90%] xl:w-[86.35vw] mt-12 md:mt-24 lg:mt-24 xl:mt-[6vw] flex flex-col mb-12 md:mb-16 lg:mb-0 xl:mb-[2vw]">
        
        <div className="bg-transparent lg:bg-primary py-8 md:py-8 lg:py-12 xl:px-[5vw] xl:py-[3vw] flex flex-col justify-center items-center">
          <h2 className="font-['Inter'] font-bold text-2xl md:text-2xl lg:text-3xl xl:text-[1.875vw] lg:mb-4 xl:mb-[1.5vw] uppercase text-[#000000] lg:text-white text-center bg-[#f3f3f3] md:bg-transparent w-full py-4 md:py-0">
            {bannerData.top.title}
          </h2>
          <p className="hidden lg:block font-['Inter'] text-sm lg:text-sm xl:text-[1.25vw] leading-relaxed xl:leading-[2.08vw] text-justify lg:text-center text-white px-8 xl:px-0">
            {bannerData.top.text}
          </p>
        </div>

        <div className="flex flex-col">
          {jobSections.map((section) => (
            <div 
              key={section.id}
              className={`flex flex-col lg:flex-row ${
                section.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full lg:w-1/2 aspect-323/284 md:aspect-4/3 lg:aspect-847/869">
                <img 
                  src={section.image} 
                  alt={section.title} 
                  className="w-full h-full object-cover md:rounded-t-lg lg:rounded-none"
                />
              </div>

              <div className="w-full lg:w-1/2 bg-transparent lg:bg-white flex flex-col justify-start lg:justify-center items-center lg:items-start px-5 py-8 md:px-6 md:py-8 lg:px-10 xl:px-[4vw] xl:py-[4vw] md:bg-white md:rounded-b-lg lg:rounded-none md:mb-8 lg:mb-0">
                <h3 className="hidden lg:block font-['Inter'] font-bold text-lg lg:text-xl xl:text-[1.875vw] text-[#000000] text-left mb-4 xl:mb-[2vw] uppercase w-full">
                  {section.title}
                </h3>
                <p className="font-['Inter'] text-sm md:text-sm lg:text-base xl:text-[1.25vw] leading-normal md:leading-relaxed xl:leading-[2.08vw] text-justify text-[#000000]">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center lg:hidden mt-2 md:mt-4">
          <button className="bg-primary text-white font-['Inter'] font-bold text-sm md:text-base w-full max-w-75 h-12 md:h-14 mx-5 md:mx-0 rounded flex justify-center items-center hover:bg-primary-hover transition-colors">
            ДЕТАЛЬНІШЕ
          </button>
        </div>

        <div className="hidden lg:flex bg-primary text-white py-12 xl:px-[5vw] xl:py-[3vw] flex-col justify-center items-center text-center px-8 mt-12 xl:mt-[4vw]">
          <h2 className="font-['Inter'] font-bold text-2xl lg:text-3xl xl:text-[1.875vw] mb-4 xl:mb-[1.5vw] uppercase text-white leading-tight">
            {bannerData.bottom.title}
          </h2>
          <p className="font-['Inter'] text-sm lg:text-sm xl:text-[1.25vw] leading-relaxed xl:leading-[2.08vw] text-justify lg:text-center text-white">
            {bannerData.bottom.text}
          </p>
        </div>

        <div className="hidden lg:flex w-full justify-center items-center gap-10 xl:gap-[6.25vw] mt-12 xl:mt-[4vw] mb-12 xl:mb-[2vw]">
          <a href="#" className="hover:opacity-80 transition-opacity">
            <TelegramIcon className="w-[5vw] h-[5vw] xl:w-[4.75vw] xl:h-[4.7vw] text-dark" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <InstagramIcon className="w-[5vw] h-[5vw] xl:w-[4.23vw] xl:h-[4.3vw] text-dark" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <FacebookIcon className="w-[5vw] h-[5vw] xl:w-[4.23vw] xl:h-[4.28vw] text-dark" />
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <YoutubeIcon className="w-[5vw] h-[5vw] xl:w-[4.82vw] xl:h-[3.85vw] text-dark" />
          </a>
        </div>

      </div>

    </main>
  );
};

export default VacanciesPage;