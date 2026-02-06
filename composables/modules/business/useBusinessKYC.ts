import { ref } from 'vue'
import { business_api } from '~/api_factory/modules/business.api'

export const useBusinessKYC = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const verify = async (businessId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.verifyKYC(businessId)
      return res.data?.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const reject = async (businessId: string, reason: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.rejectKYC(businessId, reason)
      return res.data?.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const getSubaccount = async (businessId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.getSubaccount(businessId)
      return res.data?.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, verify, reject, getSubaccount }
}
