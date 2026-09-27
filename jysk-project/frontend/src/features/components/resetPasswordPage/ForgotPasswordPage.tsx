import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { authService } from '../../../shared/api/authService'
import { ApiError } from '../../../shared/api/httpClient'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from './PasswordResetSchema'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [sentToEmail, setSentToEmail] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmitError(null)

    try {
      await authService.forgotPassword(data.email)
      setSentToEmail(data.email)
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'Не вдалося надіслати лист. Спробуйте ще раз.',
      )
    }
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
          {sentToEmail ? 'Перевірте пошту' : 'Забули пароль?'}
        </h1>

        {sentToEmail ? (
          <div className="w-full flex flex-col items-center">
            <p
              className="
                w-full
                max-w-[600px]
                text-center
                text-[14px]
                sm:text-[16px]
                lg:text-[18px]
                leading-[22px]
                sm:leading-[24px]
                lg:leading-[28px]
                text-[#555]
                mb-[30px]
                sm:mb-[35px]
                lg:mb-[40px]
              "
            >
              Якщо обліковий запис з адресою{' '}
              <span className="font-bold text-[#202020] break-all">
                {sentToEmail}
              </span>{' '}
              існує, ми надіслали на неї лист із посиланням для зміни пароля.
              Посилання діє 60 хвилин.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
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
              Повернутися до входу
            </button>

            <button
              type="button"
              onClick={() => setSentToEmail(null)}
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
              Не отримали лист? Надіслати ще раз
            </button>
          </div>
        ) : (
          <>
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

              {submitError && (
                <p className="w-full max-w-[600px] mb-[15px] text-[14px] text-red-500">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? 'Надсилання...' : 'Надіслати'}
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
          </>
        )}

      </div>
    </div>
  )
}
