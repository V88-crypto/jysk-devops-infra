import { AboutSection } from "../features/components/homePage/components/AboutSection"
import { BlogSection } from "../features/components/homePage/components/BlogSection"
import { BrandsSection } from "../features/components/homePage/components/BrandsSection"
import { CategoryGroup } from "../features/components/homePage/components/CategoryGroup"
import { LoginPage } from "../features/components/loginPage/LoginPage"
import { EditProfileForm } from "../features/components/profilePage/components/EditProfile"
import { Favorites } from "../features/components/profilePage/components/Favourites"
import { OrderList } from "../features/components/profilePage/components/OrderItem"
import { ProfileInfo } from "../features/components/profilePage/components/ProfileInfo"
import { Reviews } from "../features/components/profilePage/components/Reviews"
import { ConfirmEmailPage } from "../features/components/registerPage/ConfirmEmailPage"
import { RegisterPage } from "../features/components/registerPage/RegisterPage"
import { ForgotPasswordPage } from "../features/components/resetPasswordPage/ForgotPasswordPage"
import { ResetPasswordPage } from "../features/components/resetPasswordPage/ResetPasswordPage"


function App() {
  return (
    <main>
      <CategoryGroup></CategoryGroup>
      <AboutSection></AboutSection>
      <BrandsSection></BrandsSection>
      <BlogSection></BlogSection>

      <ProfileInfo></ProfileInfo>
      <EditProfileForm></EditProfileForm>
      <Favorites></Favorites>
      <OrderList></OrderList>
      <Reviews></Reviews>

      <LoginPage></LoginPage>
      <RegisterPage></RegisterPage>
      <ConfirmEmailPage></ConfirmEmailPage>
      <ResetPasswordPage></ResetPasswordPage>
      <ForgotPasswordPage></ForgotPasswordPage>
    </main>
  )
}

export default App
