import { ref } from 'vue'
import { business_api } from '~/api_factory/modules/business.api'

export const useBusinessStaff = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const addStaff = async (businessId: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.addStaff(businessId, payload)
      return res.data?.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const removeStaff = async (businessId: string, staffId: string) => {
    loading.value = true
    error.value = null
    try {
      await business_api.removeStaff(businessId, staffId)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, addStaff, removeStaff }
}
