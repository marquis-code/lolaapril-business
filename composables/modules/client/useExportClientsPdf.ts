import { ref } from 'vue'
import { client_api } from '@/api_factory/modules'

export const useExportClientsPdf = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (filename: string = 'clients-export.pdf') => {
    loading.value = true
    error.value = null
    try {
      const response = await client_api.exportPDF()
      const blob = new Blob([response.data], { type: 'application/pdf' })
      if (typeof window !== 'undefined') {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      }
      return blob
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, execute }
}
