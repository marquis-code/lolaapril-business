import { ref } from 'vue'
import type { NotificationLog } from '@/types/notification'
import { notification_api } from '@/api_factory/modules'
import { useUser } from '@/composables/modules/auth/user'

export const useFetchNotificationLogs = () => {
  const { businessId } = useUser()
  const data = ref<NotificationLog[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (params?: { page?: number; limit?: number; status?: string; channel?: string }) => {
    if (!businessId.value) return null
    loading.value = true
    error.value = null
    try {
      const response = await notification_api.getLogs(businessId.value, params)
      data.value = Array.isArray(response.data?.data)
        ? response.data.data
        : (response.data?.data || response.data || [])
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
