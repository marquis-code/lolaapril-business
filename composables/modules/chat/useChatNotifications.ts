import { ref } from 'vue'
import { io, type Socket } from 'socket.io-client'
import { useUser } from '@/composables/modules/auth/user'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useUnreadCounts } from './useUnreadCounts'

export interface ChatNotificationMessage {
  roomId: string
  messageId: string
  senderId: string
  senderName: string
  senderType: 'customer' | 'staff' | 'system' | 'bot'
  content: string
  messageType?: string
  isAutomated?: boolean
  timestamp: string
}

// Singleton state for global WebSocket connection
let globalSocket: Socket | null = null
const isGlobalConnected = ref(false)
const currentRoomId = ref<string | null>(null) // Track if user is viewing a specific room
let toastHandler: ((options: any) => void) | null = null
let userIdValue: string | null = null

export const useChatNotifications = () => {
  const { token, user } = useUser()
  const { showToast } = useCustomToast()
  const { incrementUnread, fetchUnreadCounts } = useUnreadCounts()

  // Store toast handler and user for use in event handlers
  toastHandler = showToast
  userIdValue = user.value?.id || null

  const handleNewMessage = (message: ChatNotificationMessage) => {
    console.log('Chat notification: New message received', message)
    
    // Don't show toast if user is viewing this room
    if (currentRoomId.value === message.roomId) {
      console.log('Skipping toast - user is viewing this room')
      return
    }

    // Don't show toast for messages from self
    if (message.senderId === userIdValue) {
      console.log('Skipping toast - message from self')
      return
    }

    // Increment unread count
    incrementUnread(message.roomId)

    // Determine toast styling based on whether it's automated
    const isAutomated = message.isAutomated || message.senderType === 'bot' || message.senderType === 'system'
    
    // Truncate long messages
    const truncatedContent = message.content?.length > 50 
      ? message.content.substring(0, 47) + '...' 
      : message.content || 'New message'

    // Show toast notification
    if (toastHandler) {
      console.log('Showing toast notification')
      toastHandler({
        title: isAutomated ? '🤖 Auto-Assistant' : `💬 ${message.senderName || 'New Message'}`,
        message: truncatedContent,
        toastType: 'info',
        duration: 5000
      })
    }
  }

  const handleNewConversation = (data: any) => {
    console.log('Chat notification: New conversation', data)
    
    // Increment unread and refresh counts
    incrementUnread(data.roomId)
    
    if (toastHandler) {
      toastHandler({
        title: '🆕 New Conversation',
        message: `${data.userName || 'A customer'} started a new chat`,
        toastType: 'info',
        duration: 5000
      })
    }
  }

  const connect = () => {
    if (globalSocket?.connected) {
      console.log('Chat notifications: Already connected')
      return
    }

    // Disconnect existing socket if not connected
    if (globalSocket) {
      globalSocket.disconnect()
      globalSocket = null
    }

    const baseUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
    console.log('Chat notifications: Connecting to', baseUrl)
    
    globalSocket = io(`${baseUrl}/realtime`, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      auth: token.value ? { token: token.value } : undefined
    })

    globalSocket.on('connect', () => {
      isGlobalConnected.value = true
      console.log('Chat notifications: WebSocket connected, socket id:', globalSocket?.id)
      
      // Test toast on connection (remove in production)
      if (toastHandler) {
        toastHandler({
          title: '✅ Chat Connected',
          message: 'Real-time chat notifications are now active',
          toastType: 'success',
          duration: 3000
        })
      }
    })

    globalSocket.on('disconnect', () => {
      isGlobalConnected.value = false
      console.log('Chat notifications: WebSocket disconnected')
    })

    globalSocket.on('connect_error', (error) => {
      console.error('Chat notifications: Connection error', error)
    })

    // Listen for new messages globally
    globalSocket.on('chat:new-message', handleNewMessage)

    // Listen for new conversations
    globalSocket.on('chat:new-conversation', handleNewConversation)

    // Also fetch initial unread counts
    fetchUnreadCounts()
  }

  const disconnect = () => {
    if (globalSocket) {
      globalSocket.disconnect()
      globalSocket = null
      isGlobalConnected.value = false
    }
  }

  // Set the current room (to prevent toasts when viewing that room)
  const setCurrentRoom = (roomId: string | null) => {
    currentRoomId.value = roomId
  }

  return {
    isConnected: isGlobalConnected,
    connect,
    disconnect,
    setCurrentRoom,
    currentRoomId
  }
}

// Export a function to fully cleanup (call on logout)
export const cleanupChatNotifications = () => {
  if (globalSocket) {
    globalSocket.disconnect()
    globalSocket = null
    isGlobalConnected.value = false
  }
}
