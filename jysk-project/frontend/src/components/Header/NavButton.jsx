import React from 'react';

const NavButton = ({ text, active, className = "" }) => {
  const colorClasses = active 
    ? "bg-primary text-white" 
    : "bg-gray-border text-dark hover:bg-[#868686]";

  return (
    <button className={`
      flex items-center justify-center shrink-0
      h-[40px] md:h-[5.85vw] xl:h-[2.65vw]
      text-[14px] md:text-[2.6vw] xl:text-[1.25vw]
      rounded-[2px] 
      font-normal whitespace-nowrap 
      transition-colors duration-200 
      ${colorClasses}
      ${className}
    `}>
      {text}
    </button>
  );
};

export default NavButton;