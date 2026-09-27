import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { authService } from '../../../shared/api/authService'
import { ApiError } from '../../../shared/api/httpClient'
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from './PasswordResetSchema'

type TokenCheckResult = 'valid' | 'invalid' | 'error'

interface TokenCheck {
  token: string
  result: TokenCheckResult
}

const isInvalidTokenError = (error: unknown) =>
  error instanceof ApiError && error.status === 400

const titleClass = `
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
`

const primaryButtonClass = `
  w-full
  max-w-[600px]
  h-[50px]
  sm:h-[55px]
  lg:h-[60px]
  rounded-[5px]
  bg-primary
  text-white
  text-[16px]
  sm:text-[18px]
  lg:text-[20px]
  font-bold
  hover:bg-primary-dark
  transition-colors
  disabled:cursor-not-allowed
  disabled:opacity-60
`

const linkButtonClass = `
  mt-[15px]
  sm:mt-[18px]
  lg:mt-[20px]
  text-[16px]
  sm:text-[18px]
  lg:text-[20px]
  text-primary
  underline
  hover:text-primary-dark
`

const messageClass = `
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
`

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [tokenCheck, setTokenCheck] = useState<TokenCheck | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  })

  useEffect(() => {
    if (!token) {
      return
    }

    let isActive = true

    authService
      .validateResetToken(token)
      .then(() => {
        if (isActive) {
          setTokenCheck({ token, result: 'valid' })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setTokenCheck({
            token,
            result: isInvalidTokenError(error) ? 'invalid' : 'error',
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [token])

  const tokenStatus: TokenCheckResult | 'checking' = !token
    ? 'invalid'
    : tokenCheck?.token === token
      ? tokenCheck.result
      : 'checking'

  const onSubmit = async (data: ResetPasswordFormData) => {
    setSubmitError(null)

    try {
      await authService.resetPassword(token, data.password)
      navigate('/reset-password/success', { replace: true })
    } catch (error) {
      if (isInvalidTokenError(error)) {
        setTokenCheck({ token, result: 'invalid' })
        return
      }

      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'Не вдалося змінити пароль. Спробуйте ще раз.',
      )
    }
  }

  if (tokenStatus === 'checking') {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6">
        <div className="w-full max-w-[1440px] mx-auto">
          <h1 className={titleClass}>Забули пароль?</h1>
          <p className="text-center text-[16px] text-[#555]">
            Перевіряємо посилання...
          </p>
        </div>
      </div>
    )
  }

  if (tokenStatus !== 'valid') {
    const isInvalid = tokenStatus === 'invalid'

    return (
      <div className="w-full min-h-screen px-4 sm:px-6">
        <div className="w-full max-w-[1440px] mx-auto">
          <h1 className={titleClass}>
            {isInvalid ? 'Посилання недійсне' : 'Щось пішло не так'}
          </h1>

          <div className="w-full flex flex-col items-center">
            <p className={messageClass}>
              {isInvalid
                ? 'Посилання для зміни пароля недійсне або вже застаріло. Запросіть новий лист, щоб отримати свіже посилання.'
                : 'Не вдалося перевірити посилання. Перевірте з’єднання та спробуйте ще раз.'}
            </p>

            <button
              type="button"
              onClick={() =>
                isInvalid ? navigate('/forgot-password') : window.location.reload()
              }
              className={primaryButtonClass}
            >
              {isInvalid ? 'Надіслати новий лист' : 'Спробувати ще раз'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className={linkButtonClass}
            >
              Повернутися до входу
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6">
      <div className="w-full max-w-[1440px] mx-auto">

        <h1 className={titleClass}>Новий пароль</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >

          <div className="w-full max-w-[600px] mb-[20px]">

            <input
              type="password"
              placeholder="Пароль"
              autoComplete="new-password"
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
              autoComplete="new-password"
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

          {submitError && (
            <p className="w-full max-w-[600px] mb-[15px] text-[14px] text-red-500">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={primaryButtonClass}
          >
            {isSubmitting ? 'Збереження...' : 'Підтвердити'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className={linkButtonClass}
          >
            Скасувати
          </button>

        </form>

      </div>
    </div>
  )
}
