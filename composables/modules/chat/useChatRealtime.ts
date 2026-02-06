import { ref, onMounted, onUnmounted } from 'vue'
import { io, type Socket } from 'socket.io-client'
import type { ChatMessage } from '@/types/chat'
import { useUser } from '@/composables/modules/auth/user'

export const useChatRealtime = () => {
  const { token } = useUser()
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const messageHandlers: Array<(message: ChatMessage) => void> = []
  const conversationHandlers: Array<(data: any) => void> = []
  const typingHandlers: Array<(data: any) => void> = []

  const connect = () => {
    if (socket.value) return

    const baseUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
    const socketInstance = io(`${baseUrl}/realtime`, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      auth: token.value ? { token: token.value } : undefined
    })

    socketInstance.on('connect', () => {
      isConnected.value = true
    })

    socketInstance.on('disconnect', () => {
      isConnected.value = false
    })

    messageHandlers.forEach(handler => socketInstance.on('chat:new-message', handler))
    conversationHandlers.forEach(handler => socketInstance.on('chat:new-conversation', handler))
    typingHandlers.forEach(handler => socketInstance.on('chat:user-typing', handler))

    socket.value = socketInstance
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
  }

  const joinRoom = (payload: { roomId?: string; businessId?: string; userName?: string; email?: string }) => {
    return new Promise<any>((resolve) => {
      if (!socket.value) return resolve(null)
      socket.value.emit('chat:join-room', payload, (response: any) => resolve(response))
    })
  }

  const leaveRoom = (roomId: string) => {
    if (!socket.value) return
    socket.value.emit('chat:leave-room', { roomId })
  }

  const sendMessage = (payload: { roomId: string; content: string; attachments?: any[] }) => {
    return new Promise<any>((resolve) => {
      if (!socket.value) return resolve(null)
      socket.value.emit('chat:send-message', payload, (response: any) => resolve(response))
    })
  }

  const onNewMessage = (handler: (message: ChatMessage) => void) => {
    messageHandlers.push(handler)
    socket.value?.on('chat:new-message', handler)
  }

  const onNewConversation = (handler: (data: any) => void) => {
    conversationHandlers.push(handler)
    socket.value?.on('chat:new-conversation', handler)
  }

  const onTyping = (handler: (data: any) => void) => {
    typingHandlers.push(handler)
    socket.value?.on('chat:user-typing', handler)
  }

  const emitTyping = (roomId: string, isTyping: boolean) => {
    socket.value?.emit('chat:typing', { roomId, isTyping })
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    onNewMessage,
    onNewConversation,
    onTyping,
    emitTyping
  }
}
