import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Minimal API route: accepts JSON { description: string }
// Returns a mock engineered design with a materials list.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as { description?: string }
    const desc = (body.description || '').trim()

    // Lightweight mock of design generation logic
    const baseMaterials = [
      '1x Pole, Wood Class 2, 45 ft',
      '3x Insulators, Polymer',
      '120 ft #2 ACSR Conductor',
      '1x Grounding Kit',
      'Hardware set (bolts, braces, lugs)'
    ]

    const extras: string[] = []
    if (/transformer/i.test(desc)) extras.push('1x 25 kVA Pole-mount Transformer')
    if (/splice|repair/i.test(desc)) extras.push('1x Splice kit (#2 ACSR)')
    if (/crossarm/i.test(desc)) extras.push('1x Crossarm Kit')

    const response = {
      title: 'Engineered Design v1 (mock)',
      description: desc || 'No description provided',
      materials: [...baseMaterials, ...extras],
      notes: 'Demo output. Wire to O-Calc/engineering service for real structural calcs and BOM.'
    }

    return NextResponse.json(response, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
