import { ref } from 'vue'
import { business_api } from '~/api_factory/modules/business.api'

export const useBusinessSettings = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async (businessId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.getSettings(businessId)
      data.value = res.data?.data
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const update = async (businessId: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.updateSettings(businessId, payload)
      data.value = res.data?.data
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetch, update }
}
