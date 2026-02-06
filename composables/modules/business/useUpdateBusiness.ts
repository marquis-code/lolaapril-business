import { ref } from 'vue'
import { business_api } from '~/api_factory/modules/business.api'

export const useUpdateBusiness = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (businessId: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.updateBusiness(businessId, payload)
      return res.data?.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, execute }
}
