import { randomUUID } from 'node:crypto'
import { apiError, assertAdmin, deleteManagedImage, loadCatalog, saveCatalog } from './_catalog'
import type { CatalogItem } from '../src/catalog'

type UpsertBody = {
  password?: string
  action: 'upsert'
  item: Partial<CatalogItem>
}

type DeleteBody = {
  password?: string
  action: 'delete'
  id: string
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const body = (await request.json()) as UpsertBody | DeleteBody
    assertAdmin(body.password)

    const { items } = await loadCatalog()

    if (body.action === 'delete') {
      const existing = items.find((item) => item.id === body.id)
      const next = items.filter((item) => item.id !== body.id)
      await saveCatalog(next)
      await deleteManagedImage(existing?.imageUrl)
      return Response.json({ ok: true, items: next })
    }

    const incoming = body.item
    if (!incoming.section || !incoming.subsection || !incoming.name || !incoming.label || !incoming.imageUrl) {
      return Response.json({ error: 'Section, subsection, name, label and image are required' }, { status: 400 })
    }

    const id = incoming.id || randomUUID()
    const existingIndex = items.findIndex((item) => item.id === id)
    const normalized: CatalogItem = {
      id,
      section: incoming.section,
      subsection: incoming.subsection,
      name: incoming.name,
      label: incoming.label,
      caption: incoming.caption || '',
      description: incoming.description || '',
      priceTop: incoming.priceTop || 'PRICE ON REQUEST',
      priceBottom: incoming.priceBottom || 'BESPOKE',
      background: incoming.background || '#111827',
      glow: incoming.glow || 'rgba(255,255,255,0.18)',
      text: incoming.text === 'dark' ? 'dark' : 'light',
      imageUrl: incoming.imageUrl,
      published: incoming.published !== false,
      sortOrder: Number.isFinite(Number(incoming.sortOrder)) ? Number(incoming.sortOrder) : 100,
    }

    const next = [...items]
    if (existingIndex >= 0) {
      const previous = next[existingIndex]
      next[existingIndex] = normalized
      if (previous.imageUrl !== normalized.imageUrl) await deleteManagedImage(previous.imageUrl)
    } else {
      next.push(normalized)
    }

    await saveCatalog(next)
    return Response.json({ ok: true, item: normalized, items: next })
  } catch (error) {
    return apiError(error)
  }
}
