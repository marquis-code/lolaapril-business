import { ref } from 'vue'
import { chat_api } from '@/api_factory/modules'

export const useMarkRoomMessagesRead = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (roomId: string, userId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.markMessagesAsRead(roomId, userId)
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
