import { mkdir, readdir, readFile, writeFile, stat } from 'fs/promises'
import { dirname, join } from 'path'
import { strToU8, unzipSync, zipSync } from 'fflate'
import { Prisma } from '@prisma/client'
import type { Category } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const SITE_BACKUP_VERSION = 1

export type SiteDatabaseSnapshot = {
  version: number
  exportedAt: string
  categories: Category[]
  products: Prisma.ProductGetPayload<Record<string, never>>[]
  blogPosts: Prisma.BlogPostGetPayload<Record<string, never>>[]
  services: Prisma.ServiceGetPayload<Record<string, never>>[]
  rentalRequests: Prisma.RentalRequestGetPayload<Record<string, never>>[]
  devisFormFields: Prisma.DevisFormFieldGetPayload<Record<string, never>>[]
  quoteRequests: Prisma.QuoteRequestGetPayload<Record<string, never>>[]
  megaMenuPanels: Prisma.MegaMenuPanelGetPayload<Record<string, never>>[]
}

const UPLOADS_PUBLIC_PREFIX = '/uploads/'

function parseImagePaths(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split('|')
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.startsWith(UPLOADS_PUBLIC_PREFIX) && !p.includes('..') && p.length < 512
    )
    .map((p) => p.slice(UPLOADS_PUBLIC_PREFIX.length).replace(/\\/g, '/'))
}

/**
 * List relative paths (under public/uploads) referenced in DB for local /uploads/ URLs.
 */
export function collectLocalUploadPathsFromSnapshot(db: SiteDatabaseSnapshot): Set<string> {
  const out = new Set<string>()
  for (const c of db.categories) {
    for (const p of parseImagePaths(c.image)) out.add(p)
  }
  for (const p of db.products) {
    for (const u of parseImagePaths(p.image)) out.add(u)
  }
  for (const b of db.blogPosts) {
    for (const u of parseImagePaths(b.image)) out.add(u)
  }
  for (const s of db.services) {
    for (const u of parseImagePaths(s.image)) out.add(u)
  }
  for (const m of db.megaMenuPanels) {
    for (const u of parseImagePaths(m.imageSrc)) out.add(u)
  }
  return out
}

export async function buildDatabaseSnapshot(): Promise<SiteDatabaseSnapshot> {
  const [
    categories,
    products,
    blogPosts,
    services,
    rentalRequests,
    devisFormFields,
    quoteRequests,
    megaMenuPanels,
  ] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany(),
    prisma.blogPost.findMany(),
    prisma.service.findMany(),
    prisma.rentalRequest.findMany(),
    prisma.devisFormField.findMany(),
    prisma.quoteRequest.findMany(),
    prisma.megaMenuPanel.findMany(),
  ])

  return {
    version: SITE_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    categories,
    products,
    blogPosts,
    services,
    rentalRequests,
    devisFormFields,
    quoteRequests,
    megaMenuPanels,
  }
}

