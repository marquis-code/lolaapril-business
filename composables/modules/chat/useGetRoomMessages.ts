import { ref } from 'vue'
import { chat_api } from '@/api_factory/modules'
import type { ChatMessage } from '@/types/chat'

export const useGetRoomMessages = () => {
  const data = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (roomId: string, params?: {
    page?: number
    limit?: number
    beforeMessageId?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.getRoomMessages(roomId, params)
      const messages = response.data?.data || response.data?.messages || response.data || []
      data.value = Array.isArray(messages) ? messages : []
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
