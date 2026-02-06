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
    <div className="p-8">
      <h1 className="font-display text-3xl text-white mb-2">Services</h1>
      <p className="text-white/60 mb-8">
        Gérer les services (maintenance, reconditionnement, location)
      </p>
      <ServicesManager initialServices={services} />
    </div>
  )
}
