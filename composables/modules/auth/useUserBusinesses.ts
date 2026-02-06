import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'

export const useUserBusinesses = () => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const UserBusinesses = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await auth_api.getUserBusinesses()
      data.value = res.data?.data || res.data || []
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, UserBusinesses }
}
