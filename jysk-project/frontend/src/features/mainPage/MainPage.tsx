import { AboutSection } from '../components/homePage/components/AboutSection'
import { BlogSection } from '../components/homePage/components/BlogSection'
import { BrandsSection } from '../components/homePage/components/BrandsSection'
import { CategoryGroup } from '../components/homePage/components/CategoryGroup'
import Prefooter from '../../components/Prefooter/Prefooter'

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
