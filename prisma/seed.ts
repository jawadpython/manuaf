/**
 * Optional: npx prisma db seed
 * Crée la catégorie « Chariots de location » et les 6 fiches par défaut si absentes.
 */
import { prisma } from '../src/lib/prisma'
import { ensureMissingChariotsLocationProducts } from '../src/lib/ensureChariotsLocationProducts'

async function main() {
  const n = await ensureMissingChariotsLocationProducts()
  console.log(`Chariots location: ${n} fiche(s) créée(s).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
