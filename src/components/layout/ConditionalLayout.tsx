'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { RightUtilityBar } from './RightUtilityBar'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <Header />
      <RightUtilityBar />
      <main id="main-content" className="pt-[var(--header-height)] min-h-[50vh]" role="main">
        {children}
      </main>
      <Footer />
    </>
  )
}
