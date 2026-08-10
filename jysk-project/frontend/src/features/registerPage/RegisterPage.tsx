import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  registerSchema,
  type RegisterFormData,
} from './registerSchema'

export const RegisterPage = () => {
    const {
    register,
    handleSubmit,
    formState: { errors },
    } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
      name: '',
      acceptedTerms: false,
      findOrders: false,
      subscribe: false,
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    console.log(data)

    // Здесь потом будет:
    // запрос на backend
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6">
      <div className="w-full max-w-[1440px] mx-auto">

        <h1
          className="
            w-full
            text-center
            font-bold
            text-[28px]
            sm:text-[36px]
            lg:text-[48px]
            py-[12px]
            sm:py-[16px]
            lg:py-[20px]
            mt-[10px]
            mb-[25px]
            sm:mb-[30px]
            lg:mb-[40px]
            border-t
            border-b
            border-[#cfcfcf]
          "
        >
          Створити обліковий запис
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >

          <div className="w-full max-w-[600px] mb-[15px] sm:mb-[18px] lg:mb-[20px]">
            <input
              type="email"
              placeholder="E-mail"
              {...register('email')}
              className={`
                w-full
                h-[50px]
                sm:h-[55px]
                lg:h-[60px]
                px-[15px]
                sm:px-[18px]
                lg:px-[20px]
                text-[16px]
                sm:text-[18px]
                lg:text-[20px]
                bg-[#e4e4e4]
                border
                rounded-[5px]
                outline-none
                ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-[#c5c5c5] focus:border-[#aaa]'
                }
              `}
            />

            {errors.email && (
              <p className="mt-1 text-[13px] text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="w-full max-w-[600px] mb-[15px] sm:mb-[18px] lg:mb-[20px]">
            <input
              type="password"
              placeholder="Пароль"
              {...register('password')}
              className={`
                w-full
                h-[50px]
                sm:h-[55px]
                lg:h-[60px]
                px-[15px]
                sm:px-[18px]
                lg:px-[20px]
                text-[16px]
                sm:text-[18px]
                lg:text-[20px]
                bg-[#e4e4e4]
                border
                rounded-[5px]
                outline-none
                ${
                  errors.password
                    ? 'border-red-500'
                    : 'border-[#c5c5c5] focus:border-[#aaa]'
                }
              `}
            />

            {errors.password && (
              <p className="mt-1 text-[13px] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="w-full max-w-[600px] mb-[15px] sm:mb-[18px] lg:mb-[20px]">
            <input
              type="password"
              placeholder="Повторити пароль"
              {...register('repeatPassword')}
              className={`
                w-full
                h-[50px]
                sm:h-[55px]
                lg:h-[60px]
                px-[15px]
                sm:px-[18px]
                lg:px-[20px]
                text-[16px]
                sm:text-[18px]
                lg:text-[20px]
                bg-[#e4e4e4]
                border
                rounded-[5px]
                outline-none
                ${
                  errors.repeatPassword
                    ? 'border-red-500'
                    : 'border-[#c5c5c5] focus:border-[#aaa]'
                }
              `}
            />

            {errors.repeatPassword && (
              <p className="mt-1 text-[13px] text-red-500">
                {errors.repeatPassword.message}
              </p>
            )}
          </div>

          <div className="w-full max-w-[600px] mb-[20px] sm:mb-[22px] lg:mb-[25px]">
            <input
              type="text"
              placeholder="Ім'я"
              {...register('name')}
              className={`
                w-full
                h-[50px]
                sm:h-[55px]
                lg:h-[60px]
                px-[15px]
                sm:px-[18px]
                lg:px-[20px]
                text-[16px]
                sm:text-[18px]
                lg:text-[20px]
                bg-[#e4e4e4]
                border
                rounded-[5px]
                outline-none
                ${
                  errors.name
                    ? 'border-red-500'
                    : 'border-[#c5c5c5] focus:border-[#aaa]'
                }
              `}
            />

            {errors.name && (
              <p className="mt-1 text-[13px] text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div
            className="
              w-full
              max-w-[600px]
              flex
              flex-col
              gap-[12px]
              sm:gap-[16px]
              lg:gap-[20px]
              mb-[25px]
              sm:mb-[28px]
              lg:mb-[30px]
            "
          >

            <div>
              <label
                className="
                  flex
                  items-start
                  text-[14px]
                  sm:text-[17px]
                  lg:text-[20px]
                  leading-[18px]
                  sm:leading-[20px]
                  text-[#555]
                "
              >
                <input
                  type="checkbox"
                  {...register('acceptedTerms')}
                  className="
                    w-[18px]
                    h-[18px]
                    shrink-0
                    mr-[8px]
                    sm:mr-[10px]
                    mt-[1px]
                  "
                />

                <span>
                  Прийняти{' '}
                  <a
                    href="#"
                    className="text-[#00a6b2] hover:underline"
                  >
                    Умови та Положення
                  </a>
                </span>
              </label>

              {errors.acceptedTerms && (
                <p className="mt-1 text-[13px] text-red-500">
                  {errors.acceptedTerms.message}
                </p>
              )}
            </div>

            <label
              className="
                flex
                items-start
                text-[14px]
                sm:text-[17px]
                lg:text-[20px]
                leading-[18px]
                sm:leading-[20px]
                text-[#555]
              "
            >
              <input
                type="checkbox"
                {...register('findOrders')}
                className="
                  w-[18px]
                  h-[18px]
                  shrink-0
                  mr-[8px]
                  sm:mr-[10px]
                  mt-[1px]
                "
              />

              <span>
                Знайти минулі замовлення для цього облікового запису
              </span>
            </label>

            <label
              className="
                flex
                items-start
                text-[14px]
                sm:text-[17px]
                lg:text-[20px]
                leading-[18px]
                sm:leading-[20px]
                text-[#555]
              "
            >
              <input
                type="checkbox"
                {...register('subscribe')}
                className="
                  w-[18px]
                  h-[18px]
                  shrink-0
                  mr-[8px]
                  sm:mr-[10px]
                  mt-[1px]
                "
              />

              <span>
                Підписатися на наші новини{' '}
                <a
                  href="#"
                  className="text-[#00a6b2] hover:underline"
                >
                  Переглянути
                </a>
              </span>
            </label>

          </div>

          <button
            type="submit"
            className="
              w-full
              max-w-[600px]
              h-[50px]
              sm:h-[55px]
              lg:h-[60px]
              rounded-[5px]
              bg-[#00adb5]
              text-white
              text-[16px]
              sm:text-[18px]
              lg:text-[20px]
              font-bold
              hover:bg-[#009da5]
              transition-colors
            "
          >
            Створити обліковий запис
          </button>

          <a
            href="#"
            className="
              mt-[15px]
              sm:mt-[18px]
              lg:mt-[20px]
              text-[16px]
              sm:text-[18px]
              lg:text-[20px]
              text-[#00a6b2]
              underline
              hover:text-[#008d96]
            "
          >
            Скасувати
          </a>

        </form>
      </div>
    </div>
  )
}