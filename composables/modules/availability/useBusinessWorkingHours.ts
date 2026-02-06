import { ref } from 'vue'
import { working_hours_api } from '@/api_factory/modules/working-hours.api'

export const useBusinessWorkingHours = () => {
  const data = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchWorkingHours = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await working_hours_api.getBusinessWorkingHours()
      data.value = response.data?.data
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const createWorkingHours = async (workingHours: any[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await working_hours_api.createBusinessWorkingHours(workingHours)
      data.value = response.data?.data
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateWorkingHours = async (workingHours: any[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await working_hours_api.updateBusinessWorkingHours(workingHours)
      data.value = response.data?.data
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchWorkingHours, createWorkingHours, updateWorkingHours }
}
