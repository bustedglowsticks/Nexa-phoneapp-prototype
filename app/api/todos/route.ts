import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Return all todos (client filters human-required as needed)
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured' }, { status: 503 })
  }
  const { getPrisma } = await import('@/lib/prisma')
  const prisma = getPrisma()
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(todos, { status: 200 })
}

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL is not configured' }, { status: 503 })
    }
    const { getPrisma } = await import('@/lib/prisma')
    const prisma = getPrisma()
    const body = await req.json().catch(() => ({})) as { title?: string; due?: string; canAiHandle?: boolean }
    const title = (body.title || '').trim()
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

    const created = await prisma.todo.create({
      data: {
        title,
        due: body.due,
        canAiHandle: body.canAiHandle ?? false,
        done: false,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
