import { ref } from 'vue'
import { chat_api } from '@/api_factory/modules'
import type { ChatFAQ } from '@/types/chat'

export const useFaqs = () => {
  const data = ref<ChatFAQ[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchFaqs = async (params?: { category?: string; isActive?: boolean }) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.getFAQs(params)
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

  const createFaq = async (payload: {
    question: string
    answer: string
    keywords: string[]
    alternativeQuestions?: string[]
    category?: string
    confidenceThreshold?: number
    priority?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.createFAQ(payload)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateFaq = async (faqId: string, payload: Record<string, any>) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.updateFAQ(faqId, payload)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteFaq = async (faqId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await chat_api.deleteFAQ(faqId)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchFaqs, createFaq, updateFaq, deleteFaq }
}
