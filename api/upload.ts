import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { apiError, assertAdmin, blobConfigured } from './_catalog'

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (!blobConfigured()) {
    return Response.json(
      { error: 'Vercel Blob is not connected to this project', code: 'BLOB_NOT_CONFIGURED' },
      { status: 503 },
    )
  }

  try {
    const body = (await request.json()) as HandleUploadBody
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let password = ''
        try {
          password = JSON.parse(clientPayload || '{}').password || ''
        } catch {
          password = ''
        }
        assertAdmin(password)

        if (!pathname.startsWith('rivaado/')) {
          throw new Error('Invalid upload path')
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ scope: 'rivaado-catalog' }),
        }
      },
      onUploadCompleted: async () => {
        // Catalog metadata is saved separately after the image upload succeeds.
      },
    })

    return Response.json(response)
  } catch (error) {
    return apiError(error)
  }
}
