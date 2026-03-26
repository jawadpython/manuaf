import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

/**
 * Single PrismaClient per server isolate (dev + Vercel serverless).
 * Without caching in production, each invocation can open a new pool → connection errors / 500s.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

globalForPrisma.prisma = prisma