async function listFilesRecursive(
  absDir: string,
  relBase: string
): Promise<{ rel: string; abs: string }[]> {
  const out: { rel: string; abs: string }[] = []
  let dirEntries
  try {
    dirEntries = await readdir(absDir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of dirEntries as { name: string; isDirectory(): boolean; isFile(): boolean }[]) {
    const name = typeof e.name === 'string' ? e.name : String(e.name)
    if (name.startsWith('.')) continue
    const abs = join(absDir, name)
    const rel = relBase ? `${relBase}/${name}` : name
    if (e.isDirectory()) {
      out.push(...(await listFilesRecursive(abs, rel)))
    } else if (e.isFile()) {
      out.push({ rel, abs })
    }
  }
  return out
}

export async function listPublicUploadFiles(): Promise<{ rel: string; abs: string }[]> {
  const root = join(process.cwd(), 'public', 'uploads')
  return listFilesRecursive(root, '')
}

function sortCategoriesForImport(cats: Category[]): Category[] {
  const byId = new Map(cats.map((c) => [c.id, c]))
  const result: Category[] = []
  const done = new Set<string>()
  const remaining = new Set(cats.map((c) => c.id))
  let safety = 0
  while (remaining.size > 0 && safety++ < cats.length * 2 + 5) {
    const before = remaining.size
    for (const c of cats) {
      if (done.has(c.id)) continue
      if (!c.parentId) {
        result.push(c)
        done.add(c.id)
        remaining.delete(c.id)
        continue
      }
      if (!byId.has(c.parentId)) {
        result.push({ ...c, parentId: null } as Category)
        done.add(c.id)
        remaining.delete(c.id)
        continue
      }
      if (done.has(c.parentId)) {
        result.push(c)
        done.add(c.id)
        remaining.delete(c.id)
      }
    }
    if (remaining.size === before) {
      for (const id of remaining) {
        const c = byId.get(id)!
        result.push({ ...c, parentId: null } as Category)
        done.add(id)
        remaining.delete(id)
      }
      break
    }
  }
  return result
}

/** Clears all app data and imports snapshot. Use only after auth checks. */
export async function replaceDatabaseFromSnapshot(
  data: SiteDatabaseSnapshot
): Promise<void> {
  if (data.version !== SITE_BACKUP_VERSION) {
    throw new Error(`Version de sauvegarde non supportée: ${data.version}`)
  }
  const categoryOrder = sortCategoriesForImport(data.categories)
  const productRows = data.products
  const blogRows = data.blogPosts
  const serviceRows = data.services
  const rentalRows = data.rentalRequests
  const devisRows = data.devisFormFields
  const quoteRows = data.quoteRequests
  const megaRows = data.megaMenuPanels

  await prisma.$transaction(
    async (tx) => {
      await tx.product.deleteMany()
      await tx.$executeRawUnsafe(`UPDATE "Category" SET "parentId" = NULL`)
      await tx.category.deleteMany()
      await tx.blogPost.deleteMany()
      await tx.service.deleteMany()
      await tx.rentalRequest.deleteMany()
      await tx.devisFormField.deleteMany()
      await tx.quoteRequest.deleteMany()
      await tx.megaMenuPanel.deleteMany()

      for (const c of categoryOrder) {
        await tx.category.create({ data: c })
      }
      if (productRows.length) {
        await tx.product.createMany({ data: productRows })
      }
      if (blogRows.length) {
        await tx.blogPost.createMany({ data: blogRows })
      }
      if (serviceRows.length) {
        await tx.service.createMany({ data: serviceRows })
      }
      if (rentalRows.length) {
        await tx.rentalRequest.createMany({ data: rentalRows })
      }
      if (devisRows.length) {
        await tx.devisFormField.createMany({
          data: devisRows.map((d) => ({
            ...d,
            options:
              d.options == null
                ? Prisma.JsonNull
                : (d.options as Prisma.InputJsonValue),
          })),
        })
      }
      if (quoteRows.length) {
        await tx.quoteRequest.createMany({
          data: quoteRows.map((d) => ({
            ...d,
            customData:
              d.customData == null
                ? Prisma.JsonNull
                : (d.customData as Prisma.InputJsonValue),
          })),
        })
      }
      if (megaRows.length) {
        await tx.megaMenuPanel.createMany({ data: megaRows })
      }
    },
    { maxWait: 30_000, timeout: 120_000 }
  )
}

const FILES_PREFIX = 'files/uploads/'

function safeRelUploadPath(name: string): string | null {
  const n = name.replace(/\\/g, '/').replace(/^\/+/, '')
  if (n.startsWith('..') || n.includes('/..') || n.includes('//')) {
    return null
  }
  if (!/^[a-zA-Z0-9._/\-]+$/.test(n) || n.length > 500) {
    return null
  }
  return n
}

export async function writeExtractedUploadFiles(
  files: Record<string, Uint8Array>
): Promise<{ written: number; errors: string[] }> {
  const uploadRoot = join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadRoot, { recursive: true })
  const errors: string[] = []
  let written = 0
  for (const [pathInZip, content] of Object.entries(files)) {
    if (!pathInZip.startsWith(FILES_PREFIX)) continue
    const rel = pathInZip.slice(FILES_PREFIX.length)
    const safe = safeRelUploadPath(rel)
    if (!safe) {
      errors.push(`Rejet: ${pathInZip}`)
      continue
    }
    const full = join(uploadRoot, safe)
    const fullNorm = full.replace(/\\/g, '/')
    const rootNorm = uploadRoot.replace(/\\/g, '/')
    if (!fullNorm.startsWith(rootNorm) || fullNorm === rootNorm) {
      errors.push(`Chemin invalide: ${pathInZip}`)
      continue
    }
    try {
      await mkdir(dirname(full), { recursive: true })
      await writeFile(full, content.length ? content : new Uint8Array(0))
    } catch (e) {
      errors.push(`Écriture: ${pathInZip} — ${e instanceof Error ? e.message : String(e)}`)
      continue
    }
    written++
  }
  return { written, errors }
}

