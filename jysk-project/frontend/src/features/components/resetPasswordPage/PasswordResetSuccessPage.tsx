export const PasswordResetSuccessPage = () => {
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
            border-[#cfcfcf]
          "
        >
          Пароль успішно змінено
        </h1>

        <div className="w-full flex justify-center">

          <a
            href="#"
            className="
              text-[16px]
              sm:text-[18px]
              lg:text-[20px]
              text-[#00a6b2]
              underline
              hover:text-[#008d96]
              transition-colors
            "
          >
            Перейти до входу
          </a>

        </div>

      </div>
    </div>
  )
}