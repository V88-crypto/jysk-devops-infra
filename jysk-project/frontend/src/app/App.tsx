import { ForgotPasswordPage } from "../features/resetPasswordPage/ForgotPasswordPage"
import { PasswordResetSuccessPage } from "../features/resetPasswordPage/PasswordResetSuccessPage"
import { ResetPasswordPage } from "../features/resetPasswordPage/ResetPasswordPage"

function App() {
  return (
    <main>
      <ResetPasswordPage></ResetPasswordPage>
      <PasswordResetSuccessPage></PasswordResetSuccessPage>
      <ForgotPasswordPage></ForgotPasswordPage>
    </main>
  )
}

export default App
