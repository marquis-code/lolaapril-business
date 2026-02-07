import { ref } from 'vue'
import { auth_api } from '~/api_factory/modules'
import { useUser } from './user'

export interface ClearContextResponse {
  success: boolean
  message: string
  accessToken: string
  refreshToken: string
}

export const useClearBusinessContext = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { setToken, setRefreshToken, clearCurrentBusiness } = useUser()

  /**
   * Clear the business context (switch to client mode)
   * This will:
   * 1. Remove business context from the session
   * 2. Get new tokens without business context
   * 3. Clear current business from local state
   */
  const clearBusinessContext = async (): Promise<ClearContextResponse> => {
    loading.value = true
    error.value = null
    
    try {
      const res = await auth_api.clearBusinessContext()
      const data = res.data?.data || res.data
      
      if (data.success) {
        // Update tokens (now without business context)
        if (data.accessToken) {
          setToken(data.accessToken)
        }
        if (data.refreshToken) {
          setRefreshToken(data.refreshToken)
        }
        
        // Clear current business from state
        clearCurrentBusiness()
        
        console.log('✅ Business context cleared - switched to client mode')
      }
      
      return data
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || 'Failed to clear business context'
      error.value = errorMessage
      console.error('❌ Clear business context error:', errorMessage)
      throw e
    } finally {
      loading.value = false
    }
  }

  return { 
    loading, 
    error, 
    clearBusinessContext,
    // Alias for backwards compatibility
    ClearBusinessContext: clearBusinessContext 
  }
}
