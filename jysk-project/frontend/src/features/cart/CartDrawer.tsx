import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/shared/auth/useAuth';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    isLoading,
    pendingVariantId,
    error,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
  } = useCartStore();

  const handleCheckout = () => {
    onClose();
    navigate(isAuthenticated ? '/checkout' : '/register');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-surface shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="text-xl font-bold">Огляд кошика</h2>
          <button onClick={onClose} className="p-2 text-fg-subtle hover:text-fg">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <p className="mt-10 text-center text-fg-subtle">Завантаження...</p>
          ) : items.length === 0 ? (
            <p className="mt-10 text-center text-fg-subtle">Ваш кошик порожній</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 border-b border-line pb-4 last:border-0">
                  <button
                    onClick={() => void removeItem(item.variantId)}
                    disabled={pendingVariantId === item.variantId}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-fg-subtle hover:border-danger hover:text-danger"
                    aria-label="Видалити товар"
                  >
                    ✕
                  </button>

                  <img
                    src={item.imageUrl ?? '/placeholder.png'}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 object-cover"
                  />

                  <div className="flex flex-1 flex-col">
                    <h3 className="text-sm font-semibold leading-tight">{item.name}</h3>
                    {item.sku && <p className="mt-0.5 text-xs text-fg-subtle">{item.sku}</p>}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex h-8 items-center rounded border border-line-strong">
                        <button
                          onClick={() => void updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || pendingVariantId === item.variantId}
                          className="flex w-8 items-center justify-center text-lg hover:text-primary disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => void updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={pendingVariantId === item.variantId}
                          className="flex w-8 items-center justify-center text-lg hover:text-primary"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold">{item.price * item.quantity} грн</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && (
            <p className="mt-4 text-sm text-danger" role="alert">
              {error}
            </p>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line bg-surface p-5">
            <button
              type="button"
              onClick={() => void clearCart()}
              disabled={isLoading}
              className="mb-4 text-sm text-fg-subtle underline hover:text-danger disabled:opacity-50"
            >
              Очистити кошик
            </button>
            <div className="mb-4 flex items-center justify-between text-lg font-bold">
              <span>Усього</span>
              <span>{totalPrice()} грн</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center rounded bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Продовжити
            </button>
          </div>
        )}
      </aside>
    </>
  );
};