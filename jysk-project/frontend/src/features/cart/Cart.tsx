import React from 'react';
import { useCartStore } from '../../store/useCartStore';

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return <div className="p-4 text-center text-gray-500 mt-10">Ваша корзина пуста</div>;
  }

  return (
    <div className="flex flex-col h-full mt-8">
      <h2 className="text-2xl font-bold mb-6">Корзина</h2>
      
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between border-b pb-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
              
              <div className="flex-1 ml-4">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-gray-600">{item.price.toFixed(2)} €</p>
                
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full font-bold"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 ml-4 p-2"
                title="Удалить"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <span>Итого:</span>
          <span>{totalPrice().toFixed(2)} €</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
          Оформить заказ
        </button>
      </div>
    </div>
  );
};