import React from 'react';

interface IconButtonProps {
  Icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({ Icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center justify-center text-dark transition-colors"
    >

      <Icon className="w-6 h-6 md:w-7 md:h-7 xl:w-[1.6vw] xl:h-[1.6vw] text-dark group-hover:text-primary transition-colors duration-200" />
      
      <span className="hidden md:block text-[10px] xl:text-[1vw] font-medium leading-none mt-1 xl:mt-[0.2vw] group-hover:text-primary transition-colors duration-200">
        {label}
      </span>
      
    </button>
  );
};
