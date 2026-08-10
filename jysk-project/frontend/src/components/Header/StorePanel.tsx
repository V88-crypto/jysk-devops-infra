import React from 'react';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';

interface StorePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Описуємо тип для одного магазину з масиву
interface Store {
  id: number;
  name: string;
  isOpen: boolean;
  time: string;
}

const StorePanel: React.FC<StorePanelProps> = ({ isOpen, onClose }) => {
  const stores: Store[] = [
    { id: 1, name: 'HYQGY Київ, ТЦ Променада', isOpen: true, time: 'Зачиняється о 20:00' },
    { id: 2, name: 'HYQGY Київ, ТЦ Променада', isOpen: true, time: 'Зачиняється о 20:00' },
    { id: 3, name: 'HYQGY Київ, ТЦ Променада', isOpen: true, time: 'Зачиняється о 20:00' },
    { id: 4, name: 'HYQGY Київ, ТЦ Променада', isOpen: true, time: 'Зачиняється о 20:00' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      <div className={`fixed top-0 right-0 h-full w-full md:w-[60%] xl:w-[35vw] bg-white z-50 shadow-2xl flex flex-col font-sans transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        <div className="flex items-center justify-between px-5 pt-6 pb-4 xl:px-[2.5vw] xl:pt-[2.5vw] xl:pb-[2vw] shrink-0 border-b border-dark/20">
          <span className="font-bold text-xl md:text-2xl xl:text-[1.25vw] text-dark leading-tight pr-4">
            HYQGY Київ ТЦ Променада
          </span>
          <button 
            onClick={onClose} 
            className="text-dark hover:text-primary transition-colors shrink-0"
          >
            <svg className="w-8 h-8 xl:w-[1.5vw] xl:h-[1.5vw]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 xl:px-[2.5vw] xl:py-[2vw] gap-4 xl:gap-[1vw] custom-scrollbar">
          
          <div className="relative w-full shrink-0 mb-2 xl:mb-[1vw]">
            <input
              type="text"
              placeholder="Пошук..."
              className="w-full h-12 xl:h-[3.7vw] pl-4 pr-12 xl:pl-[1.5vw] xl:pr-[3.5vw] bg-gray-light text-base xl:text-[1.25vw] text-dark rounded-md xl:rounded-[0.5vw] focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-dark/50"
            />
            <button className="absolute right-4 xl:right-[1.2vw] top-1/2 -translate-y-1/2 text-dark hover:text-primary">
              <SearchIcon className="w-5 h-5 xl:w-[1.6vw] xl:h-[1.6vw]" />
            </button>
          </div>

          {stores.map((store) => (
            <div 
              key={store.id} 
              className="w-full h-auto border border-dark/20 shrink-0 flex flex-col gap-3 xl:gap-[1.5vw] p-4 xl:p-[1.5vw] rounded-sm"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 xl:gap-[1vw]">
                <h3 className="font-bold text-base xl:text-[1.25vw] text-dark leading-tight flex-1">
                  {store.name}
                </h3>
                <button className="bg-primary hover:bg-primary-hover transition-colors text-white text-xs xl:text-[1.1vw] px-4 py-2 xl:px-[1.5vw] xl:py-[0.8vw] rounded xl:rounded-[0.5vw] whitespace-nowrap shrink-0">
                  Обрати магазин
                </button>
              </div>

              <div className="flex justify-between items-end text-xs md:text-sm xl:text-[1.04vw]">
                <div>
                  <span className="text-[#34B906] font-bold">Відчинено:</span>
                  <span className="text-dark ml-1 xl:ml-[0.3vw]">{store.time}</span>
                </div>
                <a href="#" className="text-primary font-medium underline hover:no-underline whitespace-nowrap">
                  Робочі години
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StorePanel;