import { ref } from 'vue'
import { notification_api } from '@/api_factory/modules'
import { useUser } from '@/composables/modules/auth/user'

export const useGetUnreadCount = () => {
  const { businessId } = useUser()
  const unreadCount = ref<number>(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    if (!businessId.value) return 0
    loading.value = true
    error.value = null
    try {
      const response = await notification_api.getUnreadCount(businessId.value)
      unreadCount.value = response.data?.unreadCount ?? response.data?.data?.unreadCount ?? 0
      return unreadCount.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { unreadCount, loading, error, execute }
}
