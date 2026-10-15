import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { authService } from '@/shared/api/authService'
import { ApiError } from '@/shared/api/httpClient'
import { useAuth } from '@/shared/auth/useAuth'

import { loginSchema, type LoginFormData } from './loginSchema'

export const LoginPage = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null)

    try {
      await authService.login(data)
      auth.login()
      navigate('/')
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'Не вдалося увійти. Спробуйте ще раз.',
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
            mb-[20px]
            sm:mb-[25px]
            lg:mb-[30px]
            border-t
            border-b
            border-line-strong
          "
        >
          Вхід
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          <div
            className="
              w-full
              max-w-[600px]
              mb-[15px]
              sm:mb-[18px]
              lg:mb-[20px]
            "
          >
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
                    ? 'border-danger focus:border-danger'
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

          <div
            className="
              w-full
              max-w-[600px]
              mb-[20px]
              sm:mb-[22px]
              lg:mb-[25px]
            "
          >
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
                    ? 'border-danger focus:border-danger'
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
            {isSubmitting ? 'Вхід...' : 'Увійти'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="
              w-full
              max-w-[600px]
              mt-[15px]
              sm:mt-[18px]
              lg:mt-[20px]
              text-left
              text-[16px]
              sm:text-[18px]
              lg:text-[20px]
              text-primary
              underline
              hover:text-primary-dark
            "
          >
            Забули пароль?
          </button>
        </form>

        <section
          className="
            w-full
            max-w-[600px]
            mx-auto
            mt-[50px]
            sm:mt-[60px]
            lg:mt-[70px]
          "
        >
          <h2
            className="
              text-center
              font-bold
              text-[18px]
              sm:text-[20px]
              lg:text-[22px]
              mb-[25px]
            "
          >
            Створити новий обліковий запис
          </h2>

          <ul
            className="
              list-disc
              pl-[25px]
              text-[14px]
              sm:text-[16px]
              lg:text-[18px]
              leading-[24px]
              sm:leading-[28px]
              lg:leading-[30px]
              text-fg-muted
            "
          >
            <li>Відстежуйте ваші посилки від замовлення до доставки</li>

            <li>Зберігайте історію замовлень</li>

            <li>Додавайте товари до списку бажань</li>

            <li>Зберігайте інформацію для майбутніх покупок</li>
          </ul>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="
              w-full
              h-[50px]
              sm:h-[55px]
              lg:h-[60px]
              mt-[45px]
              sm:mt-[50px]
              lg:mt-[55px]
              rounded-[5px]
              bg-surface-strong
              border
              border-line-strong
              text-fg-muted
              text-[16px]
              sm:text-[18px]
              lg:text-[20px]
              hover:bg-surface-strong
              transition-colors
            "
          >
            Створити новий обліковий запис
          </button>
        </section>
      </div>
    </div>
  )
}
