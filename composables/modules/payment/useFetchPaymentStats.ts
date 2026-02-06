import { ref } from 'vue'
import { payment_api } from '@/api_factory/modules'

export const useFetchPaymentStats = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await payment_api.getStats()
      console.log('Fetch Payment Stats Response:', response)
      data.value = response.data?.data
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
