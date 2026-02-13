import { chat_api } from '@/api_factory/modules/chat.api'
import { useUser } from '@/composables/modules/auth/user'
import { useCustomToast } from '@/composables/core/useCustomToast'
import type { ChatMessage, Conversation } from '~/composables/modules/useRealtime'

export const useChat = () => {
    const { businessId, userId } = useUser()

    const conversations = ref<Conversation[]>([])
    const activeConversation = ref<Conversation | null>(null)
    const messages = ref<ChatMessage[]>([])
    const loading = ref(false)
    const sending = ref(false)

    // Conversations
    const fetchConversations = async () => {
        loading.value = true
        try {
            const response = await chat_api.getConversations({
                userId: userId.value,
                businessId: businessId.value
            })
            if ([200, 201].includes(response.status)) {
                conversations.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
            }
        } catch (e: any) {
            console.error('Failed to fetch conversations', e)
        } finally {
            loading.value = false
        }
    }

    const createConversation = async (participantIds: string[]) => {
        const { showToast } = useCustomToast()
        try {
            const response = await chat_api.createConversation({
                businessId: businessId.value,
                participants: [userId.value, ...participantIds]
            })
            if ([200, 201].includes(response.status)) {
                showToast({
                    title: 'Success',
                    message: 'Conversation created successfully',
                    toastType: 'success'
                })
                await fetchConversations()
                return response.data.data || response.data
            }
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
            const response = await chat_api.getMessages(conversationId, params)
            if ([200, 201].includes(response.status)) {
                messages.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
            }
        } catch (e: any) {
            console.error('Failed to fetch messages', e)
        } finally {
            loading.value = false
        }
    }

    const sendMessage = async (conversationId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text') => {
        sending.value = true
        try {
            const response = await chat_api.sendChatMessage(conversationId, {
                senderId: userId.value,
                message,
                messageType
            })

            if ([200, 201].includes(response.status)) {
                const newMessage = response.data.data || response.data
                messages.value.push(newMessage)

                // Update last message in conversation
                if (activeConversation.value) {
                    activeConversation.value.lastMessage = newMessage
                }

                return newMessage
            }
        } catch (e: any) {
            throw e
        } finally {
            sending.value = false
        }
    }

    const markConversationAsRead = async (conversationId: string) => {
        try {
            await chat_api.markAsRead(conversationId, {
                userId: userId.value
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
        const { showToast } = useCustomToast()
        try {
            const response = await chat_api.deleteConversation(conversationId)
            if ([200, 201].includes(response.status)) {
                showToast({
                    title: 'Success',
                    message: 'Conversation deleted successfully',
                    toastType: 'success'
                })
                conversations.value = conversations.value.filter(c => c._id !== conversationId)
                if (activeConversation.value?._id === conversationId) {
                    activeConversation.value = null
                    messages.value = []
                }
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
