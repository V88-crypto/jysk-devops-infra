import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import {
  confirmAccountSchema,
  type ConfirmAccountFormData,
} from './registerSchema'

export const ConfirmEmailPage = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmAccountFormData>({
    resolver: zodResolver(confirmAccountSchema),
    mode: 'onBlur',
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = (data: ConfirmAccountFormData) => {
    console.log(data)

    // Бекенд реєструє й одразу логінить без підтвердження email — це окрема сторінка за макетом
    navigate('/register/success')
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
            mb-[30px]
            sm:mb-[35px]
            lg:mb-[40px]
            border-t
            border-b
            border-[#cfcfcf]
          "
        >
          Підтвердження облікового запису
        </h1>

        <p
          className="
            w-full
            max-w-[600px]
            mx-auto
            text-center
            text-[14px]
            sm:text-[16px]
            lg:text-[18px]
            leading-[18px]
            sm:leading-[20px]
            lg:leading-[22px]
            text-[#555]
            mb-[35px]
            sm:mb-[40px]
            lg:mb-[45px]
          "
        >
          Ми відправили на вказану вами електронну адресу лист з кодом для
          <br className="hidden sm:block" />
          підтвердження облікового запису.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >

          <div className="w-full max-w-[600px] mb-[30px] sm:mb-[35px] lg:mb-[40px]">

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Введіть код"
              {...register('code')}
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
                  errors.code
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#c5c5c5] focus:border-[#aaa]'
                }
              `}
            />

            {errors.code && (
              <p className="mt-1 text-[13px] text-red-500">
                {errors.code.message}
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
            onClick={() => navigate('/register')}
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