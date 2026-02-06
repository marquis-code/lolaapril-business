import { ref, computed } from 'vue'
import { chat_api } from '@/api_factory/modules/chat.api'

export interface UnreadRoom {
  roomId: string
  roomName?: string
  unreadCount: number
  lastMessage?: {
    content: string
    senderName: string
    timestamp: string
  }
}

export interface UnreadCountsResponse {
  totalUnread: number
  roomsWithUnread: number
  rooms: UnreadRoom[]
}

// Singleton state to share across components
const unreadCounts = ref<UnreadCountsResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let pollInterval: ReturnType<typeof setInterval> | null = null

export const useUnreadCounts = () => {
  const totalUnread = computed(() => unreadCounts.value?.totalUnread || 0)
  const roomsWithUnread = computed(() => unreadCounts.value?.roomsWithUnread || 0)
  const unreadRooms = computed(() => unreadCounts.value?.rooms || [])

  const fetchUnreadCounts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.getUnreadCounts()
      if (response.data?.success !== false) {
        unreadCounts.value = response.data?.data || response.data
      }
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to fetch unread counts'
      console.error('Error fetching unread counts:', err)
    } finally {
      loading.value = false
    }
  }

  const incrementUnread = (roomId?: string) => {
    if (unreadCounts.value) {
      unreadCounts.value.totalUnread += 1
      
      if (roomId) {
        const room = unreadCounts.value.rooms.find(r => r.roomId === roomId)
        if (room) {
          room.unreadCount += 1
        } else {
          unreadCounts.value.rooms.push({
            roomId,
            unreadCount: 1
          })
          unreadCounts.value.roomsWithUnread += 1
        }
      }
    }
  }

  const markRoomAsRead = (roomId: string) => {
    if (unreadCounts.value) {
      const roomIndex = unreadCounts.value.rooms.findIndex(r => r.roomId === roomId)
      if (roomIndex >= 0) {
        const room = unreadCounts.value.rooms[roomIndex]
        unreadCounts.value.totalUnread -= room.unreadCount
        unreadCounts.value.rooms.splice(roomIndex, 1)
        unreadCounts.value.roomsWithUnread -= 1
      }
    }
  }

  const startPolling = (intervalMs = 60000) => {
    if (pollInterval) return
    fetchUnreadCounts()
    pollInterval = setInterval(fetchUnreadCounts, intervalMs)
  }

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  return {
    unreadCounts,
    totalUnread,
    roomsWithUnread,
    unreadRooms,
    loading,
    error,
    fetchUnreadCounts,
    incrementUnread,
    markRoomAsRead,
    startPolling,
    stopPolling
  }
}
