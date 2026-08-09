import { AboutSection } from '../features/homePage/components/AboutSection'
import { BlogSection } from '../features/homePage/components/BlogSection'
import { BrandsSection } from '../features/homePage/components/BrandsSection'
import { CategoryGroup } from '../features/homePage/components/CategoryGroup'

function App() {
  return (
    <main>
      <AboutSection />
      <CategoryGroup />
      <BrandsSection />
      <BlogSection />
    </main>
  )
}

export default App
