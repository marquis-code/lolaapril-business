import { ref } from 'vue'
import { pricing_api } from '@/api_factory/modules'

export const useUpsertFeeStructure = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (payload: {
    pricingTierId?: string
    platformFeePercentage: number
    platformFeeFixed?: number
    effectiveFrom?: string
    effectiveTo?: string
    isGrandfathered?: boolean
    customRules?: {
      noShowFee?: number
      cancellationFee?: number
      minBookingAmount?: number
    }
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await pricing_api.upsertFeeStructure(payload)
      return response.data?.data || response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, execute }
}
