import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = Number(ctx.params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 })
    const { prisma } = await import('@/lib/prisma')
    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(todo, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
}

export async function PATCH(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = Number(ctx.params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

    const body = await _req.json().catch(() => ({})) as { title?: string; due?: string; canAiHandle?: boolean; done?: boolean }
    const { prisma } = await import('@/lib/prisma')
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        title: body.title,
        due: body.due,
        canAiHandle: body.canAiHandle,
        done: body.done,
      },
    }).catch(() => null)
    if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = Number(ctx.params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid id' }, { status: 400 })
    const { prisma } = await import('@/lib/prisma')
    const deleted = await prisma.todo.delete({ where: { id } }).catch(() => null)
    if (!deleted) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
}
