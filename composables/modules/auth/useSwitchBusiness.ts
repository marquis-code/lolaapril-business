import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'
import { useUser } from './user'
import type { Business } from '~/types/user'

export interface SwitchBusinessResponse {
  success: boolean
  message: string
  business: Business
  accessToken: string
  refreshToken: string
}

export const useSwitchBusiness = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { setToken, setRefreshToken, updateCurrentBusiness, user } = useUser()

  /**
   * Switch to a different business context
   * This will:
   * 1. Call the API to switch business context
   * 2. Update the tokens with new business context
   * 3. Update the current business in state
   * 4. Update user's currentBusinessId
   */
  const switchBusiness = async (businessId: string): Promise<SwitchBusinessResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const res = await auth_api.switchBusiness(businessId)
      const data = res.data?.data || res.data
      
      if (data.success) {
        // Update tokens with new business context
        if (data.accessToken) {
          setToken(data.accessToken)
        }
        if (data.refreshToken) {
          setRefreshToken(data.refreshToken)
        }
        
        // Update current business in state
        if (data.business) {
          updateCurrentBusiness(data.business, businessId)
        }
        
        console.log('✅ Business switched successfully:', data.business?.businessName)
      }
      
      return data
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to switch business'
      error.value = errorMessage
      console.error('❌ Switch business error:', errorMessage)
      throw e
    } finally {
      loading.value = false
    }
  }

  return { 
    loading, 
    error, 
    switchBusiness,
    // Alias for backwards compatibility
    SwitchBusiness: switchBusiness 
  }
}
