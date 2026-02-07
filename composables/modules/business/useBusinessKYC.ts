
import { ref } from 'vue'
import { business_api } from '~/api_factory/modules/business.api'
import { GATEWAY_ENDPOINT_WITH_AUTH } from '~/api_factory/axios.config'

export const useBusinessKYC = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)


  // Verify KYC
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


  // Reject KYC
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


  // Get subaccount
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

  // Get business by ID (for KYC status and docs)
  const getBusinessById = async (businessId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.getBusinessByIdPublic(businessId)
      return res.data?.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Upload KYC document (generic, for all doc types)
  const uploadKycDocument = async (businessId: string, docType: string, file: File) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('docType', docType)
      // Assume endpoint: /businesses/:id/upload-kyc-doc (POST)
      const res = await GATEWAY_ENDPOINT_WITH_AUTH.post(`/businesses/${businessId}/upload-kyc-doc`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data?.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    verify,
    reject,
    getSubaccount,
    getBusinessById,
    uploadKycDocument
  }
}
