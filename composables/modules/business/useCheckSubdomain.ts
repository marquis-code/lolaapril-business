import { ref } from 'vue'
import { business_api } from '~/api_factory/modules/business.api'

export const useCheckSubdomain = () => {
  const available = ref<boolean | null>(null)
  const subdomainObj = ref<any>(null)
  const loading = ref(false)  
  const error = ref<string | null>(null)

  const checkDomain = async (subdomain: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await business_api.checkSubdomainAvailability(subdomain)
      subdomainObj.value = res.data.data
      available.value = res.data?.data?.available
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { available, loading, error, subdomainObj, checkDomain }
}
