import { del, get, put } from '@vercel/blob'
import { seedCatalog, type CatalogItem } from '../src/catalog'

export const CATALOG_PATH = 'rivaado/catalog.json'

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN)
}

export function adminConfigured() {
  return Boolean(process.env.RIVAADO_ADMIN_PASSWORD)
}

export function assertAdmin(password: string | undefined) {
  if (!adminConfigured()) {
    const error = new Error('RIVAADO_ADMIN_PASSWORD is not configured')
    ;(error as Error & { code?: string }).code = 'ADMIN_NOT_CONFIGURED'
    throw error
  }
  if (!password || password !== process.env.RIVAADO_ADMIN_PASSWORD) {
    const error = new Error('Invalid admin password')
    ;(error as Error & { code?: string }).code = 'UNAUTHORIZED'
    throw error
  }
}

export async function loadCatalog(): Promise<{ items: CatalogItem[]; storage: 'blob' | 'seed' }> {
  if (!blobConfigured()) return { items: seedCatalog, storage: 'seed' }

  try {
    const blob = await get(CATALOG_PATH, { access: 'public', useCache: false })
    if (!blob) return { items: seedCatalog, storage: 'seed' }
    const text = await new Response(blob.stream).text()
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed)) return { items: seedCatalog, storage: 'seed' }
    return { items: parsed as CatalogItem[], storage: 'blob' }
  } catch {
    return { items: seedCatalog, storage: 'seed' }
  }
}

export async function saveCatalog(items: CatalogItem[]) {
  if (!blobConfigured()) {
    const error = new Error('Vercel Blob is not connected to this project')
    ;(error as Error & { code?: string }).code = 'BLOB_NOT_CONFIGURED'
    throw error
  }

  await put(CATALOG_PATH, JSON.stringify(items, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

export async function deleteManagedImage(url: string | undefined) {
  if (!url || !blobConfigured()) return
  if (!url.startsWith('https://')) return
  if (!url.includes('blob.vercel-storage.com')) return
  try { await del(url) } catch { /* keep catalog deletion resilient */ }
}

export function apiError(error: unknown) {
  const e = error as Error & { code?: string }
  const code = e?.code || 'UNKNOWN'
  const status = code === 'UNAUTHORIZED' ? 401 : code === 'ADMIN_NOT_CONFIGURED' || code === 'BLOB_NOT_CONFIGURED' ? 503 : 400
  return Response.json({ error: e?.message || 'Request failed', code }, { status })
}
