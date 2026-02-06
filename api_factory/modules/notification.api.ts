import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const notification_api = {
  getLogs: (businessId: string, params?: { page?: number; limit?: number; status?: string; channel?: string }) => {
    const url = `/notifications/logs/${businessId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, { params })
  },
  
  // Mark single notification as read
  markAsRead: (notificationId: string) => {
    const url = `/notifications/${notificationId}/read`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url)
  },
  
  // Mark all notifications as read for a business
  markAllAsRead: (businessId: string) => {
    const url = `/notifications/read-all/${businessId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(url)
  },
  
  // Get unread notification count for a business
  getUnreadCount: (businessId: string) => {
    const url = `/notifications/unread-count/${businessId}`
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
  }
}
