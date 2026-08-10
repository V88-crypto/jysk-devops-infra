import React, { useState } from 'react';
import IconButton from './IconButton';
import NavButton from './NavButton';
import StorePanel from './StorePanel';
import SidebarMenu from './SidebarMenu'; 
import logoImage from '../../assets/images/logo.png';

import { ReactComponent as MenuIcon } from '../../assets/icons/menu.svg';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import { ReactComponent as HeartIcon } from '../../assets/icons/heart.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { ReactComponent as CartIcon } from '../../assets/icons/cart.svg';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron.svg';

const Header: React.FC = () => {
  const [isStorePanelOpen, setIsStorePanelOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full shadow-sm bg-white font-sans relative z-30">
      
      <div className="bg-primary w-full h-[35px] xl:h-[4.1vw] 2xl:h-[3.07vw]"></div>

      <div className="w-full border-b border-dark/50">
        <div className="w-full px-4 md:px-[3.1vw] xl:px-[3.3vw] 2xl:px-[7.03%] py-3 xl:py-[1.1vw] 2xl:py-[1vw]">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-3 md:gap-[2vw] xl:gap-[1.6vw] shrink-0">
              
              <img 
                src={logoImage} 
                alt="Логотип HYQGY" 
                className="w-[62px] h-[40px] md:w-[9.6vw] md:h-[6.25vw] xl:w-[7.6vw] xl:h-[4.9vw] object-contain shrink-0 order-2 xl:order-1" 
              />
              
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-2 md:gap-[1vw] xl:gap-[0.5vw] text-dark hover:text-primary transition-colors shrink-0 order-1 xl:order-2"
              >
                <MenuIcon className="w-[29px] h-[20px] md:w-[5.3vw] md:h-[2.6vw] xl:w-[3.8vw] xl:h-[1.8vw] shrink-0" />
                <span className="hidden md:block font-normal md:text-[1.82vw] xl:text-[1.25vw]">Меню</span>
              </button>
            </div>

            <div className="hidden xl:block relative xl:w-[46.5vw] shrink-0">
              <input
                type="text"
                placeholder="Пошук..."
                className="w-full xl:h-[4.9vw] xl:pl-[1.6vw] xl:pr-[3.5vw] bg-gray-border xl:text-[1.11vw] text-dark rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-dark/50"
              />
              <button className="absolute right-5 xl:right-[1.4vw] top-1/2 -translate-y-1/2 text-dark hover:text-primary">
                <SearchIcon className="xl:w-[1.6vw] xl:h-[1.6vw]" />
              </button>
            </div>

            <div className="flex items-center gap-4 md:gap-[3.1vw] xl:gap-[2vw] shrink-0">
              <IconButton Icon={HeartIcon} label="Обране" />
              <IconButton Icon={UserIcon} label="Вхід" />
              <IconButton Icon={CartIcon} label="Кошик" />
            </div>

          </div>
        </div>
      </div>

      <div className="block xl:hidden w-full px-4 md:px-[3.1vw] py-3 md:py-[2vw] border-b border-dark/10 bg-white">
        <div className="relative w-full flex justify-center">
          <input
            type="text"
            placeholder="Пошук..."
            className="w-full h-[39px] md:h-[6vw] pl-4 pr-10 bg-gray-border text-sm md:text-[1.82vw] text-dark rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-dark">
            <SearchIcon className="w-5 h-5 md:w-[3.1vw] md:h-[3.1vw]" />
          </button>
        </div>
      </div>

      <div className="hidden md:block w-full">
        <div className="w-full md:px-[4.16vw] xl:px-[3.3vw] 2xl:px-[7.03%] md:py-[2vw] xl:py-[1.1vw] 2xl:py-[1vw]">
          <div className="flex items-center justify-between">
            
            <button 
              onClick={() => setIsStorePanelOpen(true)}
              className="hidden xl:flex items-center xl:gap-[0.5vw] text-dark hover:text-primary transition-colors shrink-0"
            >
              <LocationIcon className="xl:w-[1.4vw] xl:h-[1.4vw]" />
              <span className="font-normal xl:text-[1.11vw]">HYQGY Київ ТЦ Променада</span>
              <ChevronIcon className="xl:w-[0.8vw] xl:h-[0.8vw] text-dark" />
            </button>

            <div className="flex items-center justify-between w-full xl:w-auto xl:justify-end xl:gap-[0.8vw] shrink-0">
              <NavButton 
                text="Блог" 
                active={false} 
                className="md:w-[15.88vw] xl:w-[7.18vw]" 
              />
              <NavButton 
                text="Магазини" 
                active={false} 
                className="md:w-[20.83vw] xl:w-[9.42vw]" 
              />
              <NavButton 
                text="Питання-відповідь" 
                active={false} 
                className="md:w-[29.81vw] xl:w-[13.54vw]" 
              />
              <NavButton 
                text="Робота" 
                active={false} 
                className="md:w-[20.83vw] xl:w-[9.42vw]" 
              />
            </div>

          </div>
        </div>
      </div>

      <StorePanel isOpen={isStorePanelOpen} onClose={() => setIsStorePanelOpen(false)} />
      <SidebarMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

    </header>
  );
};

export default Header;