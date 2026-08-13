import React from 'react';
import notFoundImage from '../../assets/images/404-image.png';

const NotFoundPage: React.FC = () => {
  return (
    <main className="w-full flex flex-col items-center justify-center py-12 md:py-[6vw] xl:py-[5.2vw] px-5 font-sans bg-white">
      
      <div className="flex justify-center w-[90%] md:w-[70%] xl:w-[59.22vw] mb-6 md:mb-[3vw] xl:mb-[1.5vw]">
        <img 
          src={notFoundImage} 
          alt="Помилка 404 - Сторінка не знайдена" 
          className="w-full h-auto object-contain"
        />
      </div>

      <p className="font-['Raleway'] font-normal text-[5vw] md:text-[3vw] xl:text-[1.56vw] text-[#231F20] text-center">
        Сторінка не знайдена
      </p>

    </main>
  );
};

export default NotFoundPage;