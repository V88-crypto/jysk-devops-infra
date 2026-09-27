import { useNavigate } from 'react-router-dom'

import { getProfile } from '../data/profileApi'
import { useAsyncData } from '../../../../shared/hooks/useAsyncData'
import { useAuth } from '../../../../shared/auth/useAuth'

export const ProfileInfo = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { data: profile, isLoading } = useAsyncData(getProfile)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-[100px]">
        Завантаження...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="w-full flex justify-center items-center py-[100px]">
        Не вдалося завантажити профіль
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6">

      <div className="w-full max-w-[1440px] mx-auto">

        <h1
          className="
            text-[28px]
            sm:text-[36px]
            lg:text-[48px]
            font-bold
            mb-[30px]
            sm:mb-[35px]
            lg:mb-[40px]
          "
        >
          Профіль
        </h1>

        <div
          className="
            w-full
            flex
            flex-col
            lg:flex-row
            gap-[15px]
            lg:gap-[20px]
          "
        >

          <div
            className="
              w-full
              lg:w-1/2
              min-h-[300px]
              lg:min-h-[400px]
              bg-white
              border
              border-[#e5e5e5]
              shadow-[0_2px_2px_rgba(0,0,0,0.2)]
              p-[30px]
              lg:p-[40px]
              flex
              flex-col
            "
          >

            <div className="flex items-center">

              <img
                src={profile.avatar}
                alt={profile.name}
                className="
                  w-[90px]
                  h-[90px]
                  lg:w-[100px]
                  lg:h-[100px]
                  rounded-full
                  object-cover
                "
              />

              <div className="ml-[25px]">

                <h2
                  className="
                    text-[18px]
                    lg:text-[22px]
                    font-bold
                  "
                >
                  {profile.name}
                </h2>

                <a
                  href="#"
                  className="
                    inline-block
                    mt-[5px]
                    text-[12px]
                    lg:text-[14px]
                    text-[#00a6b2]
                    underline
                    hover:text-[#008d96]
                  "
                >
                  Завантажити фото
                </a>

              </div>

            </div>

            <div
              className="
                mt-[30px]
                lg:mt-[35px]
                flex
                flex-col
                gap-[18px]
              "
            >

              <div
                className="
                  flex
                  justify-between
                  gap-[20px]
                  text-[14px]
                  lg:text-[16px]
                "
              >
                <span className="font-medium">
                  Електронна пошта
                </span>

                <span>
                  {profile.email}
                </span>
              </div>

              <div
                className="
                  flex
                  justify-between
                  gap-[20px]
                  text-[14px]
                  lg:text-[16px]
                "
              >
                <span className="font-medium">
                  Номер телефону
                </span>

                <span>
                  {profile.phone}
                </span>
              </div>

            </div>

            <div
              className="
                mt-auto
                pt-[30px]
                flex
                justify-center
                gap-[20px]
              "
            >

              <button
                type="button"
                onClick={() => navigate('/profile/edit')}
                className="
                  w-[150px]
                  h-[45px]
                  rounded-[5px]
                  bg-[#00adb5]
                  text-white
                  text-[14px]
                  lg:text-[16px]
                  font-bold
                  hover:bg-[#009da5]
                  transition-colors
                "
              >
                Редагувати
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-[150px]
                  h-[45px]
                  rounded-[5px]
                  bg-[#00adb5]
                  text-white
                  text-[14px]
                  lg:text-[16px]
                  font-bold
                  hover:bg-[#009da5]
                  transition-colors
                "
              >
                Вийти
              </button>

            </div>

          </div>

          <div
            className="
              w-full
              lg:w-1/2
              min-h-[300px]
              lg:min-h-[400px]
              bg-white
              border
              border-[#e5e5e5]
              shadow-[0_2px_2px_rgba(0,0,0,0.2)]
              p-[30px]
              lg:p-[40px]
              flex
              flex-col
              justify-center
            "
          >

            <div className="flex flex-col gap-[30px]">

                <a
                    href="#profile-orders"
                    className="
                    w-full
                    flex
                    items-center
                    justify-between
                    text-[16px]
                    lg:text-[18px]
                    font-bold
                    hover:text-[#00a6b2]
                    transition-colors
                    "
                >
                    <span>
                    Мої замовлення({profile.ordersCount})
                    </span>

                    <span className="text-[32px] lg:text-[38px] font-normal leading-none">
                    →
                    </span>
                </a>

                <a
                    href="#profile-orders"
                    className="
                    w-full
                    flex
                    items-center
                    justify-between
                    text-[16px]
                    lg:text-[18px]
                    font-bold
                    hover:text-[#00a6b2]
                    transition-colors
                    "
                >
                    <span>
                    Виконані замовлення({profile.completedOrdersCount})
                    </span>

                    <span className="text-[32px] lg:text-[38px] font-normal leading-none">
                    →
                    </span>
                </a>

                <a
                    href="#profile-reviews"
                    className="
                    w-full
                    flex
                    items-center
                    justify-between
                    text-[16px]
                    lg:text-[18px]
                    font-bold
                    hover:text-[#00a6b2]
                    transition-colors
                    "
                >
                    <span>
                    Мої відгуки({profile.reviewsCount})
                    </span>

                    <span className="text-[32px] lg:text-[38px] font-normal leading-none">
                    →
                    </span>
                </a>

                <a
                    href="#profile-favorites"
                    className="
                    w-full
                    flex
                    items-center
                    justify-between
                    text-[16px]
                    lg:text-[18px]
                    font-bold
                    hover:text-[#00a6b2]
                    transition-colors
                    "
                >
                    <span>
                    Обране({profile.favoritesCount})
                    </span>

                    <span className="text-[32px] lg:text-[38px] font-normal leading-none">
                    →
                    </span>
                </a>

                </div>
          </div>

        </div>

      </div>

    </div>
  )
}
