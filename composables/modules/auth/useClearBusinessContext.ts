import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'

export const useClearBusinessContext = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const ClearBusinessContext = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await auth_api.clearBusinessContext()
      return res.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, ClearBusinessContext }
}
