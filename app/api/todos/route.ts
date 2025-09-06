import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Return all todos (client filters human-required as needed)
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(todos, { status: 200 })
}

export async function POST(req: Request) {
  try {
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
