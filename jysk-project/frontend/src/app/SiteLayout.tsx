import { Outlet } from 'react-router-dom'

import { Header } from '@/shared/ui/Header/Header'
import { Footer } from '@/shared/ui/Footer/Footer'
import { ScrollManager } from './ScrollManager'
import { useAuth } from '@/shared/auth/useAuth'
import { useCartStore } from '@/store/useCartStore'
import { useEffect } from 'react'

export const SiteLayout = () => {
  const { isAuthenticated } = useAuth()
  const loadCart = useCartStore((state) => state.loadCart)
  const clearCart = useCartStore((state) => state.clear)

  useEffect(() => {
    if (isAuthenticated) {
      void loadCart()
    } else {
      clearCart()
    }
  }, [clearCart, isAuthenticated, loadCart])

  return (
    <>
      <ScrollManager />
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}