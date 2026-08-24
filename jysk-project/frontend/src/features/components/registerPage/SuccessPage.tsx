export const SuccessPage = () => {
  return (
    <div className="w-full min-h-screen px-4 sm:px-6">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center">

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
          Обліковий запис успішно створено!
        </h1>

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
          Перейти в профіль
        </a>

      </div>
    </div>
  )
}