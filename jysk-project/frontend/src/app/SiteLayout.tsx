import { Outlet } from 'react-router-dom'

import Header from '@/shared/ui/Header/Header'
import Footer from '@/shared/ui/Footer/Footer'
import { ScrollManager } from './ScrollManager'

export const SiteLayout = () => {
  return (
    <>
      <ScrollManager />
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
