import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isNew?: boolean;
  rating: number; 
  inStock: boolean;
  deliveryAvailable: boolean;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentRating, setCurrentRating] = useState(product.rating);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="relative flex flex-col bg-white p-4 transition-shadow hover:shadow-lg border border-transparent hover:border-gray-200">
      <button 
        onClick={toggleFavorite}
        className="absolute top-4 right-4 z-10 focus:outline-none"
        aria-label="Add to favorites"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={1.5} 
          className={`w-7 h-7 xl:w-[2vw] xl:h-[2vw] transition-colors ${isFavorite ? 'fill-black stroke-black' : 'fill-none stroke-black'}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      <div className="w-full aspect-square mb-4 overflow-hidden flex items-center justify-center">
        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
      </div>

      <div className="flex flex-col items-start gap-1 mb-2 h-14">
        {product.discountPercent && (
          <div className="bg-[#E30505] text-white font-['Raleway'] font-bold text-sm md:text-[20px] xl:text-[1vw] px-2 py-1 rounded-sm leading-none">
            -{product.discountPercent}%
          </div>
        )}
        {product.isNew && (
          <div className="bg-[#44D810] text-white font-['Raleway'] font-bold text-sm md:text-[20px] xl:text-[1vw] px-2 py-1 rounded-sm leading-none">
            Новинка
          </div>
        )}
      </div>

      <h3 className="font-['Raleway'] font-bold text-base md:text-[20px] xl:text-[1vw] text-[#231F20] mb-1 uppercase line-clamp-1">
        {product.name}
      </h3>

      <p className="font-['Raleway'] font-normal text-sm md:text-[18px] xl:text-[0.9vw] text-[#000000] mb-2 line-clamp-2 min-h-12">
        {product.description}
      </p>

      <div className="flex items-center gap-1 mb-3 cursor-pointer">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <svg 
            key={starIndex}
            onClick={() => setCurrentRating(starIndex)} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.5}
            className={`w-5 h-5 md:w-6 md:h-6 xl:w-[1.2vw] xl:h-[1.2vw] transition-transform hover:scale-125 ${
              starIndex <= currentRating 
                ? 'fill-black stroke-black' 
                : 'fill-none stroke-gray-300'
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        ))}
      </div>

      <div className="flex flex-col mb-3">
        <div className="flex items-baseline gap-1">
          <span className="font-['Raleway'] font-bold text-lg md:text-[20px] xl:text-[1vw] text-black">{product.price}$</span>
          <span className="font-['Raleway'] font-bold text-xs xl:text-[0.6vw] text-black">/шт.</span>
        </div>
        <div className="flex items-baseline gap-1 h-5">
           {product.oldPrice && (
            <>
              <span className="font-['Raleway'] font-normal text-sm md:text-[16px] xl:text-[0.8vw] text-black/50 line-through">{product.oldPrice}$</span>
              <span className="font-['Raleway'] font-normal text-[10px] xl:text-[0.5vw] text-black/50">/шт.</span>
            </>
           )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF0000]"></div>
          <span className="font-['Raleway'] font-light text-xs md:text-[14px] xl:text-[0.7vw] text-black">Доставка</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#33FF00]"></div>
          <span className="font-['Raleway'] font-light text-xs md:text-[14px] xl:text-[0.7vw] text-black">В наявності</span>
        </div>
      </div>
    </div>
  );
};
