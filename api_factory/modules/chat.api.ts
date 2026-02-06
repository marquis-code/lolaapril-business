import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const chat_api = {
  createRoom: (payload: {
    userId: string
    userName: string
    userEmail?: string
    userPhone?: string
  }) => {
    const url = '/chat/rooms/create'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getRooms: (params?: {
    roomType?: string
    isActive?: boolean
    priority?: string
    page?: number
    limit?: number
  }) => {
    const url = '/chat/rooms'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  archiveRoom: (roomId: string) => {
    const url = `/chat/rooms/${roomId}/archive`
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url)
  },
  sendMessage: (roomId: string, payload: {
    senderId: string
    senderType: 'customer' | 'staff' | 'system' | 'bot'
    senderName: string
    content: string
    messageType?: string
    attachments?: string[]
    replyToMessageId?: string
  }) => {
    const url = `/chat/rooms/${roomId}/messages`
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getRoomMessages: (roomId: string, params?: {
    page?: number
    limit?: number
    beforeMessageId?: string
  }) => {
    const url = `/chat/rooms/${roomId}/messages`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  markMessagesAsRead: (roomId: string, userId: string) => {
    const url = `/chat/rooms/${roomId}/messages/read`
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, { userId })
  },
  createFAQ: (payload: {
    question: string
    answer: string
    keywords: string[]
    alternativeQuestions?: string[]
    category?: string
    confidenceThreshold?: number
    priority?: number
  }) => {
    const url = '/chat/faqs'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getFAQs: (params?: { category?: string; isActive?: boolean }) => {
    const url = '/chat/faqs'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  updateFAQ: (faqId: string, payload: Record<string, any>) => {
    const url = `/chat/faqs/${faqId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
  },
  deleteFAQ: (faqId: string) => {
    const url = `/chat/faqs/${faqId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(url)
  },
  createAutoResponse: (payload: {
    name: string
    responseType: string
    message: string
    trigger?: {
      event: string
      conditions?: {
        dayOfWeek?: number[]
        timeRange?: { start: string; end: string }
        maxWaitTime?: number
        queueSize?: number
      }
    }
    quickReplies?: string[]
    includeBusinessHours?: boolean
    includeEstimatedWaitTime?: boolean
  }) => {
    const url = '/chat/auto-responses'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },
  getAutoResponses: () => {
    const url = '/chat/auto-responses'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },
  updateAutoResponse: (responseId: string, payload: Record<string, any>) => {
    const url = `/chat/auto-responses/${responseId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.put(url, payload)
  },
  
  // Unread Counts - Get total unread messages count
  getUnreadCounts: () => {
    const url = '/chat/unread-counts'
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  },

  // Team Chat - For internal team communication
  createTeamChatRoom: (payload: {
    memberId: string
    memberName?: string
    memberEmail?: string
  }) => {
    const url = '/chat/rooms/team'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
  },

  // Support Chat - For business owner to chat with super admin
  createSupportChatRoom: (payload?: {
    superAdminId?: string
  }) => {
    const url = '/chat/rooms/support'
    return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload || {})
  }
}