function parseJsonSnapshot(raw: string): SiteDatabaseSnapshot {
  const parsed = JSON.parse(raw) as unknown
  if (typeof parsed !== 'object' || !parsed) {
    throw new Error('Fichier database.json invalide')
  }
  return parsed as SiteDatabaseSnapshot
}

/**
 * Unzip buffer and return database snapshot + fflate file map (for local uploads only).
 */
export function parseBackupZip(buffer: ArrayBuffer | Uint8Array): {
  database: SiteDatabaseSnapshot
  files: Record<string, Uint8Array>
} {
  const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let unzipped: Record<string, Uint8Array>
  try {
    unzipped = unzipSync(u8)
  } catch (e) {
    throw new Error(
      e instanceof Error ? `Archive ZIP illisible: ${e.message}` : 'Archive ZIP illisible'
    )
  }
  const names = Object.keys(unzipped)
  const dbKey = names.find(
    (k) => k === 'database.json' || k.endsWith('/database.json')
  )
  if (!dbKey) {
    throw new Error('archive invalide: database.json manquant')
  }
  const raw = new TextDecoder('utf-8').decode(unzipped[dbKey]!)
  const database = parseJsonSnapshot(raw)
  if (database.version !== SITE_BACKUP_VERSION) {
    throw new Error(`version database.json: attendu ${SITE_BACKUP_VERSION}, reçu ${database.version}`)
  }
  return { database, files: unzipped }
}

export function buildSiteBackupZip(
  database: SiteDatabaseSnapshot,
  uploadEntries: { zipPath: string; content: Uint8Array }[]
): Uint8Array {
  const manifest = {
    version: SITE_BACKUP_VERSION,
    app: 'logistec',
    exportedAt: database.exportedAt,
  }
  const out: Record<string, Uint8Array> = {
    'manifest.json': strToU8(JSON.stringify(manifest, null, 2)),
    'database.json': strToU8(JSON.stringify(database, null, 0)),
  }
  for (const { zipPath, content } of uploadEntries) {
    if (zipPath.startsWith(FILES_PREFIX) && !zipPath.includes('..')) {
      out[zipPath] = content
    }
  }
  return zipSync(out, { level: 6 })
}

export async function buildFullBackupBytes(): Promise<Uint8Array> {
  const database = await buildDatabaseSnapshot()
  const fromDb = collectLocalUploadPathsFromSnapshot(database)
  const onDisk = await listPublicUploadFiles()
  const rels = new Set<string>([...fromDb])
  for (const { rel } of onDisk) {
    rels.add(rel.replace(/\\/g, '/'))
  }
  const uploadRoot = join(process.cwd(), 'public', 'uploads')
  const uploadEntries: { zipPath: string; content: Uint8Array }[] = []
  for (const rel of rels) {
    const s = safeRelUploadPath(rel)
    if (!s) continue
    const abs = join(uploadRoot, s)
    try {
      const st = await stat(abs)
      if (!st.isFile()) continue
    } catch {
      continue
    }
    const buf = await readFile(abs)
    uploadEntries.push({
      zipPath: `${FILES_PREFIX}${s.replace(/^\//, '')}`,
      content: new Uint8Array(buf),
    })
  }
  return buildSiteBackupZip(database, uploadEntries)
}

