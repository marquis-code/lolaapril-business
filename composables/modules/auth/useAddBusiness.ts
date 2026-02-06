import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'

export const useAddBusiness = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const AddBusiness = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const res = await auth_api.addBusiness(payload)
      return res.data?.data || res.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, AddBusiness }
}
