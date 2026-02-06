import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useUser } from '@/composables/modules/auth/user'
import { notification_api } from '@/api_factory/modules'

export const useRealtime = () => {
    const { businessId, token } = useUser()

    const socket = ref<import('socket.io-client').Socket | null>(null)
    const isConnected = ref(false)
    const notifications = ref<any[]>([])
    const unreadNotificationCount = ref(0)

    // Fetch unread count from API
    const fetchUnreadCount = async () => {
        if (!businessId.value) return
        try {
            const response = await notification_api.getUnreadCount(businessId.value)
            unreadNotificationCount.value = response.data?.unreadCount ?? response.data?.data?.unreadCount ?? 0
        } catch (e: any) {
            console.error('Failed to fetch unread count', e)
        }
    }

    // Notifications
    const fetchNotifications = async (params: { page?: number, limit?: number, isRead?: boolean } = {}) => {
        try {
            const response = await notification_api.getLogs(businessId.value, params)
            notifications.value = Array.isArray(response.data?.data)
                ? response.data.data
                : (response.data?.data || response.data || [])
            // Also update unread count from API
            await fetchUnreadCount()
        } catch (e: any) {
            console.error('Failed to fetch notifications', e)
        }
    }

    const markAsRead = async (notificationId: string) => {
        try {
            await notification_api.markAsRead(notificationId)
            const notification = notifications.value.find(n => n._id === notificationId)
            if (notification) {
                notification.isRead = true
                unreadNotificationCount.value = Math.max(0, unreadNotificationCount.value - 1)
            }
        } catch (e: any) {
            console.error('Failed to mark notification as read', e)
        }
    }

    const markAllAsRead = async () => {
        try {
            await notification_api.markAllAsRead(businessId.value)
            notifications.value.forEach(n => n.isRead = true)
            unreadNotificationCount.value = 0
        } catch (e: any) {
            console.error('Failed to mark all as read', e)
        }
    }

    // Socket.IO Connection
    const connectWebSocket = () => {
        if (!token.value || socket.value) return

        const baseUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
        const socketInstance = io(`${baseUrl}/realtime`, {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            auth: { token: token.value }
        })

        socketInstance.on('connect', () => {
            isConnected.value = true
        })

        socketInstance.on('disconnect', () => {
            isConnected.value = false
        })

        socketInstance.on('notification:new', (payload: any) => {
            notifications.value.unshift(payload)
            unreadNotificationCount.value++
            showToast(payload.title || 'New notification', payload.message || payload.content || '')
        })

        socketInstance.on('audit:log', (payload: any) => {
            const notification = {
                _id: payload?.id || payload?._id || `audit_${Date.now()}`,
                type: 'audit',
                title: payload?.action || 'Audit Log',
                message: payload?.description || payload?.entity || 'Audit update',
                isRead: false,
                createdAt: payload?.timestamp || new Date().toISOString()
            }
            notifications.value.unshift(notification)
            unreadNotificationCount.value++
        })

        socketInstance.on('chat:new-message', (payload: any) => {
            window.dispatchEvent(new CustomEvent('chat-message', { detail: payload }))
        })

        socket.value = socketInstance
    }

    const disconnectWebSocket = () => {
        socket.value?.disconnect()
        socket.value = null
        isConnected.value = false
    }

    const showToast = (title: string, message: string) => {
        // Simple browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body: message })
        }
    }

    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission()
        }
    }

    // Auto-connect on mount
    onMounted(() => {
        fetchNotifications()
        connectWebSocket()
        requestNotificationPermission()
    })

    // Cleanup on unmount
    onUnmounted(() => {
        disconnectWebSocket()
    })

    return {
        socket,
        isConnected,
        notifications,
        unreadNotificationCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        connectWebSocket,
        disconnectWebSocket
    }
}
