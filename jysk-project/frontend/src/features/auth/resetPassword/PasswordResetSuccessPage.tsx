import { useNavigate } from 'react-router-dom'

export const PasswordResetSuccessPage = () => {
  const navigate = useNavigate()

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
          Пароль успішно змінено
        </h1>

        <div className="w-full flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="
              text-[16px]
              sm:text-[18px]
              lg:text-[20px]
              text-primary
              underline
              hover:text-primary-dark
              transition-colors
            "
          >
            Перейти до входу
          </button>
        </div>
      </div>
    </div>
  )
}
