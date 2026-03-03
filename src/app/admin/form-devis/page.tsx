import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { FormFieldsManager } from '@/components/admin/FormFieldsManager'

export const metadata = {
  title: 'Formulaire devis - Administration',
  description: 'Personnaliser les champs du formulaire Demander un devis',
}

export default async function AdminFormDevisPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--grey)]">Formulaire devis</h1>
        <p className="text-gray-600 mt-1">Personnalisez les champs du formulaire &quot;Demander un devis&quot;</p>
      </div>
      <FormFieldsManager />
    </div>
  )
}
