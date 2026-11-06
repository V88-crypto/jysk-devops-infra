import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { useAuth } from '@/shared/auth/useAuth';
import { checkoutApi } from './api/checkoutApi';
import type { CreatedOrder, DeliveryMethodCode, PaymentMethod } from './api/checkoutApi';

// Same rule as the backend: +380XXXXXXXXX or 0XXXXXXXXX, separators allowed.
const PHONE_SEPARATORS = /[\s()-]/g;
const UA_PHONE = /^(?:\+?380|0)\d{9}$/;

const isValidPhone = (phone: string) => UA_PHONE.test(phone.replace(PHONE_SEPARATORS, ''));

const formatDeliveryPrice = (price: number | undefined) => {
  if (price === undefined) return '';
  return price === 0 ? 'Безкоштовно' : `${price} грн`;
};

const inputClass = 'rounded border border-line-strong p-3 bg-surface';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, loadCart } = useCartStore();

  const [step, setStep] = useState<'address' | 'delivery' | 'payment' | 'success'>('address');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    street: '',
    house: '',
    email: '',
    phone: '',
    deliveryType: 'np_courier' as DeliveryMethodCode,
    departmentNumber: '',
    pickupPoint: '',
    paymentType: 'card' as PaymentMethod,
    acceptTerms: false,
  });

  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State updates are async, so a fast double click or Enter could start a
  // second order before the button gets disabled. The ref blocks it at once.
  const isSubmittingRef = useRef(false);

  // The profile arrives after the first render, so it is copied in once it
  // loads. Only empty fields are filled, never what the buyer has typed.
  const { user } = useAuth();
  const [prefilledUserId, setPrefilledUserId] = useState<number | null>(null);

  if (user && user.id !== prefilledUserId) {
    setPrefilledUserId(user.id);
    setFormData((current) => ({
      ...current,
      firstName: current.firstName || user.first_name,
      lastName: current.lastName || user.last_name,
      email: current.email || user.email,
      phone: current.phone || user.phone || '',
    }));
  }

  const subtotal = totalPrice();
  const fetchDeliveryMethods = useCallback(
    () => checkoutApi.getDeliveryMethods(subtotal),
    [subtotal],
  );
  const { data: deliveryMethods } = useAsyncData(fetchDeliveryMethods);
  const { data: pickupPoints } = useAsyncData(checkoutApi.getPickupPoints);

  const deliveryPrice = (code: DeliveryMethodCode) =>
    formatDeliveryPrice(deliveryMethods?.find((method) => method.code === code)?.price);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const goToStep = (next: typeof step) => {
    setError(null);
    setStep(next);
  };

  const submitOrder = async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const createdOrder = await checkoutApi.createOrder({
        recipient: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
        },
        deliveryMethod: formData.deliveryType,
        address: { city: formData.city, street: formData.street, house: formData.house },
        departmentNumber: Number(formData.departmentNumber),
        pickupPoint: formData.pickupPoint,
        paymentMethod: formData.paymentType,
        acceptTerms: formData.acceptTerms,
      });

      setOrder(createdOrder);
      setStep('success');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Не вдалося оформити замовлення. Спробуйте ще раз.',
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      // The order empties the cart on the server; a stock conflict changes it too.
      void loadCart();
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'address') {
      if (!isValidPhone(formData.phone)) {
        setError('Номер телефону має бути у форматі +380XXXXXXXXX');
        return;
      }
      goToStep('delivery');
    }
    else if (step === 'delivery') goToStep('payment');
    else if (step === 'payment') void submitOrder();
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

  const errorMessage = error && <p role="alert" className="text-sm text-danger">{error}</p>;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 font-sans">
      {step === 'address' && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <form onSubmit={handleNextStep} className="lg:col-span-2 flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-2">Адреса та контакти</h1>
            <div className="grid grid-cols-2 gap-4">
              <input required name="firstName" placeholder="Ім'я*" value={formData.firstName} onChange={handleChange} className={inputClass} />
              <input required name="lastName" placeholder="Прізвище*" value={formData.lastName} onChange={handleChange} className={inputClass} />
            </div>
            <input required name="city" placeholder="Місто*" value={formData.city} onChange={handleChange} className={inputClass} />
            <div className="grid grid-cols-2 gap-4">
              <input required name="street" placeholder="Вулиця*" value={formData.street} onChange={handleChange} className={inputClass} />
              <input required name="house" placeholder="Номер будинку*" value={formData.house} onChange={handleChange} className={inputClass} />
            </div>
            <input required type="email" name="email" placeholder="E-mail*" value={formData.email} onChange={handleChange} className={inputClass} />
            <input required type="tel" name="phone" placeholder="Мобільний телефон*" value={formData.phone} onChange={handleChange} className={inputClass} />

            {errorMessage}

            <div className="mt-4 flex items-center justify-between">
              <button type="button" onClick={() => navigate(-1)} className="text-primary underline">Скасувати</button>
              <button type="submit" className="rounded bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark">Перейти до доставки</button>
            </div>
          </form>

          <div className="rounded-lg border border-line bg-surface p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Ваше замовлення</h3>
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
              <span>{subtotal} грн</span>
            </div>
          </div>
        </div>
      )}

      {step === 'delivery' && (
        <form onSubmit={handleNextStep} className="max-w-xl mx-auto flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Виберіть тип доставки</h1>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-surface hover:border-primary">
              <input type="radio" name="deliveryType" value="np_courier" checked={formData.deliveryType === 'np_courier'} onChange={handleChange} />
              <span>Доставка на адресу кур'єром Нової пошти</span>
              <span className="ml-auto font-semibold">{deliveryPrice('np_courier')}</span>
            </label>
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-surface hover:border-primary">
              <input type="radio" name="deliveryType" value="np_department" checked={formData.deliveryType === 'np_department'} onChange={handleChange} />
              <span>Доставка до відділення Нової пошти</span>
              <span className="ml-auto font-semibold">{deliveryPrice('np_department')}</span>
            </label>
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-surface hover:border-primary">
              <input type="radio" name="deliveryType" value="pickup" checked={formData.deliveryType === 'pickup'} onChange={handleChange} />
              <span>Самовивіз з магазину JYSK</span>
              <span className="ml-auto font-semibold">{deliveryPrice('pickup')}</span>
            </label>
          </div>

          {formData.deliveryType === 'np_department' && (
            <input
              required
              type="number"
              min={1}
              max={99999}
              name="departmentNumber"
              placeholder={`Номер відділення у місті ${formData.city}*`}
              value={formData.departmentNumber}
              onChange={handleChange}
              className={inputClass}
            />
          )}

          {formData.deliveryType === 'pickup' && (
            <select required name="pickupPoint" value={formData.pickupPoint} onChange={handleChange} className={inputClass}>
              <option value="">Виберіть магазин*</option>
              {(pickupPoints ?? []).map((point) => (
                <option key={point.code} value={point.code}>
                  {point.name}, {point.address} ({point.working_hours})
                </option>
              ))}
            </select>
          )}

          <div className="flex justify-between items-center">
            <button type="button" onClick={() => goToStep('address')} className="text-primary underline">Назад</button>
            <button type="submit" className="rounded bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark">Виберіть тип оплати</button>
          </div>
        </form>
      )}

      {step === 'payment' && (
        <form onSubmit={handleNextStep} className="max-w-xl mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-2">Оплата</h1>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-surface hover:border-primary">
              <input type="radio" name="paymentType" value="card" checked={formData.paymentType === 'card'} onChange={handleChange} />
              <span>Оплата карткою онлайн (тестовий режим)</span>
            </label>
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-surface hover:border-primary">
              <input type="radio" name="paymentType" value="cash_on_delivery" checked={formData.paymentType === 'cash_on_delivery'} onChange={handleChange} />
              <span>Оплата при отриманні</span>
            </label>
          </div>

          {/* The backend has only a test payment provider: it marks card orders as paid right away. */}
          {formData.paymentType === 'card' && (
            <p className="text-sm text-fg-subtle">
              Оплата працює в тестовому режимі: дані картки не потрібні, кошти не списуються, а замовлення одразу позначається як оплачене.
            </p>
          )}

          <label className="flex items-center gap-3 cursor-pointer text-sm">
            <input
              required
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            />
            <span>Я погоджуюся з умовами покупки*</span>
          </label>

          {errorMessage}

          <div className="flex justify-between items-center mt-4">
            <button type="button" onClick={() => goToStep('delivery')} className="text-primary underline">Назад</button>
            <button type="submit" disabled={isSubmitting} className="rounded bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Оформлення...' : 'Підтвердження'}
            </button>
          </div>
        </form>
      )}

      {step === 'success' && order && (
        <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-4 py-10">
          <h1 className="text-3xl font-bold text-green-600">Замовлення оформлено!</h1>
          <p className="text-xl font-semibold">Замовлення №{order.id}</p>
          {formData.paymentType === 'card' && (
            <p className="text-fg-subtle">Тестову оплату зараховано, реальні кошти не списувалися</p>
          )}
          <p className="text-fg-subtle">Сума замовлення: {order.totalPrice} грн</p>
          {/* The backend sends no order emails yet, so point to the profile instead. */}
          <p className="text-fg-subtle">Статус замовлення можна переглянути в особистому кабінеті</p>
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
