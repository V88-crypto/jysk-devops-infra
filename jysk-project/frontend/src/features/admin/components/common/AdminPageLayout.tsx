import type { ReactNode } from 'react'

interface AdminPageLayoutProps {
  children: ReactNode
}

export const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return (
    <main className="min-h-screen bg-page px-4 py-6 pt-20 text-fg sm:px-6 md:ml-[220px] md:px-10 md:pt-8 lg:px-12">
      {children}
    </main>
  )
}
