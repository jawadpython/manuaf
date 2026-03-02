import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ServicesManager } from '@/components/admin/ServicesManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - Administration',
}

export default async function AdminServicesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const services = await prisma.service.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-[var(--foreground)] tracking-tight">
          Services
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les services (maintenance, reconditionnement, location)
        </p>
      </header>
      <ServicesManager initialServices={services} />
    </>
  )
}
