import { ref } from 'vue'
import { notification_api } from '@/api_factory/modules'
import { useUser } from '@/composables/modules/auth/user'

export const useMarkAllNotificationsRead = () => {
  const { businessId } = useUser()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const count = ref<number>(0)

  const execute = async () => {
    if (!businessId.value) return null
    loading.value = true
    error.value = null
    try {
      const response = await notification_api.markAllAsRead(businessId.value)
      count.value = response.data?.count ?? response.data?.data?.count ?? 0
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, count, execute }
}
