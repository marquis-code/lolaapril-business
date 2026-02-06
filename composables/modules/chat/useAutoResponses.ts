import { ref } from 'vue'
import { chat_api } from '@/api_factory/modules'
import type { AutoResponse } from '@/types/chat'

export const useAutoResponses = () => {
  const data = ref<AutoResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAutoResponses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.getAutoResponses()
      data.value = Array.isArray(response.data?.data)
        ? response.data.data
        : (response.data?.data || response.data || [])
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const createAutoResponse = async (payload: Record<string, any>) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.createAutoResponse(payload as any)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateAutoResponse = async (responseId: string, payload: Record<string, any>) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.updateAutoResponse(responseId, payload)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchAutoResponses, createAutoResponse, updateAutoResponse }
}
