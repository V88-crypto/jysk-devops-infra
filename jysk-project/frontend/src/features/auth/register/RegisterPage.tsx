import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { authService } from '@/shared/api/authService'
import { ApiError } from '@/shared/api/httpClient'
import { useAuth } from '@/shared/auth/useAuth'

import { RegisterSchema, type RegisterFormData } from './registerSchema'

const splitFullName = (
  fullName: string,
): { firstName: string; lastName: string } => {
  const [firstName, ...rest] = fullName.trim().split(/\s+/)
  const lastName = rest.join(' ')

  return { firstName, lastName: lastName || firstName }
}

export const RegisterPage = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),

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

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null)

    const { firstName, lastName } = splitFullName(data.name)

    try {
      await authService.register({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      })

      auth.login()
      navigate('/')
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'Не вдалося створити обліковий запис. Спробуйте ще раз.',
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
            mt-[10px]
            mb-[25px]
            sm:mb-[30px]
            lg:mb-[40px]
            border-t
            border-b
            border-line-strong
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
                bg-surface-strong
                border
                rounded-[5px]
                outline-none
                ${
                  errors.email
                    ? 'border-danger'
                    : 'border-line-strong focus:border-line-strong'
                }
              `}
            />

            {errors.email && (
              <p className="mt-1 text-[13px] text-danger">
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
                bg-surface-strong
                border
                rounded-[5px]
                outline-none
                ${
                  errors.password
                    ? 'border-danger'
                    : 'border-line-strong focus:border-line-strong'
                }
              `}
            />

            {errors.password && (
              <p className="mt-1 text-[13px] text-danger">
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
                bg-surface-strong
                border
                rounded-[5px]
                outline-none
                ${
                  errors.repeatPassword
                    ? 'border-danger'
                    : 'border-line-strong focus:border-line-strong'
                }
              `}
            />

            {errors.repeatPassword && (
              <p className="mt-1 text-[13px] text-danger">
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
                bg-surface-strong
                border
                rounded-[5px]
                outline-none
                ${
                  errors.name
                    ? 'border-danger'
                    : 'border-line-strong focus:border-line-strong'
                }
              `}
            />

            {errors.name && (
              <p className="mt-1 text-[13px] text-danger">
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
                  text-fg-muted
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
                  <a href="#" className="text-primary hover:underline">
                    Умови та Положення
                  </a>
                </span>
              </label>

              {errors.acceptedTerms && (
                <p className="mt-1 text-[13px] text-danger">
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
                text-fg-muted
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

              <span>Знайти минулі замовлення для цього облікового запису</span>
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
                text-fg-muted
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
                <a href="#" className="text-primary hover:underline">
                  Переглянути
                </a>
              </span>
            </label>
          </div>

          {submitError && (
            <p className="w-full max-w-[600px] mb-[15px] text-[14px] text-danger">
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
            "
          >
            {isSubmitting ? 'Створення...' : 'Створити обліковий запис'}
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
              text-primary
              underline
              hover:text-primary-dark
            "
          >
            Скасувати
          </button>
        </form>
      </div>
    </div>
  )
}
