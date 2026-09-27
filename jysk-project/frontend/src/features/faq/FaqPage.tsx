import React, { useState } from 'react';
import { 
  faqIntroText, 
  faqContacts, 
  faqCategories, 
  popularQuestionsColumn1, 
  popularQuestionsColumn2 
} from './data';
import Prefooter from '@/shared/ui/Prefooter/Prefooter';

import messengerIcon from '@/assets/icons/messenger.svg';
import phoneIcon from '@/assets/icons/phone.svg';
import emailIcon from '@/assets/icons/email.svg';
import arrowIcon from '@/assets/icons/arrow.svg';

const FaqPage: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(['delivery']);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) 
        ? prev.filter(sectionId => sectionId !== id) 
        : [...prev, id]
    );
  };

  return (
    <main className="w-full bg-[#f3f3f3] font-sans pb-16 xl:pb-[4vw]">
      
      <div className="w-full px-4 md:px-8 xl:px-[7.03vw] py-4 md:py-6 xl:py-[1.5vw] flex items-center gap-2 text-xs md:text-sm xl:text-[0.83vw] text-dark/60">
        <a href="/" className="hover:text-primary transition-colors">Домашня сторінка</a>
        <span>&gt;</span>
        <span className="text-dark">Питання/відповіді</span>
      </div>

      <div className="mx-auto w-[90%] xl:w-[85.93vw] mt-2 md:mt-4 xl:mt-[1vw] mb-16 md:mb-24 lg:mb-32 xl:mb-[13.02vw]">
        
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-[4vw] mb-16 xl:mb-[4vw] items-start">
          
          <div className="w-full lg:w-[65%] flex flex-col">
            <h1 className="font-['Inter'] font-bold text-3xl md:text-4xl xl:text-[2.5vw] text-black mb-6 xl:mb-[2vw]">
              Питання і відповіді
            </h1>
            <p className="font-['Inter'] font-normal text-sm md:text-base lg:text-lg xl:text-[1.25vw] leading-relaxed xl:leading-[1.82vw] text-black text-justify mb-8 xl:mb-[2.5vw]">
              {faqIntroText}
            </p>

            <div className="flex flex-col gap-4 xl:gap-[1vw]">
              {faqCategories.map(category => {
                const isOpen = openSections.includes(category.id);
                return (
                  <div 
                    key={category.id} 
                    className="w-full overflow-hidden bg-[#E0E0E0] transition-colors"
                  >
                    <button 
                      onClick={() => toggleSection(category.id)}
                      className="w-full flex justify-between items-center text-left py-4 px-6 md:py-5 md:px-8 xl:py-[1.5vw] xl:px-[2.5vw] focus:outline-none"
                    >
                      <span className="font-['Inter'] font-bold text-base md:text-xl xl:text-[1.45vw] text-black">
                        {category.title}
                      </span>
                      <img 
                        src={arrowIcon} 
                        alt="Toggle" 
                        className={`w-6 h-6 xl:w-[2vw] xl:h-[2vw] transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} 
                      />
                    </button>

                    {isOpen && (
                      <div className="flex flex-col px-6 pb-6 md:px-8 md:pb-8 xl:px-[2.5vw] xl:pb-[2vw] gap-3 xl:gap-[1vw] border-t border-black mx-4 md:mx-6 xl:mx-[1vw] pt-4 xl:pt-[1vw]">
                        {category.items.map((item, idx) => (
                          <a 
                            href="#" 
                            key={idx} 
                            className="font-['Inter'] font-normal text-sm md:text-base xl:text-[1.25vw] leading-relaxed xl:leading-[1.82vw] text-black underline decoration-black underline-offset-4 hover:text-primary hover:decoration-primary transition-colors"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-[35%] xl:w-[27.6vw] flex flex-col items-center">
            <h2 className="font-['Inter'] font-bold text-3xl md:text-4xl xl:text-[2.08vw] text-black mb-6 xl:mb-[1.5vw]">
              Контакти
            </h2>
            
            <div className="w-full bg-white pt-8 pb-10 px-6 xl:pt-[3vw] xl:pb-[4vw] xl:px-[2.5vw] flex flex-col items-center shadow-sm">
              
              <div className="w-full flex items-center justify-center gap-4 xl:gap-[1.2vw] border-b border-black pb-4 xl:pb-[1.5vw] mb-4 xl:mb-[1.5vw]">
                <div className="w-8 h-8 xl:w-[2.2vw] xl:h-[2.2vw] shrink-0 flex items-center justify-center">
                  <img src={messengerIcon} alt="Messenger" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col flex-1 max-w-62.5 xl:max-w-[17.5vw]">
                  <span className="font-['Inter'] font-medium text-lg xl:text-[1.14vw] text-black leading-tight xl:leading-[1.8vw]">{faqContacts.messenger.title}</span>
                  <span className="font-['Inter'] font-light text-sm xl:text-[0.93vw] text-black leading-tight xl:leading-[1.8vw]">{faqContacts.messenger.time}</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center gap-4 xl:gap-[1.2vw] border-b border-black pb-4 xl:pb-[1.5vw] mb-4 xl:mb-[1.5vw]">
                <div className="w-8 h-8 xl:w-[2.2vw] xl:h-[2.2vw] shrink-0 flex items-center justify-center">
                  <img src={phoneIcon} alt="Phone" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col flex-1 max-w-62.5 xl:max-w-[17.5vw]">
                  <span className="font-['Inter'] font-medium text-lg xl:text-[1.14vw] text-black leading-tight xl:leading-[1.8vw]">{faqContacts.phone.title}</span>
                  <span className="font-['Inter'] font-light text-sm xl:text-[0.93vw] text-black leading-tight xl:leading-[1.8vw]">{faqContacts.phone.time}</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center gap-4 xl:gap-[1.2vw] border-b border-black pb-6 xl:pb-[2vw] mb-6 xl:mb-[2vw]">
                <div className="w-8 h-8 xl:w-[2.2vw] xl:h-[2.2vw] shrink-0 flex items-center justify-center">
                  <img src={emailIcon} alt="Email" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col flex-1 max-w-62.5 xl:max-w-[17.5vw]">
                  <span className="font-['Inter'] font-medium text-lg xl:text-[1.14vw] text-black leading-tight xl:leading-[1.8vw]">{faqContacts.email.title}</span>
                  <span className="font-['Inter'] font-light text-sm xl:text-[0.93vw] text-black leading-tight xl:leading-[1.8vw]">{faqContacts.email.time}</span>
                </div>
              </div>

              <div className="w-full flex flex-col items-center">
                <span className="font-['Inter'] font-bold text-lg xl:text-[1.14vw] text-black leading-tight xl:leading-[1.8vw] mb-2 text-center w-full max-w-75 xl:max-w-[25.4vw]">
                  Графік роботи відділу по роботі з клієнтами
                </span>
                <ul className="list-disc list-inside font-['Inter'] font-light text-lg xl:text-[1.14vw] text-black leading-tight xl:leading-[1.8vw] flex flex-col items-center w-full max-w-50 xl:max-w-[13.7vw]">
                  {faqContacts.schedule.map((time, idx) => (
                    <li key={idx} className="w-full text-left">{time}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

        <div className="w-full flex flex-col">
          <h2 className="font-['Inter'] font-bold text-3xl md:text-4xl xl:text-[2.5vw] text-black mb-6 xl:mb-[2.5vw]">
            Найбільш поширені питання
          </h2>
          
          <div className="w-full bg-white p-6 md:p-8 xl:py-[2.5vw] xl:px-[2.5vw] flex flex-col md:flex-row gap-8 xl:gap-[4vw] shadow-sm">
            <div className="flex-1 flex flex-col gap-6 xl:gap-[1.5vw]">
              {popularQuestionsColumn1.map((q, idx) => (
                <a href="#" key={idx} className="font-['Inter'] font-normal text-base md:text-lg xl:text-[1.3vw] leading-tight xl:leading-[1.82vw] text-black underline decoration-black underline-offset-4 hover:text-primary hover:decoration-primary transition-colors text-justify">
                  {q}
                </a>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-6 xl:gap-[1.5vw]">
              {popularQuestionsColumn2.map((q, idx) => (
                <a href="#" key={idx} className="font-['Inter'] font-normal text-base md:text-lg xl:text-[1.3vw] leading-tight xl:leading-[1.82vw] text-black underline decoration-black underline-offset-4 hover:text-primary hover:decoration-primary transition-colors text-justify">
                  {q}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Prefooter />
    </main>
  );
};

export default FaqPage;