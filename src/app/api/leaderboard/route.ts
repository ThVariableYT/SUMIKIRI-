import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const MODES = ['abyss', 'gauntlet', 'story'] as const
type Mode = (typeof MODES)[number]

const isMode = (v: string): v is Mode => (MODES as readonly string[]).includes(v)

function orderByFor(mode: Mode) {
  return mode === 'abyss'
    ? [{ wave: 'desc' as const }, { timeSec: 'asc' as const }]
    : [{ timeSec: 'asc' as const }]
}

const hits = new Map<string, { count: number; reset: number }>()

function allow(ip: string): boolean {
  const now = Date.now()
  const bucket = hits.get(ip)
  if (!bucket || now >= bucket.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }
  bucket.count++
  return bucket.count <= 30
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) {
    const first = fwd.split(',')[0].trim()
    if (first) return first
  }
  return 'local'
}

function cleanName(v: unknown): string {
  if (typeof v !== 'string') return 'Nameless'
  const s = v.replace(/\s+/g, ' ').trim().slice(0, 16).trim()
  return s.length > 0 ? s : 'Nameless'
}

function toInt(v: unknown, min: number, max: number): number | null {
  if (typeof v !== 'number' || !Number.isFinite(v) || !Number.isInteger(v)) return null
  if (v < min || v > max) return null
  return v
}

function toTimeSec(v: unknown): number | null {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null
  if (v < 1 || v > 604800) return null
  return v
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status })
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  const modeParam = params.get('mode') ?? 'abyss'
  const mode: Mode = isMode(modeParam) ? modeParam : 'abyss'

  const limitParam = Number.parseInt(params.get('limit') ?? '', 10)
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20

  try {
    const rows = await db.run.findMany({
      where: { mode },
      orderBy: orderByFor(mode),
      take: limit,
    })
    return NextResponse.json({
      rows: rows.map((r) => ({
        id: r.id,
        name: r.name,
        mode: r.mode,
        wave: r.wave,
        kills: r.kills,
        timeSec: r.timeSec,
        difficulty: r.difficulty,
        createdAt: r.createdAt,
      })),
    })
  } catch (e) {
    return bad(e instanceof Error ? e.message : 'database error', 500)
  }
}

export async function POST(req: NextRequest) {
  if (!allow(clientIp(req))) return bad('slow down', 429)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return bad('invalid json')
  }

  if (typeof body !== 'object' || body === null) return bad('invalid body')
  const b = body as Record<string, unknown>

  if (typeof b.mode !== 'string' || !isMode(b.mode)) return bad('invalid mode')
  const mode = b.mode

  const name = cleanName(b.name)

  const wave = toInt(b.wave, 0, 9999)
  if (wave === null) return bad('invalid wave')

  const kills = toInt(b.kills, 0, 99999)
  if (kills === null) return bad('invalid kills')

  const timeSec = toTimeSec(b.timeSec)
  if (timeSec === null) return bad('invalid timeSec')

  const difficulty = toInt(b.difficulty, 0, 2)
  if (difficulty === null) return bad('invalid difficulty')

  try {
    const row = await db.run.create({
      data: { name, mode, wave, kills, timeSec, difficulty },
    })

    const better = await db.run.count({
      where:
        mode === 'abyss'
          ? { mode, OR: [{ wave: { gt: wave } }, { wave, timeSec: { lt: timeSec } }] }
          : { mode, timeSec: { lt: timeSec } },
    })

    return NextResponse.json({ ok: true, rank: better + 1, id: row.id }, { status: 201 })
  } catch (e) {
    return bad(e instanceof Error ? e.message : 'database error', 500)
  }
}
