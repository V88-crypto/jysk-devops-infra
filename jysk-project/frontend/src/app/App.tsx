import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AuthProvider } from "@/shared/auth/AuthProvider"
import { SiteLayout } from "./SiteLayout"
import { RequireAuth } from "./RequireAuth"
import { RequireAdmin } from "./RequireAdmin"
import { MainPage } from "@/features/mainPage/MainPage"
import { BlogListPage } from "@/features/blogPage/BlogListPage"
import { BlogPostDetailPage } from "@/features/blogPage/BlogPostDetailPage"
import { LoginPage } from "@/features/components/loginPage/LoginPage"
import { RegisterPage } from "@/features/components/registerPage/RegisterPage"
import { ConfirmEmailPage } from "@/features/components/registerPage/ConfirmEmailPage"
import { SuccessPage } from "@/features/components/registerPage/SuccessPage"
import { ForgotPasswordPage } from "@/features/components/resetPasswordPage/ForgotPasswordPage"
import { ResetPasswordPage } from "@/features/components/resetPasswordPage/ResetPasswordPage"
import { PasswordResetSuccessPage } from "@/features/components/resetPasswordPage/PasswordResetSuccessPage"
import { ProfilePage } from "@/features/components/profilePage/ProfilePage"
import { EditProfileForm } from "@/features/components/profilePage/components/EditProfile"
import VacanciesPage from "@/features/vacanciesPage/VacanciesPage"
import NotFoundPage from "@/features/notFoundPage/NotFoundPage"
import { AdminLayout } from "@/features/components/adminPanel/AdminLayout"
import StorePage from "@/features/storePage/StorePage"
import FaqPage from "@/features/faqPage/FaqPage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          />

          <Route element={<SiteLayout />}>
            <Route index element={<MainPage />} />
            <Route path="vacancies" element={<VacanciesPage />} />
            
            <Route path="store" element={<StorePage />} />
            <Route path="faq" element={<FaqPage />} />

            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:postId" element={<BlogPostDetailPage />} />

            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="register/confirm" element={<ConfirmEmailPage />} />
            <Route path="register/success" element={<SuccessPage />} />

            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route
              path="reset-password/success"
              element={<PasswordResetSuccessPage />}
            />

            <Route
              path="profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="profile/edit"
              element={
                <RequireAuth>
                  <EditProfileForm />
                </RequireAuth>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App