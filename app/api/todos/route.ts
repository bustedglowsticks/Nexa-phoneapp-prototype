import { NextResponse } from 'next/server'
import { getTodos, addTodo } from './store'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Return all todos (client filters human-required as needed)
  return NextResponse.json(getTodos(), { status: 200 })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { title?: string; due?: string; canAiHandle?: boolean }
    const title = (body.title || '').trim()
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

    const created = addTodo({ title, due: body.due, canAiHandle: body.canAiHandle })
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
