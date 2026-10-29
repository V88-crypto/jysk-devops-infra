import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  // Прибрали removeItem, оскільки на цій сторінці він не використовується
  const { items, totalPrice } = useCartStore();
  
  const [step, setStep] = useState<'address' | 'delivery' | 'payment' | 'success'>('address');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    house: '',
    email: '',
    phone: '',
    deliveryType: 'nova_poshta',
    paymentType: 'card',
    cardNumber: '',
    cardDate: '',
    cardCvv: '',
  });

  const [orderId, setOrderId] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'address') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else if (step === 'payment') {
      const randomId = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderId(randomId);
      setStep('success');
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ваш кошик порожній</h2>
        <button
          onClick={() => navigate('/')}
          className="rounded bg-primary px-6 py-2 text-white hover:bg-primary-dark"
        >
          Повернутися до покупок
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 font-sans">
      {step === 'address' && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <form onSubmit={handleNextStep} className="lg:col-span-2 flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-2">Адреса тата</h1>
            <div className="grid grid-cols-2 gap-4">
              <input required name="firstName" placeholder="Ім'я*" value={formData.firstName} onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
              <input required name="lastName" placeholder="Прізвище*" value={formData.lastName} onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
            </div>
            <input required name="city" placeholder="Місто*" value={formData.city} onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
            <div className="grid grid-cols-2 gap-4">
              <input required name="street" placeholder="Вулиця*" value={formData.street} onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
              <input required name="house" placeholder="Номер будинку*" value={formData.house} onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
            </div>
            <input required type="email" name="email" placeholder="E-mail*" value={formData.email} onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
            <input required type="tel" name="phone" placeholder="Мобільний телефон*" value={formData.phone} onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
            
            <div className="mt-4 flex items-center justify-between">
              <button type="button" onClick={() => navigate(-1)} className="text-primary underline">Скасувати</button>
              <button type="submit" className="rounded bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark">Перейти до доставки</button>
            </div>
          </form>

          <div className="rounded-lg border border-line bg-surface p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Ваш замовлення</h3>
            <div className="flex flex-col gap-3 mb-6 max-h-[300px] overflow-y-auto">
              {items.map(item => (
                <div key={item.variantId} className="flex items-center justify-between text-sm">
                  <span className="truncate max-w-[180px]">{item.name} (x{item.quantity})</span>
                  <span className="font-bold">{item.price * item.quantity} грн</span>
                </div>
              ))}
            </div>
            <div className="border-t border-line pt-4 flex justify-between font-bold text-lg">
              <span>Усього:</span>
              <span>{totalPrice()} грн</span>
            </div>
          </div>
        </div>
      )}

      {step === 'delivery' && (
        <form onSubmit={handleNextStep} className="max-w-xl mx-auto flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Виберіть тип доставки</h1>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-surface hover:border-primary">
              <input type="radio" name="deliveryType" value="nova_poshta_kurier" defaultChecked onChange={handleChange} />
              <span>Доставка на адресу кур'єром Нової пошти</span>
            </label>
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-surface hover:border-primary">
              <input type="radio" name="deliveryType" value="nova_poshta_dept" onChange={handleChange} />
              <span>Доставка до відділення Нової пошти</span>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <button type="button" onClick={() => setStep('address')} className="text-primary underline">Назад</button>
            <button type="submit" className="rounded bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark">Виберіть тип оплати</button>
          </div>
        </form>
      )}

      {step === 'payment' && (
        <form onSubmit={handleNextStep} className="max-w-xl mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-2">Оплата</h1>
          <input required name="cardNumber" placeholder="Номер карти (XXXX XXXX XXXX XXXX)*" onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
          <div className="grid grid-cols-2 gap-4">
            <input required name="cardDate" placeholder="MM/YY*" onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
            <input required name="cardCvv" placeholder="CVV*" onChange={handleChange} className="rounded border border-line-strong p-3 bg-surface" />
          </div>
          <div className="flex justify-between items-center mt-4">
            <button type="button" onClick={() => setStep('delivery')} className="text-primary underline">Назад</button>
            <button type="submit" className="rounded bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark">Підтвердження</button>
          </div>
        </form>
      )}

      {step === 'success' && (
        <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-4 py-10">
          <h1 className="text-3xl font-bold text-green-600">Оплата успішна!</h1>
          <p className="text-xl font-semibold">Замовлення №{orderId}</p>
          <p className="text-fg-subtle">Деталі замовлення надіслано на вашу пошту: {formData.email}</p>
          <button
            onClick={() => {
              navigate('/');
            }}
            className="mt-6 rounded bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            Повернутися на головну
          </button>
        </div>
      )}
    </div>
  );
};