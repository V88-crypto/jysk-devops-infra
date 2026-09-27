import { AboutSection } from '@/features/components/homePage/components/AboutSection'
import { BlogSection } from '@/features/components/homePage/components/BlogSection'
import { BrandsSection } from '@/features/components/homePage/components/BrandsSection'
import { CategoryGroup } from '@/features/components/homePage/components/CategoryGroup'
import Prefooter from '@/components/Prefooter/Prefooter'

export const MainPage = () => {
  return (
    <>
      <CategoryGroup />
      <AboutSection />
      <BrandsSection />
      <BlogSection />
      <Prefooter />
    </>
  )
}
