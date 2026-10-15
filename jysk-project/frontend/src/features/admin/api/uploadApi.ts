import { apiRequest } from '@/shared/api/httpClient'

export type UploadFolder = 'products' | 'categories' | 'blog'

interface UploadResponse {
  key: string
  url: string
}

export const uploadApi = {
  async uploadImage(file: File, folder: UploadFolder): Promise<string> {
    const body = new FormData()
    body.append('file', file)
    body.append('folder', folder)

    const response = await apiRequest<UploadResponse>('/admin/uploads', {
      method: 'POST',
      body,
    })

    return response.url
  },
}
