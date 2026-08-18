import React from 'react';
import SofaIcon from '../../assets/icons/sofa.svg?react';
import FlagIcon from '../../assets/icons/flag.svg?react';
import DocumentIcon from '../../assets/icons/document.svg?react';

const Prefooter: React.FC = () => {
  return (
    <section className="w-full font-sans">
      
      <div className="w-full bg-white px-5 py-10 md:px-10 xl:px-[7.03%] xl:py-[4vw] relative z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-8 md:gap-x-6 xl:gap-[2vw] justify-items-center">
          
          <div className="flex flex-col items-center text-center col-span-1">
            <div className="flex items-center justify-center h-[60px] md:h-[75px] xl:h-[4.68vw] mb-3 md:mb-4 xl:mb-[1.25vw]">
              <SofaIcon className="h-[35px] md:h-[50px] xl:h-[3.38vw] w-auto text-dark" />
            </div>
            <p className="text-dark text-[9px] md:text-[14px] xl:text-[0.83vw] leading-tight md:leading-normal w-full max-w-[140px] md:max-w-[220px] xl:max-w-[22.2vw]">
              Різноманітний вибір сучасних рішень для декорування та облаштування як інтер'єру, так і екстер'єру.
            </p>
          </div>

          <div className="flex flex-col items-center text-center col-span-1">
            <div className="flex items-center justify-center h-[60px] md:h-[75px] xl:h-[4.68vw] mb-3 md:mb-4 xl:mb-[1.25vw]">
              <FlagIcon className="h-[40px] md:h-[55px] xl:h-[3.64vw] w-auto text-dark" />
            </div>
            <p className="text-dark text-[9px] md:text-[14px] xl:text-[0.83vw] leading-tight md:leading-normal w-full max-w-[140px] md:max-w-[220px] xl:max-w-[22.2vw]">
              Наш стиль нагадує скандинавський, але ми виходимо за рамки одного напрямку, пропорекомендуючи універсальні та функціональні варіанти, що задовольнять різні смаки.
            </p>
          </div>

          <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
            <div className="flex items-center justify-center h-[60px] md:h-[75px] xl:h-[4.68vw] mb-3 md:mb-4 xl:mb-[1.25vw]">
              <DocumentIcon className="h-[45px] md:h-[60px] xl:h-[3.9vw] w-auto text-dark" />
            </div>
            <p className="text-dark text-[9px] md:text-[14px] xl:text-[0.83vw] leading-tight md:leading-normal w-full max-w-[260px] md:max-w-[220px] xl:max-w-[22.2vw]">
              Ми орієнтовані на різні категорії покупців, пропонуючи товари в діапазоні від середньо-низьких до середньо-високих цін.
            </p>
          </div>

        </div>
      </div>

      <div className="w-full bg-gray-light relative">
        
        <div className="absolute top-0 left-0 w-full h-[6px] md:h-[10px] bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>

        <div className="px-5 py-10 md:px-10 xl:px-[7.03%] xl:pt-[3.38vw] xl:pb-[2.5vw] flex flex-col items-center text-center relative z-10">
          
          <h2 className="text-black font-bold text-[12px] md:text-[20px] xl:text-[1.45vw] mb-3 md:mb-4 xl:mb-[1.25vw] w-full md:max-w-[90%] xl:max-w-[80%]">
            Підпишись на розсилку новин та отримай код на безкоштовну доставку для свого першого замовлення!
          </h2>
          
          <p className="text-black text-[10px] md:text-[14px] xl:text-[1.25vw] font-normal mb-6 md:mb-8 xl:mb-[2.08vw] w-full md:max-w-[90%] xl:max-w-[70%]">
            Підпишіться на нашу розсилку та отримайте бонус! 10% знижка на перше замовлення, ексклюзивні пропозиції та ранній доступ до розпродажів. Введіть свій email нижче та почніть отримувати переваги!
          </p>

          <form 
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()} 
            className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 xl:gap-[1.25vw] w-full max-w-sm md:max-w-none"
          >
            <input 
              type="text" placeholder="Ім'я" 
              className="w-[151px] md:w-[174px] xl:w-[13.54vw] h-[33px] md:h-[50px] xl:h-[3.38vw] bg-gray-input rounded-[10px] px-4 xl:px-[1.04vw] text-xs md:text-sm xl:text-[0.83vw] text-dark placeholder:text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
            />
            <input 
              type="email" placeholder="E-mail" 
              className="w-[151px] md:w-[307px] xl:w-[28.12vw] h-[33px] md:h-[50px] xl:h-[3.38vw] bg-gray-input rounded-[10px] px-4 xl:px-[1.04vw] text-xs md:text-sm xl:text-[0.83vw] text-dark placeholder:text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
            />
            <button 
              type="submit" 
              className="w-[151px] md:w-[219px] xl:w-[13.54vw] h-[33px] md:h-[50px] xl:h-[3.38vw] bg-primary hover:bg-primary-hover text-white font-bold text-xs md:text-base xl:text-[0.93vw] rounded-[10px] transition-colors shrink-0 flex items-center justify-center"
            >
              Поділитися
            </button>
          </form>
        </div>

        <hr className="border-black/50 w-full" />
        
        <div className="w-full h-[5.6vw] md:h-[9.1vw] xl:h-[3.5vw]"></div>
      </div>
    </section>
  );
};

export default Prefooter;