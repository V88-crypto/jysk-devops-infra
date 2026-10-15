import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '@/shared/auth/AuthProvider'
import { SiteLayout } from './SiteLayout'
import { RequireAuth } from './RequireAuth'
import { RequireAdmin } from './RequireAdmin'
import { MainPage } from '@/features/home/MainPage'
import { BlogListPage } from '@/features/blog/BlogListPage'
import { BlogPostDetailPage } from '@/features/blog/BlogPostDetailPage'
import { LoginPage } from '@/features/auth/login/LoginPage'
import { RegisterPage } from '@/features/auth/register/RegisterPage'
import { ConfirmEmailPage } from '@/features/auth/register/ConfirmEmailPage'
import { SuccessPage } from '@/features/auth/register/SuccessPage'
import { ForgotPasswordPage } from '@/features/auth/resetPassword/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/resetPassword/ResetPasswordPage'
import { PasswordResetSuccessPage } from '@/features/auth/resetPassword/PasswordResetSuccessPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { EditProfileForm } from '@/features/profile/components/EditProfileForm'
import { VacanciesPage } from '@/features/vacancies/VacanciesPage'
import { NotFoundPage } from '@/features/notFound/NotFoundPage'
import { AdminLayout } from '@/features/admin/AdminLayout'
import { StorePage } from '@/features/store/StorePage'
import { FaqPage } from '@/features/faq/FaqPage'
import { CategoriesPage } from '@/features/catalog/CategoriesPage'
import { CategoryPage } from '@/features/catalog/CategoryPage'
import { ProductPage } from '@/features/catalog/ProductPage'
import { SearchPage } from '@/features/catalog/SearchPage'

export function App() {
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
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="search" element={<SearchPage />} />

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
