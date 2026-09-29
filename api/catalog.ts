import { adminConfigured, blobConfigured, loadCatalog } from './_catalog'

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { items, storage } = await loadCatalog()
  return Response.json(
    {
      items,
      storage,
      backendReady: blobConfigured(),
      adminReady: adminConfigured(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
