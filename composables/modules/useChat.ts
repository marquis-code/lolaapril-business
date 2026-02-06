import type { ChatMessage, Conversation } from '~/composables/modules/useRealtime'

export const useChat = () => {
    const api = useApi()
    const businessId = useCookie('businessId')
    const { user } = useAuth()

    const conversations = ref<Conversation[]>([])
    const activeConversation = ref<Conversation | null>(null)
    const messages = ref<ChatMessage[]>([])
    const loading = ref(false)
    const sending = ref(false)

    // Conversations
    const fetchConversations = async () => {
        loading.value = true
        try {
            const { data } = await api.get<{ data: Conversation[] }>('/chat/conversations', {
                params: { userId: user.value?._id, businessId: businessId.value }
            })
            conversations.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            console.error('Failed to fetch conversations', e)
        } finally {
            loading.value = false
        }
    }

    const createConversation = async (participantIds: string[]) => {
        try {
            const { data } = await api.post('/chat/conversations', {
                businessId: businessId.value,
                participants: [user.value?._id, ...participantIds]
            })
            await fetchConversations()
            return data.data || data
        } catch (e: any) {
            throw e
        }
    }

    const selectConversation = async (conversationId: string) => {
        const conversation = conversations.value.find(c => c._id === conversationId)
        if (conversation) {
            activeConversation.value = conversation
            await fetchMessages(conversationId)
            await markConversationAsRead(conversationId)
        }
    }

    // Messages
    const fetchMessages = async (conversationId: string, params: { page?: number, limit?: number } = {}) => {
        loading.value = true
        try {
            const { data } = await api.get<{ data: ChatMessage[] }>(`/chat/conversations/${conversationId}/messages`, {
                params
            })
            messages.value = Array.isArray(data) ? data : (data.data || [])
        } catch (e: any) {
            console.error('Failed to fetch messages', e)
        } finally {
            loading.value = false
        }
    }

    const sendMessage = async (conversationId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text') => {
        sending.value = true
        try {
            const { data } = await api.post(`/chat/conversations/${conversationId}/messages`, {
                senderId: user.value?._id,
                message,
                messageType
            })

            const newMessage = data.data || data
            messages.value.push(newMessage)

            // Update last message in conversation
            if (activeConversation.value) {
                activeConversation.value.lastMessage = newMessage
            }

            return newMessage
        } catch (e: any) {
            throw e
        } finally {
            sending.value = false
        }
    }

    const markConversationAsRead = async (conversationId: string) => {
        try {
            await api.patch(`/chat/conversations/${conversationId}/read`, {
                userId: user.value?._id
            })

            const conversation = conversations.value.find(c => c._id === conversationId)
            if (conversation) {
                conversation.unreadCount = 0
            }
        } catch (e: any) {
            console.error('Failed to mark as read', e)
        }
    }

    const deleteConversation = async (conversationId: string) => {
        try {
            await api.delete(`/chat/conversations/${conversationId}`)
            conversations.value = conversations.value.filter(c => c._id !== conversationId)
            if (activeConversation.value?._id === conversationId) {
                activeConversation.value = null
                messages.value = []
            }
        } catch (e: any) {
            throw e
        }
    }

    // Handle real-time chat messages
    const handleIncomingMessage = (message: ChatMessage) => {
        // Add to messages if in active conversation
        if (activeConversation.value?._id === message.conversationId) {
            messages.value.push(message)
            markConversationAsRead(message.conversationId)
        } else {
            // Update unread count
            const conversation = conversations.value.find(c => c._id === message.conversationId)
            if (conversation) {
                conversation.unreadCount++
                conversation.lastMessage = message
            }
        }
    }

    // Listen for real-time chat messages
    onMounted(() => {
        fetchConversations()

        window.addEventListener('chat-message', ((event: CustomEvent) => {
            handleIncomingMessage(event.detail)
        }) as EventListener)
    })

    onUnmounted(() => {
        window.removeEventListener('chat-message', handleIncomingMessage as any)
    })

    return {
        conversations,
        activeConversation,
        messages,
        loading,
        sending,
        fetchConversations,
        createConversation,
        selectConversation,
        fetchMessages,
        sendMessage,
        markConversationAsRead,
        deleteConversation
    }
}
