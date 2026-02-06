import { ref } from 'vue'
import { chat_api } from '@/api_factory/modules'

export const useSendChatMessage = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (roomId: string, payload: {
    senderId: string
    senderType: 'customer' | 'staff' | 'system' | 'bot'
    senderName: string
    content: string
    messageType?: string
    attachments?: string[]
    replyToMessageId?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.sendMessage(roomId, payload)
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
