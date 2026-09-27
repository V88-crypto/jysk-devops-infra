import { AboutSection } from './components/AboutSection'
import { BlogSection } from './components/BlogSection'
import { BrandsSection } from './components/BrandsSection'
import { CategoryGroup } from './components/CategoryGroup'
import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'

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
