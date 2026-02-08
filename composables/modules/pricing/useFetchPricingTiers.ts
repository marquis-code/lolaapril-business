import { ref } from 'vue'
import type { PricingTier } from '@/types/pricing'
import { pricing_api } from '@/api_factory/modules'

export const useFetchPricingTiers = () => {
  const data = ref<PricingTier[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await pricing_api.getActiveTiers()
      console.log('Fetch Pricing Tiers Response:', response)
      data.value = response.data
      return data.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    execute()
  })

  return { data, loading, error, execute }
}
