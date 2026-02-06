import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'

export const useSwitchBusiness = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const SwitchBusiness = async (businessId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await auth_api.switchBusiness(businessId)
      return res.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, SwitchBusiness }
}
