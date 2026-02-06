import { ref } from 'vue'
import type { ChatRoom } from '@/types/chat'
import { chat_api } from '@/api_factory/modules'

export const useTeamChat = () => {
  const data = ref<ChatRoom | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createTeamChatRoom = async (payload: {
    memberId: string
    memberName?: string
    memberEmail?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.createTeamChatRoom(payload)
      data.value = response.data?.data || response.data
      return data.value
    } catch (e: any) {
      error.value = e.message || 'Failed to create team chat room'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    createTeamChatRoom
  }
}
