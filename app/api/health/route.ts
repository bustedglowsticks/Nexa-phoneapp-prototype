import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const status: { ok: boolean; db?: string; error?: string } = { ok: true }
  try {
    if (process.env.DATABASE_URL) {
      const { getPrisma } = await import('@/lib/prisma')
      const prisma = getPrisma()
      await prisma.$queryRaw`SELECT 1`
      status.db = 'up'
    } else {
      status.db = 'missing DATABASE_URL'
    }
  } catch (e: any) {
    status.db = 'error'
    status.error = e?.message || 'unknown'
  }
  return NextResponse.json(status, { status: status.db === 'error' ? 500 : 200 })
}
