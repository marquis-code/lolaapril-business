import { ref } from 'vue'
import { notification_api } from '@/api_factory/modules'

export const useMarkNotificationRead = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (notificationId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await notification_api.markAsRead(notificationId)
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
