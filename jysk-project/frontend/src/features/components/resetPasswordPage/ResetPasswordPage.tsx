import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from './PasswordResetSchema'

export const ResetPasswordPage = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  })

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log(data)
    navigate('/reset-password/success')
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >

          <div className="w-full max-w-[600px] mb-[20px]">

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
                    ? 'border-red-500 focus:border-red-500'
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

          <div className="w-full max-w-[600px] mb-[25px]">

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
                    ? 'border-red-500 focus:border-red-500'
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
            Підтвердити
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