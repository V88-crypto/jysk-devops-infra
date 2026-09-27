import { Outlet } from 'react-router-dom'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
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
