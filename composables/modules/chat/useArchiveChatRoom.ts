import { ref } from 'vue'
import { chat_api } from '@/api_factory/modules'

export const useArchiveChatRoom = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (roomId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.archiveRoom(roomId)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, execute }
}
