import { ref } from 'vue'
import { pricing_api } from '@/api_factory/modules'

export const useCalculateFees = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (amount: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await pricing_api.calculateFees(amount)
      data.value = response.data?.data || response.data
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
