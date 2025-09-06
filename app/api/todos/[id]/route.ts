import { NextResponse } from 'next/server'
import { updateTodo } from '../store'

export const dynamic = 'force-dynamic'

export async function PATCH(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = Number(ctx.params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

    const body = await _req.json().catch(() => ({})) as { title?: string; due?: string; canAiHandle?: boolean; done?: boolean }
    const updated = updateTodo(id, body)
    if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
}
