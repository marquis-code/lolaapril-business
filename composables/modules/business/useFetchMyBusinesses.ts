import { ref } from 'vue'
import { business_api } from '~/api_factory/modules/business.api'

export const useFetchMyBusinesses = () => {
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.getMyBusinesses()
      data.value = res.data?.data || []
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
