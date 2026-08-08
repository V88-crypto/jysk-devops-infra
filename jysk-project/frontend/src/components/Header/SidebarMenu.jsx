import React from 'react';
import logoImage from '../../assets/images/logo.png';

export default function SidebarMenu({ isOpen, setIsOpen }) {
  const menuItems = [
    "Вітальня", "Кухня", "Спальня", "Ванна", "Кабінет", "Двір", 
    "Вітальня", "Кухня", "Спальня", "Ванна", "Кабінет", "Двір"
  ];

  const bottomNavItems = [
    { text: "Блог", href: "#" },
    { text: "Магазини", href: "#" },
    { text: "Питання-відповідь", href: "#" },
    { text: "Робота", href: "#" }
  ];

  return (
    <>
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      <div 
        className={`fixed top-0 left-0 h-full w-full md:w-[50%] xl:w-[30vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-6 py-8 xl:px-[4vw] xl:py-[3vw]">
          
          <div className="flex items-center justify-between w-full shrink-0">
            <div className="w-28 md:w-32 xl:w-[7vw] h-auto flex items-center justify-start shrink-0">
              <img 
                src={logoImage} 
                alt="Логотип HYGGY" 
                className="w-full h-auto object-contain" 
              />
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-dark hover:text-primary transition-colors shrink-0"
            >
              <svg className="w-8 h-8 xl:w-[1.5vw] xl:h-[1.5vw]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <hr className="border-black/20 my-6 xl:my-[2vw] shrink-0" />

          <div className="flex flex-col flex-grow overflow-y-auto pb-6 custom-scrollbar">
            
            <nav className="flex flex-col gap-5 md:gap-6 xl:gap-[1.5vw]">
              {menuItems.map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-dark text-lg md:text-xl xl:text-[1.25vw] hover:text-primary transition-colors leading-none font-inter"
                >
                  {item}
                </a>
              ))}
            </nav>

            <hr className="border-black/20 my-6 xl:my-[2vw] shrink-0" />

            <nav className="flex flex-col gap-5 md:gap-6 xl:gap-[1.5vw]">
              {bottomNavItems.map((nav, index) => (
                <a 
                  key={index} 
                  href={nav.href} 
                  className="text-gray-medium text-lg md:text-xl xl:text-[1.25vw] hover:text-primary transition-colors leading-none font-inter"
                >
                  {nav.text}
                </a>
              ))}
            </nav>

          </div>
          
        </div>
      </div>
    </>
  );
}