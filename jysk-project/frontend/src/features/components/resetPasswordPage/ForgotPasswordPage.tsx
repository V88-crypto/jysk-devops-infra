import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from './PasswordResetSchema'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log(data)
    navigate('/reset-password')
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
            mt-[5px]
            mb-[25px]
            sm:mb-[30px]
            lg:mb-[35px]
            border-t
            border-b
            border-[#cfcfcf]
          "
        >
          Забули пароль?
        </h1>

        <p
          className="
            w-full
            max-w-[900px]
            mx-auto
            text-center
            text-[12px]
            sm:text-[14px]
            lg:text-[16px]
            leading-[16px]
            sm:leading-[18px]
            lg:leading-[20px]
            text-[#555]
            mb-[30px]
            sm:mb-[35px]
            lg:mb-[40px]
          "
        >
          Напишіть свою електронну адресу для того, щоб скинути пароль.
          Ми відправимо вам лист з посиланням, де ви зможете
          <br className="hidden sm:block" />
          ввести новий пароль.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >

          <div className="w-full max-w-[600px] mb-[25px]">

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
                    ? 'border-red-500 focus:border-red-500'
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
            Надіслати
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
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
          </button>

        </form>

      </div>
    </div>
  )
}